import { AxiosResponse } from "axios";

import { EttersendingsoppgaveDto, ForsendelseResponsTo } from "../api/BidragForsendelseApi";
import { VarselDokumentType } from "../pages/forsendelse/context/DokumenterFormContext";
import { BestemKanalResponseDistribusjonskanalEnum } from "./../api/BidragDokumentArkivApi";

export function mapVarselEttersendelse(ettersendingsoppgave: EttersendingsoppgaveDto) {
    return (
        ettersendingsoppgave && {
            tittel: ettersendingsoppgave.tittel,
            journalpostId: ettersendingsoppgave.ettersendelseForJournalpostId,
            innsendingsfristDager: ettersendingsoppgave.innsendingsfristDager,
            vedleggsliste: ettersendingsoppgave.vedleggsliste?.map((d) => ({
                ...d,
                varselDokumentId: d.id,
                type: (d.skjemaId ? "SKJEMA" : "FRITEKST") as VarselDokumentType,
            })),
        }
    );
}

export function mapForsendelseResponse(ettersendingsoppgave: EttersendingsoppgaveDto) {
    return (prev: AxiosResponse<ForsendelseResponsTo>) => {
        return {
            ...prev,
            data: {
                ...prev.data,
                ettersendingsoppgave: ettersendingsoppgave,
            },
        };
    };
}
export function mapToDistribusjonKanalBeskrivelse(distribusjonKanal: BestemKanalResponseDistribusjonskanalEnum) {
    switch (distribusjonKanal) {
        case "PRINT":
            return "Fysisk (Sentral print)";
        case "SDP":
            return "Digitalt (Digital postkasse)";
        case "DITT_NAV":
            return "Digitalt (Nav.no)";
    }
}
