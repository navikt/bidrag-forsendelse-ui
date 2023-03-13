import { MottakerTo } from "../api/BidragForsendelseApi";
import { IDokument } from "./Dokument";

export interface IForsendelse {
    isStaleData?: boolean;
    forsendelseId: string;
    gjelderIdent?: string;
    mottaker?: MottakerTo;
    dokumenter: IDokument[];
    saksnummer?: string;
    enhet?: string;
    opprettetAvIdent?: string;
    opprettetAvNavn?: string;
    tittel?: string;

    forsendelseType?: "UTGÅENDE" | "NOTAT";

    status?: "UNDER_PRODUKSJON" | "FERDIGSTILT" | "SLETTET" | "DISTRIBUERT" | "DISTRIBUERT_LOKALT";
    opprettetDato?: string;
}
