import { IRolleDetaljer, RolleType } from "@navikt/bidrag-ui-common";
import { AxiosResponse } from "axios";
import React from "react";
import { useQuery, UseQueryResult } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../api/api";
import { PERSON_API } from "../api/api";
import { SAK_API } from "../api/api";
import { BIDRAG_DOKUMENT_API } from "../api/api";
import { JournalpostDto } from "../api/BidragDokumentApi";
import { DokumentMalDetaljer } from "../api/BidragForsendelseApi";
import { PersonDto } from "../api/BidragPersonApi";
import { BidragSakDto } from "../api/BidragSakApi";
import { DokumentStatus } from "../constants/DokumentStatus";
import { SAKSNUMMER } from "../constants/fellestyper";
import { useSession } from "../pages/forsendelse/context/SessionContext";
import { IForsendelse } from "../types/Forsendelse";

interface UseForsendelseDataProps {
    hentForsendelse: () => IForsendelse;
    hentGjelder: () => IRolleDetaljer;
    hentMottaker: () => IRolleDetaljer;
    dokumentMalDetaljer: () => UseQueryResult<Record<string, DokumentMalDetaljer>>;
    hentRoller: () => IRolleDetaljer[];
    hentJournalposterForPerson: (ident: string) => Map<SAKSNUMMER, JournalpostDto[]>;
    hentJournalposterForSak: (saksnummer: string) => JournalpostDto[];
}
export function useForsendelseApi(): UseForsendelseDataProps {
    const { forsendelseId, saksnummer: saksnummerFromSession } = useSession();
    const saksnummer = saksnummerFromSession ?? hentForsendelseQuery().saksnummer;
    const hentSak = (): BidragSakDto => {
        const { data: sak, refetch } = useQuery({
            queryKey: `sak_${saksnummer}`,
            queryFn: ({ signal }) => SAK_API.bidragSak.findMetadataForSak(saksnummer),
        });

        return sak.data;
    };

    const hentJournalposterForPerson = (ident?: string): Map<SAKSNUMMER, JournalpostDto[]> => {
        if (!ident) return new Map<SAKSNUMMER, JournalpostDto[]>();
        const saker = hentSakerPerson(ident);
        const journalpostSakMap = new Map<SAKSNUMMER, JournalpostDto[]>();

        saker.forEach((saksnummer) => {
            journalpostSakMap.set(saksnummer, hentJournalposterForSak(saksnummer));
        });
        return journalpostSakMap;
    };
    const hentJournalposterForSak = (saksnummer: string): JournalpostDto[] => {
        console.log("Henter journalposter for sak", saksnummer);
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
        });

        return journalposter.data;
    };

    const hentSakerPerson = (ident: string): string[] => {
        const { data: sakerPerson, refetch } = useQuery({
            queryKey: `saker_person_${ident}`,
            queryFn: ({ signal }) => SAK_API.bidragSak.find(ident),
        });

        return sakerPerson.data.map((sak) => sak.saksnummer);
    };

    const hentRoller = (): IRolleDetaljer[] => {
        const sak = hentSak();

        return sak.roller.map((rolle) => ({
            rolleType: RolleType[rolle.rolleType],
            ident: rolle.fodselsnummer ?? rolle.samhandlerIdent,
            navn: hentPerson(rolle.fodselsnummer)?.navn,
        }));
    };

    const rolleISak = (ident: string): RolleType | null => {
        const sak = hentSak();
        return RolleType[sak.roller?.find((r) => r.fodselsnummer == ident)?.rolleType];
    };

    const hentPerson = (ident?: string): PersonDto => {
        if (!ident) {
            return { ident };
        }
        const { data: personData, refetch } = useQuery({
            queryKey: `person_${ident}`,
            queryFn: ({ signal }) => PERSON_API.informasjon.hentPersonPost({ ident }),
        });

        return personData.data;
    };
    const hentGjelder = (): IRolleDetaljer => {
        const forsendelse = hentForsendelseQuery();
        const gjelderIdent = forsendelse.gjelderIdent;
        const person = hentPerson(gjelderIdent);

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

        if (!mottaker.navn) {
            mottaker = hentPerson(mottaker.ident);
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
            queryKey: ["forsendelse", forsendelseId],
            queryFn: ({ signal }) => BIDRAG_FORSENDELSE_API.api.hentForsendelse(forsendelseId),
            enabled: forsendelseId != undefined,
            optimisticResults: false,
            select: React.useCallback((response: AxiosResponse) => {
                const forsendelse = response.data;
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
            onSuccess: (data) => {
                console.log("Hentet forsendelse", data);
            },
        });

        return {
            ...forsendelse,
            isStaleData: isRefetching,
        };
    }

    function dokumentMalDetaljer() {
        return useQuery({
            queryKey: "dokumentMalDetaljer",
            queryFn: ({ signal }) => BIDRAG_FORSENDELSE_API.api.stottedeDokumentmalDetaljer(),
            select: (data) => data.data,
            optimisticResults: false,
        });
    }

    return {
        hentForsendelse: hentForsendelseQuery,
        hentMottaker,
        dokumentMalDetaljer,
        hentGjelder,
        hentRoller,
        hentJournalposterForPerson,
        hentJournalposterForSak,
    };
}