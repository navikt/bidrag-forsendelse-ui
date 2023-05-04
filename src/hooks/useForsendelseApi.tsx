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

const UseForsendelseApiKeys = {
    forsendelse: "forsendelse",
    dokumentValg: (behandlingType: string, soknadFra: string, soknadType: string) => [
        UseForsendelseApiKeys.forsendelse,
        "dokumentValg",
        behandlingType,
        soknadFra,
        soknadType,
    ],
};
interface UseForsendelseDataProps {
    hentForsendelse: () => IForsendelse;
    hentGjelder: () => IRolleDetaljer;
    hentMottaker: () => IRolleDetaljer;
    dokumentMalDetaljer: (props: {
        behandlingType: BEHANDLING_TYPE;
        soknadType: SOKNAD_TYPE;
        soknadFra: SOKNAD_FRA;
        klage?: boolean;
        erVedtakFattet?: boolean;
        manuelBeregning?: boolean;
    }) => UseQueryResult<Record<string, DokumentMalDetaljer>>;
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

    function dokumentMalDetaljer(request: {
        behandlingType: BEHANDLING_TYPE;
        soknadType: SOKNAD_TYPE;
        soknadFra: SOKNAD_FRA;
        klage?: boolean;
        erVedtakFattet?: boolean;
        manuelBeregning?: boolean;
    }) {
        return useQuery({
            queryKey: "dokumentMalDetaljer",
            queryFn: ({ signal }) => BIDRAG_FORSENDELSE_API.api.hentDokumentValg(request),
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

export type BEHANDLING_TYPE =
    | "AVSKRIVNING"
    | "EKTEFELLEBIDRAG"
    | "BIDRAG_18_AR"
    | "BIDRAG"
    | "BIDRAG_TILLEGGSBIDRAG"
    | "DIREKTE_OPPGJOR"
    | "ETTERGIVELSE"
    | "ERSTATNING"
    | "FARSKAP"
    | "FORSKUDD"
    | "GEBYR"
    | "INNKREVING"
    | "MOTREGNING"
    | "REFUSJON_BIDRAG"
    | "SAKSOMKOSTNINGER"
    | "SARTILSKUDD"
    | "BIDRAG_18_AR_TILLEGGSBBI"
    | "TILLEGGSBIDRAG"
    | "TILBAKEKR_ETTERGIVELSE"
    | "TILBAKEKREVING"
    | "OPPFOSTRINGSBIDRAG"
    | "MORSKAP"
    | "KUNNSKAP_BIOLOGISK_FAR"
    | "BARNEBORTFORING"
    | "KV"
    | "REISEKOSTNADER";
export type SOKNAD_TYPE =
    | "ENDRING"
    | "EGET_TILTAK"
    | "SOKNAD"
    | "INNKREVINGSGRUNNL"
    | "INDEKSREG"
    | "KLAGE_BEGR_SATS"
    | "KLAGE"
    | "FOLGER_KLAGE"
    | "KONVERTERING"
    | "OMGJORING_BEGR_SATS"
    | "OPPJUST_FORSK"
    | "OPPHOR"
    | "OMGJORING"
    | "PRIVAT_AVTALE"
    | "BEGR_REVURD"
    | "REVURDERING"
    | "KR";
export type SOKNAD_FRA =
    | "BM_I_ANNEN_SAK"
    | "BARN_18"
    | "BIDRAGSENHET"
    | "FYLKESNEMDA"
    | "NAV_INTERNASJONALT"
    | "KOMMUNE"
    | "KONVERTERING"
    | "BIDRAGSMOTTAKER"
    | "NORSKE_MYNDIGH"
    | "BIDRAGSPLIKTIG"
    | "UTENLANDSKE_MYNDIGH"
    | "VERGE"
    | "TI"
    | "KLAGE_ENHET";
