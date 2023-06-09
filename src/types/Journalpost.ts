import { JournalpostDto } from "../api/BidragDokumentApi";
import { DokumentDto } from "../api/BidragDokumentApi";

export function journalstatusToDisplayValue(journalstatus: string) {
    switch (journalstatus) {
        case JournalpostStatus.UNDER_PRODUKSJON:
            return "Under prod.";
        case JournalpostStatus.DISTRIBUERT:
            return "Distribuert";
        case JournalpostStatus.JOURNALFØRT:
            return "Journalført";
        case JournalpostStatus.KLAR_FOR_DISTRIBUSJON:
            return "Klar for distribusjon";
        case JournalpostStatus.UNDER_OPPRETELSE:
            return "Under opprettelse";
    }

    return journalstatus;
}

export enum JournalpostStatus {
    UNDER_OPPRETELSE = "UO",
    UNDER_PRODUKSJON = "D",
    JOURNALFØRT = "J",
    DISTRIBUERT = "E",
    KLAR_FOR_DISTRIBUSJON = "KP",
}
export interface IJournalpost extends JournalpostDto {
    erForsendelse: boolean;
    dokumenter: IDokumentJournalDto[];
}
export interface IDokumentJournalDto extends DokumentDto {
    originalJournalpostId?: string;
    originalDokumentreferanse?: string;
}
