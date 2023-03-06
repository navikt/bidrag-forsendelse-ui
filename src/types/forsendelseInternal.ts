import { DokumentRespons } from "../api/BidragForsendelseApi";
import { RolleType } from "../constants/RolleType";

type Dokumentstatus =
    | "IKKE_BESTILT"
    | "BESTILLING_FEILET"
    | "AVBRUTT"
    | "UNDER_PRODUKSJON"
    | "UNDER_REDIGERING"
    | "FERDIGSTILT";
export type Dokument = DokumentRespons;

export function dokumentstatusDisplayValue(status: Dokumentstatus) {
    switch (status) {
        case "UNDER_PRODUKSJON":
            return "Under produksjon";
        case "FERDIGSTILT":
            return "Ferdigstilt";
        case "UNDER_REDIGERING":
            return "Under redigering";
        case "BESTILLING_FEILET":
            return "Bestilling feilet";
        case "IKKE_BESTILT":
            return "Ikke bestilt";
        default:
            return "Ukjent status";
    }
}

export interface IRolleDetaljer {
    rolleType: RolleType;
    navn: string;
    ident: string;
}
