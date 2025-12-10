import {
    IRolleDetaljer,
    ObjectUtils,
    RolleType,
    RolleTypeAbbreviation,
    RolleTypeFullName,
} from "@navikt/bidrag-ui-common";
import IdentUtils from "@navikt/bidrag-ui-common/esm/utils/IdentUtils";
import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import React from "react";

import { useBidragDokumentApi, useBidragForsendelseApi, usePersonApi, useSakApi } from "../api/api";
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
import { useHentPerson, useHentSamhandlerEllerPersonForIdent } from "./usePersonApi";

export type VedleggListe = { malId: string; detaljer: DokumentMalDetaljer }[];
export const UseForsendelseApiKeys = {
    forsendelse: ["forsendelse"],
    sak: ["sak"],
    hentForsendelse: (forsendelseId: string) => [
        ...UseForsendelseApiKeys.forsendelse,
        forsendelseId?.replace(/\D/g, "").toString(),
    ],
    sakerPerson: (personId: string) => [...UseForsendelseApiKeys.sak, personId],
    dokumentValg: (behandlingType: string, soknadFra: string, soknadType: string) => [
        UseForsendelseApiKeys.forsendelse,
        "dokumentValg",
        behandlingType,
        soknadFra,
        soknadType,
    ],
};

export const useHentSakerPerson = (ident: string): string[] => {
    const sakApi = useSakApi();
    const { data: sakerPerson } = useSuspenseQuery({
        queryKey: UseForsendelseApiKeys.sakerPerson(ident),
        queryFn: () => (ident ? sakApi.bidragSak.find(ident) : Promise.resolve({ data: [] })),
    });

    return sakerPerson.data.map((sak) => sak.saksnummer);
};

const selectMappedJournalposter = (response: AxiosResponse): IJournalpost[] => {
    const journalposter = response.data as JournalpostDto[];
    return journalposter.map((journalpost) => journalpostMapper(journalpost));
};

export const useHentJournalposterForSak = (saksnummer: string): IJournalpost[] => {
    // console.log("Henter journalposter for sak", saksnummer);
    const bidragDokumentApi = useBidragDokumentApi();
    const { data: journalposter } = useSuspenseQuery({
        queryKey: [`journal_sak_${saksnummer}`],
        queryFn: async () => {
            try {
                return await bidragDokumentApi.sak.hentJournal(
                    saksnummer,
                    { fagomrade: ["BID", "FAR"] },
                    {
                        paramsSerializer: {
                            indexes: null,
                        },
                    }
                );
            } catch {
                return { data: [] } as AxiosResponse;
            }
        },
        select: selectMappedJournalposter,
    });

    return journalposter;
};

export const useHentJournalposterForPerson = (ident?: string): Map<SAKSNUMMER, IJournalpost[]> => {
    const saker = useHentSakerPerson(ident);
    const bidragDokumentApi = useBidragDokumentApi();
    const journalposterQueries = useSuspenseQueries({
        queries: saker.map((saksnummer) => ({
            queryKey: ["journalposter", saksnummer],
            queryFn: async () => {
                try {
                    return await bidragDokumentApi.sak.hentJournal(
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
            select: selectMappedJournalposter,
            staleTime: Infinity,
        })),
    });

    const journalpostSakMap = new Map<string, IJournalpost[]>();
    saker.forEach((saksnummer, idx) => {
        journalpostSakMap.set(saksnummer, journalposterQueries[idx].data);
    });

    return journalpostSakMap;
};

const useHentSak = (): BidragSakDto => {
    const { saksnummer: saksnummerFromSession } = useSession();
    const { saksnummer: saksnummerFromForsendelse } = useHentForsendelseQuery();
    const sakApi = useSakApi();
    const saksnummer = saksnummerFromSession ?? saksnummerFromForsendelse;

    const { data: sak } = useSuspenseQuery({
        queryKey: [`sak_${saksnummer}`],
        queryFn: () => sakApi.bidragSak.findMetadataForSak(saksnummer),
    });

    return sak.data;
};

export const useHentRoller = () => {
    const sak = useHentSak();
    const idents = sak.roller.map((rolle) => rolle.fodselsnummer ?? rolle.samhandlerIdent);
    const personApi = usePersonApi();

    const personQueries = useSuspenseQueries({
        queries: idents.map((ident) => ({
            queryKey: ["person", ident],
            queryFn: async () => {
                if (!ident) return { ident: "", visningsnavn: "Ukjent" };
                const { data } = await personApi.informasjon.hentPersonPost({ ident });
                return data;
            },
        })),
    });

    return sak.roller.map((rolle, index) => ({
        rolleType: RolleTypeAbbreviation[rolle.rolleType] ?? RolleTypeFullName[rolle.rolleType],
        ident: rolle.fodselsnummer ?? rolle.samhandlerIdent,
        objektnummer: rolle.objektnummer,
        navn: personQueries[index]?.data?.visningsnavn,
    }));
};

const useRolleISak = (ident: string): RolleType | null => {
    const sak = useHentSak();
    return (
        RolleTypeAbbreviation[sak.roller?.find((r) => r.fodselsnummer === ident)?.rolleType] ||
        RolleTypeFullName[sak.roller?.find((r) => r.fodselsnummer === ident)?.rolleType]
    );
};

export const useHentGjelder = (): IRolleDetaljer => {
    const forsendelse = useHentForsendelseQuery();
    const gjelderIdent = forsendelse.gjelderIdent;
    const person = useHentPerson(gjelderIdent);

    const ident = gjelderIdent;
    const navn = person.visningsnavn;
    return {
        rolleType: useRolleISak(ident),
        navn,
        ident,
    };
};

export const useHentMottaker = (): IRolleDetaljer => {
    const forsendelse = useHentForsendelseQuery();
    const mottaker = forsendelse.mottaker;
    const defaultRolle = {} as IRolleDetaljer;
    const { data: samhandlerEllerPerson } = useHentSamhandlerEllerPersonForIdent(mottaker?.ident ?? "");
    const rolleType = useRolleISak(mottaker?.ident ?? "");

    if (!mottaker) return defaultRolle;

    const resolvedMottaker =
        !mottaker.navn || IdentUtils.isSamhandlerId(mottaker.ident) ? (samhandlerEllerPerson ?? mottaker) : mottaker;

    return {
        rolleType,
        navn: resolvedMottaker.navn,
        ident: resolvedMottaker.ident,
    };
};

export const useVedleggListe = () => {
    const { enhet } = useSession();
    const bidragForsendelseApi = useBidragForsendelseApi();
    return useSuspenseQuery({
        queryKey: [`vedlegg_liste`, enhet],
        queryFn: () => bidragForsendelseApi.api.stottedeDokumentmalDetaljer(),
        select: React.useCallback(
            (response: AxiosResponse): VedleggListe => {
                const dokumentmaler = response.data as Record<string, DokumentMalDetaljer>;
                return Object.entries(dokumentmaler)
                    .filter(
                        ([_, value]) =>
                            value.statiskInnhold &&
                            (value.tilhorerEnheter.length === 0 || value.tilhorerEnheter.includes(enhet))
                    )
                    .map(([key, value]) => ({
                        malId: key,
                        detaljer: value,
                    }));
            },
            [enhet]
        ),
    });
};

export const useHentStørrelseIMb = () => {
    const { forsendelseId } = useSession();
    const bidragForsendelseApi = useBidragForsendelseApi();
    const result = useSuspenseQuery({
        queryKey: ["forsendelse_størrelse", forsendelseId],
        queryFn: () => bidragForsendelseApi.api.henStorrelsePaDokumenter(forsendelseId),
        select: (data) => data.data,
    });
    return result.data;
};

export function useHentForsendelseQuery(): IForsendelse {
    const { forsendelseId, saksnummer: saksnummerFromSession } = useSession();
    const { addError } = useErrorContext();
    const bidragForsendelseApi = useBidragForsendelseApi();
    const { data: forsendelse, isRefetching } = useSuspenseQuery({
        queryKey: UseForsendelseApiKeys.hentForsendelse(forsendelseId),
        queryFn: async () => {
            if (!forsendelseId) return {} as IForsendelse;
            try {
                const response = await bidragForsendelseApi.api.hentForsendelse(forsendelseId, {
                    saksnummer: saksnummerFromSession,
                });
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
                            metadata: null,
                        };
                    }),
                };

                return forsendelseInternal;
            } catch (error) {
                const errorMessage = parseErrorMessageFromAxiosError(error);
                addError({
                    message: `Kunne ikke hente forsendelse: ${errorMessage}`,
                    source: "hentforsendelse",
                });
            }
        },
        retry: (retryCount, error: AxiosError) => {
            return error?.response?.status === HttpStatusCode.NotFound ? retryCount < 1 : retryCount < 3;
        },
        refetchOnWindowFocus: (query) => {
            const state = query.state;
            return state?.error?.response?.status !== HttpStatusCode.NotFound;
        },
        refetchInterval: (result) => {
            const data = result.state?.data;
            if (ObjectUtils.isEmpty(data)) return 0;
            const forsendelse = data as IForsendelse;
            const hasDokumentsWithStatus = forsendelse.dokumenter.some((d) =>
                [
                    "IKKE_BESTILT",
                    "UNDER_PRODUKSJON",
                    "BESTILLING_FEILET",
                    "UNDER_PRODUKSJON",
                    "UNDER_REDIGERING",
                    "MÅ_KONTROLLERES",
                ].includes(d.status)
            );
            return hasDokumentsWithStatus ? 3000 : 0;
        },
    });

    return {
        ...forsendelse,
        isStaleData: isRefetching,
    };
}
