import { IRolleDetaljer, RolleType } from "@navikt/bidrag-ui-common";
import IdentUtils from "@navikt/bidrag-ui-common/esm/utils/IdentUtils";
import { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import React from "react";
import { useQuery } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../api/api";
import { SAK_API } from "../api/api";
import { BIDRAG_DOKUMENT_API } from "../api/api";
import { JournalpostDto } from "../api/BidragDokumentApi";
import { ForsendelseResponsTo } from "../api/BidragForsendelseApi";
import { BidragSakDto } from "../api/BidragSakApi";
import { DokumentStatus } from "../constants/DokumentStatus";
import { SAKSNUMMER } from "../constants/fellestyper";
import { useErrorContext } from "../context/ErrorProvider";
import { useSession } from "../pages/forsendelse/context/SessionContext";
import { IForsendelse } from "../types/Forsendelse";
import { IJournalpost } from "../types/Journalpost";
import { parseErrorMessageFromAxiosError } from "../utils/ErrorUtils";
import { journalpostMapper } from "./useDokumentApi";
import useSamhandlerPersonApi from "./usePersonApi";

export const UseForsendelseApiKeys = {
    forsendelse: "forsendelse",
    sak: "sak",
    hentForsendelse: () => [UseForsendelseApiKeys.forsendelse],
    sakerPerson: (personId: string) => [UseForsendelseApiKeys.sak, personId],
    dokumentValg: (behandlingType: string, soknadFra: string, soknadType: string) => [
        UseForsendelseApiKeys.forsendelse,
        "dokumentValg",
        behandlingType,
        soknadFra,
        soknadType,
    ],
};

interface UseForsendelseDataProps {
    kanEndre: () => boolean;
    hentForsendelse: () => IForsendelse;
    hentGjelder: () => IRolleDetaljer;
    hentMottaker: () => IRolleDetaljer;
    hentRoller: () => IRolleDetaljer[];
    hentJournalposterForPerson: (ident?: string) => Map<SAKSNUMMER, IJournalpost[]>;
    hentJournalposterForSak: (saksnummer: string) => IJournalpost[];
}
export function useForsendelseApi(): UseForsendelseDataProps {
    const { forsendelseId, saksnummer: saksnummerFromSession } = useSession();
    const { addError } = useErrorContext();
    const saksnummer = saksnummerFromSession ?? hentForsendelseQuery().saksnummer;
    const hentSak = (): BidragSakDto => {
        const { data: sak, refetch } = useQuery({
            queryKey: `sak_${saksnummer}`,
            queryFn: ({ signal }) => SAK_API.bidragSak.findMetadataForSak(saksnummer),
        });

        return sak.data;
    };

    const hentJournalposterForPerson = (ident?: string): Map<SAKSNUMMER, IJournalpost[]> => {
        if (!ident) return new Map<SAKSNUMMER, IJournalpost[]>();
        const saker = hentSakerPerson(ident);
        const journalpostSakMap = new Map<SAKSNUMMER, IJournalpost[]>();

        saker.forEach((saksnummer) => {
            journalpostSakMap.set(saksnummer, hentJournalposterForSak(saksnummer));
        });
        return journalpostSakMap;
    };
    const hentJournalposterForSak = (saksnummer: string): IJournalpost[] => {
        // console.log("Henter journalposter for sak", saksnummer);
        const { data: journalposter } = useQuery({
            queryKey: `journal_sak_${saksnummer}`,
            queryFn: ({ signal }) =>
                BIDRAG_DOKUMENT_API.sak.hentJournal(
                    saksnummer,
                    { fagomrade: ["BID", "FAR"] },
                    {
                        paramsSerializer: {
                            indexes: null,
                        },
                    }
                ),
            select: React.useCallback((response: AxiosResponse): IJournalpost[] => {
                const journalposter = response.data as JournalpostDto[];
                return journalposter.map((journalpost) => journalpostMapper(journalpost));
            }, []),
        });

        return journalposter;
    };

    const hentSakerPerson = (ident: string): string[] => {
        const { data: sakerPerson, refetch } = useQuery({
            queryKey: UseForsendelseApiKeys.sakerPerson(ident),
            queryFn: ({ signal }) => SAK_API.bidragSak.find(ident),
        });

        return sakerPerson.data.map((sak) => sak.saksnummer);
    };

    const hentRoller = (): IRolleDetaljer[] => {
        const sak = hentSak();

        return sak.roller.map((rolle) => ({
            rolleType: RolleType[rolle.rolleType],
            ident: rolle.fodselsnummer ?? rolle.samhandlerIdent,
            navn: useSamhandlerPersonApi().hentPerson(rolle.fodselsnummer)?.navn,
        }));
    };

    const rolleISak = (ident: string): RolleType | null => {
        const sak = hentSak();
        return RolleType[sak.roller?.find((r) => r.fodselsnummer == ident)?.rolleType];
    };

    const hentGjelder = (): IRolleDetaljer => {
        const forsendelse = hentForsendelseQuery();
        const gjelderIdent = forsendelse.gjelderIdent;
        const person = useSamhandlerPersonApi().hentPerson(gjelderIdent);

        const ident = gjelderIdent;
        const navn = person.navn;
        return {
            rolleType: rolleISak(ident),
            navn,
            ident,
        };
    };

    const hentMottaker = (): IRolleDetaljer => {
        const forsendelse = hentForsendelseQuery();
        let mottaker = forsendelse.mottaker;
        // TODO: Sjekk om mottaker er samhandler

        if (!mottaker) return {};

        if (!mottaker.navn || IdentUtils.isSamhandlerId(mottaker.ident)) {
            mottaker = useSamhandlerPersonApi().hentSamhandlerEllerPersonForIdent(mottaker.ident)?.data ?? mottaker;
        }

        const ident = mottaker.ident;
        const navn = mottaker.navn;
        return {
            rolleType: rolleISak(ident),
            navn,
            ident,
        };
    };
    function hentForsendelseQuery(): IForsendelse {
        const { data: forsendelse, isRefetching } = useQuery({
            queryKey: UseForsendelseApiKeys.hentForsendelse(),
            queryFn: () => BIDRAG_FORSENDELSE_API.api.hentForsendelse(forsendelseId, { saksnummer }),
            enabled: forsendelseId != undefined,
            optimisticResults: false,
            retry: (retryCount, error: AxiosError) => {
                return error?.response?.status == HttpStatusCode.NotFound ? false : retryCount < 3;
            },
            refetchInterval: (data) => {
                if (!data) return 0;
                const forsendelse = data as IForsendelse;
                const hasDokumentsWithStatus = forsendelse.dokumenter.some((d) =>
                    [
                        "UNDER_PRODUKSJON",
                        "BESTILLING_FEILET",
                        "UNDER_PRODUKSJON",
                        "UNDER_REDIGERING",
                        "MÅ_KONTROLLERES",
                    ].includes(d.status)
                );
                return hasDokumentsWithStatus ? 0 : 0;
                // return 0;
            },
            select: React.useCallback((response: AxiosResponse): IForsendelse => {
                const forsendelse = response.data as ForsendelseResponsTo;
                return {
                    ...forsendelse,
                    forsendelseId,
                    dokumenter: forsendelse.dokumenter.map((dokument, index) => {
                        return {
                            ...dokument,
                            status: DokumentStatus[dokument.status],
                            fraSaksnummer: forsendelse.saksnummer,
                            lagret: true,
                            index,
                        };
                    }),
                };
            }, []),
            onError: (error: AxiosError) => {
                const errorMessage = parseErrorMessageFromAxiosError(error);
                addError({
                    message: `Kunne ikke hente forsendelse: ${errorMessage}`,
                    source: "hentforsendelse",
                });
            },
            useErrorBoundary: false,
        });

        return {
            ...forsendelse,
            isStaleData: isRefetching,
        };
    }

    function kanEndre() {
        const forsendelse = hentForsendelseQuery();
        return forsendelse.status == "UNDER_PRODUKSJON";
    }

    return {
        hentForsendelse: hentForsendelseQuery,
        hentMottaker,
        hentGjelder,
        hentRoller,
        hentJournalposterForPerson,
        hentJournalposterForSak,
        kanEndre,
    };
}
