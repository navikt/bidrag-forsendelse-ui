import { useSuspenseQuery, UseSuspenseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { BIDRAG_DOKUMENT_API, BIDRAG_DOKUMENT_ARKIV_API, BIDRAG_FORSENDELSE_API } from "../api/api";
import { DokumentDto, DokumentTilgangResponse, JournalpostDto } from "../api/BidragDokumentApi";
import { BestemKanalResponse, BestemKanalResponseDistribusjonskanalEnum } from "../api/BidragDokumentArkivApi";
import { HentDokumentValgRequest } from "../api/BidragForsendelseApi";
import { useSession } from "../pages/forsendelse/context/SessionContext";
import { AvvikType } from "../types/AvvikTypes";
import { IDokumentJournalDto, IJournalpost } from "../types/Journalpost";
import { useHentNavSkjemaer } from "./kodeverkQueries";
import { useForsendelseApi, useHentForsendelseQuery } from "./useForsendelseApi";
const DokumentQueryKeys = {
    dokument: "dokument",
    hentJournal: (saksnummer: string) => [DokumentQueryKeys.dokument, "journal", saksnummer],
    hentJournalpost: (jpId: string) => [DokumentQueryKeys.dokument, "hentJournalpost", jpId],
    tilgangDokument: (jpId: string, dokref: string) => [DokumentQueryKeys.dokument, "tilgang", jpId, dokref],
    hentAvvikListe: (jpId: string) => [DokumentQueryKeys.dokument, "hentAvvikListe", jpId],
    hentAvvik: (jpId: string) => [DokumentQueryKeys.dokument, "hentAvvik", jpId],
    hentDistribusjonKanal: (mottakerId: string, gjelderId: string) => [
        DokumentQueryKeys.dokument,
        "hentDistribusjonKanal",
        gjelderId,
        mottakerId,
    ],
};
export default function useDokumentApi() {
    const { forsendelseId, saksnummer, enhet } = useSession();
    function dokumentMalDetaljerForsendelse() {
        return useSuspenseQuery({
            queryKey: ["dokumentMalDetaljer", forsendelseId],
            queryFn: () => BIDRAG_FORSENDELSE_API.api.hentDokumentValgForForsendelse(forsendelseId),
            select: (data) => data.data,
        });
    }
    function dokumentMalDetaljer(request: HentDokumentValgRequest) {
        return useSuspenseQuery({
            queryKey: [
                "dokumentMalDetaljer",
                request.behandlingType,
                request.vedtakType,
                request.soknadFra,
                request.erFattetBeregnet,
                enhet,
            ],
            queryFn: () => BIDRAG_FORSENDELSE_API.api.hentDokumentValg({ ...request, enhet }),
            select: (data) => data.data,
            retry: (failureCount, error: AxiosError) => {
                if (error.response.status == 400) return false;
                return failureCount < 3;
            },
        });
    }

    function hentNotatMalDetaljer(request: HentDokumentValgRequest) {
        return useSuspenseQuery({
            queryKey: ["notatDetaljer", request?.vedtakType],
            queryFn: () => BIDRAG_FORSENDELSE_API.api.hentDokumentValgNotater({ ...request, enhet }),
            select: (data) => data.data,
        });
    }

    function hentJournalpost(journalpostId: string) {
        return useSuspenseQuery({
            queryKey: DokumentQueryKeys.hentJournalpost(journalpostId),
            queryFn: () => BIDRAG_DOKUMENT_API.journal.hentJournalpost(journalpostId),
            select: (data): IJournalpost => journalpostMapper(data.data.journalpost, data.data.sakstilknytninger),
        });
    }

    function hentDokumentUrl(
        journalpostId: string,
        dokumentreferanse?: string
    ): UseSuspenseQueryResult<DokumentTilgangResponse> {
        return useSuspenseQuery({
            queryKey: DokumentQueryKeys.tilgangDokument(journalpostId, dokumentreferanse),
            queryFn: () =>
                BIDRAG_DOKUMENT_API.tilgang.giTilgangTilDokument(journalpostId, dokumentreferanse, {
                    headers: {
                        "X-enhet": enhet,
                    },
                }),
            select: (data) => {
                return data.data as DokumentTilgangResponse;
            },
        });
    }

    function hentAvvikListe(
        _journalpostId: string,
        saksnummer?: string,
        enhet?: string
    ): UseSuspenseQueryResult<AvvikType[]> {
        const journalpostId = _journalpostId.startsWith("BIF") ? _journalpostId : `BIF-${_journalpostId}`;
        return useSuspenseQuery({
            queryKey: DokumentQueryKeys.hentAvvikListe(journalpostId),
            queryFn: () =>
                BIDRAG_DOKUMENT_API.journal.hentAvvik(
                    journalpostId,
                    { saksnummer },
                    {
                        headers: {
                            "X-enhet": enhet,
                        },
                    }
                ),
            select: (data) => {
                return data.data as AvvikType[];
            },
        });
    }

    function distribusjonKanal(): BestemKanalResponse {
        const forsendelse = useForsendelseApi().hentForsendelse();
        const størrelseIMb = useForsendelseApi().hentStørrelseIMb();
        const gjelderId = forsendelse.gjelderIdent;
        const mottakerId = forsendelse.mottaker?.ident;
        const result = useSuspenseQuery({
            queryKey: DokumentQueryKeys.hentDistribusjonKanal(mottakerId, mottakerId),
            queryFn: async () => {
                if (gjelderId != mottakerId)
                    return {
                        distribusjonskanal: BestemKanalResponseDistribusjonskanalEnum.PRINT,
                        regelBegrunnelse: "Gjelder er ulik mottaker",
                        regel: "",
                    };
                return (
                    await BIDRAG_DOKUMENT_ARKIV_API.journal.hentDistribusjonKanal({
                        mottakerId,
                        gjelderId,
                        tema: forsendelse.tema,
                        forsendelseStoerrelse: størrelseIMb,
                    })
                )?.data;
            },
        });

        return result.data;
    }
    return {
        hentDokumentUrl,
        distribusjonKanal,
        hentNotatMalDetaljer,
        dokumentMalDetaljerForsendelse,
        dokumentMalDetaljer,
        hentJournalpost,
        hentAvvikListe,
    };
}

const useHentJournal = () => {
    const { saksnummer } = useSession();
    return useSuspenseQuery({
        queryKey: DokumentQueryKeys.hentJournal(saksnummer),
        queryFn: async () => {
            return await BIDRAG_DOKUMENT_API.sak.hentJournal(
                saksnummer,
                { fagomrade: ["BID", "FAR"] },
                {
                    paramsSerializer: {
                        indexes: null,
                    },
                }
            );
        },
    }).data;
};

export const useHentJournalInngående = () => {
    const forsendelse = useHentForsendelseQuery();
    const navskjemaer = useHentNavSkjemaer();
    const skjemaIder = navskjemaer
        .map((skjema) => skjema.kode)
        .filter((kode) => !kode.toLowerCase().startsWith("nave"));
    const journalposter = useHentJournal();
    return journalposter.data
        .filter((jp) => jp.gjelderAktor?.ident === forsendelse.gjelderIdent)
        .filter((jp) => jp.dokumentType === "I")
        .filter((jp) => jp.dokumenter.some((d) => skjemaIder.includes(d.dokumentmalId)));
};

export enum DistribusjonKanalUkjentEnum {
    UKJENT,
}
export type DistribusjonKanalEnum = BestemKanalResponseDistribusjonskanalEnum & DistribusjonKanalUkjentEnum;

export function journalpostMapper(journalpost: JournalpostDto, sakstilknytninger?: string[]): IJournalpost {
    const isForsendelse = () => journalpost.journalpostId?.startsWith("BIF");
    const journalpostIdNoPrefix = () => journalpost.journalpostId?.replace(/\D/g, "");

    return {
        ...journalpost,
        erForsendelse: isForsendelse(),
        sakstilknytninger: journalpost.sakstilknytninger ?? sakstilknytninger,
        journalpostIdNoPrefix: journalpostIdNoPrefix(),
        dokumentDato: journalpost.dokumentDato ?? journalpost.journalfortDato,
        dokumenter: journalpost.dokumenter.map((dokument, i) => dokumentMapper(journalpost, dokument, i)),
    };
}
export function dokumentMapper(journalpost: JournalpostDto, dokument: DokumentDto, index: number): IDokumentJournalDto {
    return {
        ...dokument,
        journalpostId: journalpost.journalpostId,
        originalJournalpostId: dokument.metadata?.originalJournalpostId,
        originalDokumentreferanse: dokument.metadata?.originalDokumentreferanse,
    };
}
