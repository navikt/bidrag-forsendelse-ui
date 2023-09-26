import { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "react-query";

import { BIDRAG_DOKUMENT_API, BIDRAG_DOKUMENT_ARKIV_API, BIDRAG_FORSENDELSE_API } from "../api/api";
import { DokumentDto, JournalpostDto } from "../api/BidragDokumentApi";
import { BestemKanalResponse, BestemKanalResponseDistribusjonskanalEnum } from "../api/BidragDokumentArkivApi";
import { HentDokumentValgRequest } from "../api/BidragForsendelseApi";
import { useSession } from "../pages/forsendelse/context/SessionContext";
import { AvvikType } from "../types/AvvikTypes";
import { IDokumentJournalDto, IJournalpost } from "../types/Journalpost";
import { useForsendelseApi } from "./useForsendelseApi";
const DokumentQueryKeys = {
    dokument: "dokument",
    hentJournalpost: (jpId: string) => [DokumentQueryKeys.dokument, "hentJournalpost", jpId],
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

    function hentNotatMalDetaljer(request: HentDokumentValgRequest) {
        return useQuery({
            queryKey: ["notatDetaljer", request?.vedtakType],
            queryFn: ({ signal }) => BIDRAG_FORSENDELSE_API.api.hentDokumentValgNotater({ ...request, enhet }),
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

    function distribusjonKanal(): BestemKanalResponse {
        const forsendelse = useForsendelseApi().hentForsendelse();
        const størrelseIMb = useForsendelseApi().hentStørrelseIMb();
        const gjelderId = forsendelse.gjelderIdent;
        const mottakerId = forsendelse.mottaker?.ident;
        const result = useQuery({
            queryKey: DokumentQueryKeys.hentDistribusjonKanal(mottakerId, mottakerId),
            queryFn: () =>
                BIDRAG_DOKUMENT_ARKIV_API.journal.hentDistribusjonKanal({
                    mottakerId,
                    gjelderId,
                    tema: forsendelse.tema,
                    forsendelseStoerrelse: størrelseIMb,
                }),
            select: (data) => {
                return data.data;
            },
            enabled: gjelderId == mottakerId,
        });

        return (
            result.data ?? {
                distribusjonskanal: BestemKanalResponseDistribusjonskanalEnum.PRINT,
                regelBegrunnelse: "Gjelder er ulik mottaker",
                regel: "",
            }
        );
    }
    return {
        distribusjonKanal,
        hentNotatMalDetaljer,
        dokumentMalDetaljerForsendelse,
        dokumentMalDetaljer,
        hentJournalpost,
        hentAvvikListe,
    };
}

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
