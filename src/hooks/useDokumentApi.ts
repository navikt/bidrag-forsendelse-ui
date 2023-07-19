import { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "react-query";

import { BIDRAG_DOKUMENT_API, BIDRAG_FORSENDELSE_API } from "../api/api";
import { DokumentDto, JournalpostDto } from "../api/BidragDokumentApi";
import { HentDokumentValgRequest } from "../api/BidragForsendelseApi";
import { useSession } from "../pages/forsendelse/context/SessionContext";
import { AvvikType } from "../types/AvvikTypes";
import { IDokumentJournalDto, IJournalpost } from "../types/Journalpost";
const DokumentQueryKeys = {
    dokument: "dokument",
    hentJournalpost: (jpId: string) => [DokumentQueryKeys.dokument, "hentJournalpost", jpId],
    hentAvvikListe: (jpId: string) => [DokumentQueryKeys.dokument, "hentAvvikListe", jpId],
    hentAvvik: (jpId: string) => [DokumentQueryKeys.dokument, "hentAvvik", jpId],
};
export default function useDokumentApi() {
    const { forsendelseId, saksnummer, enhet } = useSession();
    function dokumentMalDetaljerForsendelse() {
        return useQuery({
            queryKey: ["dokumentMalDetaljer", forsendelseId],
            queryFn: ({ signal }) => BIDRAG_FORSENDELSE_API.api.hentDokumentValgForForsendelse(forsendelseId),
            select: (data) => data.data,
            optimisticResults: false,
        });
    }
    function dokumentMalDetaljer(request: HentDokumentValgRequest) {
        return useQuery({
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
            optimisticResults: false,
        });
    }

    function hentNotatMalDetaljer() {
        return useQuery({
            queryKey: "notatDetaljer",
            queryFn: ({ signal }) => BIDRAG_FORSENDELSE_API.api.hentDokumentValgNotater(),
            select: (data) => data.data,
            optimisticResults: false,
        });
    }

    function hentJournalpost(journalpostId: string) {
        return useQuery({
            queryKey: DokumentQueryKeys.hentJournalpost(journalpostId),
            queryFn: () => BIDRAG_DOKUMENT_API.journal.hentJournalpost(journalpostId),
            select: (data): IJournalpost => journalpostMapper(data.data.journalpost, data.data.sakstilknytninger),
        });
    }

    function hentAvvikListe(_journalpostId: string, saksnummer?: string, enhet?: string): UseQueryResult<AvvikType[]> {
        const journalpostId = _journalpostId.startsWith("BIF") ? _journalpostId : `BIF-${_journalpostId}`;
        return useQuery({
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

    return {
        hentNotatMalDetaljer,
        dokumentMalDetaljerForsendelse,
        dokumentMalDetaljer,
        hentJournalpost,
        hentAvvikListe,
    };
}

export function journalpostMapper(journalpost: JournalpostDto, sakstilknytninger?: string[]): IJournalpost {
    const isForsendelse = () => journalpost.journalpostId?.startsWith("BIF");
    const journalpostIdNoPrefix = () => journalpost.journalpostId?.replace(/\D/g, "");

    return {
        ...journalpost,
        erForsendelse: isForsendelse(),
        sakstilknytninger: journalpost.sakstilknytninger ?? sakstilknytninger,
        journalpostIdNoPrefix: journalpostIdNoPrefix(),
        dokumenter: journalpost.dokumenter.map((dokument, i) => dokumentMapper(journalpost, dokument, i)),
    };
}
export function dokumentMapper(journalpost: JournalpostDto, dokument: DokumentDto, index: number): IDokumentJournalDto {
    return {
        ...dokument,
        originalJournalpostId: dokument.metadata?.originalJournalpostId,
        originalDokumentreferanse: dokument.metadata?.originalDokumentreferanse,
    };
}
