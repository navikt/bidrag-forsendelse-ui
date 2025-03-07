import { IRolleDetaljer, RolleType, RolleTypeAbbreviation, RolleTypeFullName } from "@navikt/bidrag-ui-common";
import IdentUtils from "@navikt/bidrag-ui-common/esm/utils/IdentUtils";
import { useSuspenseQuery, UseSuspenseQueryResult } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import React from "react";

import { BIDRAG_FORSENDELSE_API } from "../api/api";
import { SAK_API } from "../api/api";
import { BIDRAG_DOKUMENT_API } from "../api/api";
import { JournalpostDto } from "../api/BidragDokumentApi";
import { DokumentMalDetaljer, ForsendelseResponsTo } from "../api/BidragForsendelseApi";
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

export type VedleggListe = { malId: string; detaljer: DokumentMalDetaljer }[];
export const UseForsendelseApiKeys = {
    forsendelse: ["forsendelse"],
    sak: ["sak"],
    hentForsendelse: () => [...UseForsendelseApiKeys.forsendelse],
    sakerPerson: (personId: string) => [...UseForsendelseApiKeys.sak, personId],
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
    hentStørrelseIMb: () => number;
    hentGjelder: () => IRolleDetaljer;
    hentMottaker: () => IRolleDetaljer;
    hentRoller: () => IRolleDetaljer[];
    hentJournalposterForPerson: (ident?: string) => Map<SAKSNUMMER, IJournalpost[]>;
    hentJournalposterForSak: (saksnummer: string) => IJournalpost[];
    vedleggListe: () => UseSuspenseQueryResult<VedleggListe>;
}
export function useForsendelseApi(): UseForsendelseDataProps {
    const { forsendelseId, saksnummer: saksnummerFromSession } = useSession();
    const { addError } = useErrorContext();
    const saksnummer = saksnummerFromSession ?? useHentForsendelseQuery().saksnummer;
    const hentSak = (): BidragSakDto => {
        const { data: sak, refetch } = useSuspenseQuery({
            queryKey: [`sak_${saksnummer}`],
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
        const { data: journalposter } = useSuspenseQuery({
            queryKey: [`journal_sak_${saksnummer}`],
            queryFn: async ({ signal }) => {
                try {
                    return await BIDRAG_DOKUMENT_API.sak.hentJournal(
                        saksnummer,
                        { fagomrade: ["BID", "FAR"] },
                        {
                            paramsSerializer: {
                                indexes: null,
                            },
                        }
                    );
                } catch (error) {
                    console.log("Error", error);
                    return { data: [] } as AxiosResponse;
                }
            },
            select: React.useCallback((response: AxiosResponse): IJournalpost[] => {
                const journalposter = response.data as JournalpostDto[];
                return journalposter.map((journalpost) => journalpostMapper(journalpost));
            }, []),
        });

        return journalposter;
    };

    const hentSakerPerson = (ident: string): string[] => {
        const { data: sakerPerson, refetch } = useSuspenseQuery({
            queryKey: UseForsendelseApiKeys.sakerPerson(ident),
            queryFn: ({ signal }) => SAK_API.bidragSak.find(ident),
        });

        return sakerPerson.data.map((sak) => sak.saksnummer);
    };

    const hentRoller = (): IRolleDetaljer[] => {
        const sak = hentSak();

        return sak.roller.map((rolle) => ({
            rolleType: RolleTypeAbbreviation[rolle.rolleType] ?? RolleTypeFullName[rolle.rolleType],
            ident: rolle.fodselsnummer ?? rolle.samhandlerIdent,
            objektnummer: rolle.objektnummer,
            navn: useSamhandlerPersonApi().hentPerson(rolle.fodselsnummer)?.visningsnavn,
        }));
    };

    const rolleISak = (ident: string): RolleType | null => {
        const sak = hentSak();
        return (
            RolleTypeAbbreviation[sak.roller?.find((r) => r.fodselsnummer == ident)?.rolleType] ||
            RolleTypeFullName[sak.roller?.find((r) => r.fodselsnummer == ident)?.rolleType]
        );
    };

    const hentGjelder = (): IRolleDetaljer => {
        const forsendelse = useHentForsendelseQuery();
        const gjelderIdent = forsendelse.gjelderIdent;
        const person = useSamhandlerPersonApi().hentPerson(gjelderIdent);

        const ident = gjelderIdent;
        const navn = person.visningsnavn;
        return {
            rolleType: rolleISak(ident),
            navn,
            ident,
        };
    };

    const hentMottaker = (): IRolleDetaljer => {
        const forsendelse = useHentForsendelseQuery();
        let mottaker = forsendelse.mottaker;
        // TODO: Sjekk om mottaker er samhandler

        if (!mottaker) return {} as IRolleDetaljer;

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

    function vedleggListe() {
        const { enhet } = useSession();
        return useSuspenseQuery({
            queryKey: [`vedlegg_liste`],
            queryFn: () => BIDRAG_FORSENDELSE_API.api.stottedeDokumentmalDetaljer(),
            select: React.useCallback((response: AxiosResponse): VedleggListe => {
                const dokumentmaler = response.data as Record<string, DokumentMalDetaljer>;
                return Object.entries(dokumentmaler)
                    .filter(
                        ([key, value]) =>
                            value.statiskInnhold &&
                            (value.tilhorerEnheter.length == 0 || value.tilhorerEnheter.includes(enhet))
                    )
                    .map(([key, value]) => ({
                        malId: key,
                        detaljer: value,
                    }));
            }, []),
        });
    }

    function kanEndre() {
        const forsendelse = useHentForsendelseQuery();
        return forsendelse.status == "UNDER_PRODUKSJON";
    }

    function hentStørrelseIMb(): number {
        const result = useSuspenseQuery({
            queryKey: ["forsendelse_størrelse"],
            queryFn: () => BIDRAG_FORSENDELSE_API.api.henStorrelsePaDokumenter(forsendelseId),
            select: (data) => data.data,
        });
        return result.data;
    }
    return {
        hentForsendelse: useHentForsendelseQuery,
        hentMottaker,
        hentGjelder,
        hentRoller,
        hentJournalposterForPerson,
        hentJournalposterForSak,
        kanEndre,
        hentStørrelseIMb,
        vedleggListe,
    };
}
export function useHentForsendelseQuery(): IForsendelse {
    const { forsendelseId, saksnummer: saksnummerFromSession } = useSession();
    const { addError } = useErrorContext();
    const { data: forsendelse, isRefetching } = useSuspenseQuery({
        queryKey: UseForsendelseApiKeys.hentForsendelse(),
        queryFn: () => {
            try {
                return BIDRAG_FORSENDELSE_API.api.hentForsendelse(forsendelseId, {
                    saksnummer: saksnummerFromSession,
                });
            } catch (error) {
                const errorMessage = parseErrorMessageFromAxiosError(error);
                addError({
                    message: `Kunne ikke hente forsendelse: ${errorMessage}`,
                    source: "hentforsendelse",
                });
            }
        },
        retry: (retryCount, error: AxiosError) => {
            return error?.response?.status == HttpStatusCode.NotFound ? retryCount < 1 : retryCount < 3;
        },
        refetchOnWindowFocus: (query) => {
            const state = query.state;
            return state?.error?.response?.status != HttpStatusCode.NotFound;
        },
        refetchInterval: (result) => {
            const data = result.state?.data;
            if (!data) return 0;
            const forsendelse = data.data as IForsendelse;
            const hasDokumentsWithStatus = forsendelse.dokumenter.some((d) =>
                [
                    "UNDER_PRODUKSJON",
                    "BESTILLING_FEILET",
                    "UNDER_PRODUKSJON",
                    "UNDER_REDIGERING",
                    "MÅ_KONTROLLERES",
                ].includes(d.status)
            );
            return hasDokumentsWithStatus ? 3000 : 0;
        },
        select: React.useCallback((response: AxiosResponse): IForsendelse => {
            const forsendelse = response.data as ForsendelseResponsTo;

            const forsendelseInternal: IForsendelse = {
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

            return forsendelseInternal;
        }, []),
    });

    return {
        ...forsendelse,
        isStaleData: isRefetching,
    };
}
