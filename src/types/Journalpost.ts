import { AvsenderMottakerDto } from "../api/BidragDokumentApi";
import { DokumentDto } from "../api/BidragDokumentApi";
import { AktorDto } from "../api/BidragDokumentApi";
import { KodeDto } from "../api/BidragDokumentApi";
import { DistribuerTilAdresse } from "../api/BidragDokumentApi";

export function journalstatusToDisplayValue(journalstatus: string) {
    switch (journalstatus) {
        case "D":
            return "Under prod.";
        case "E":
            return "Distribuert";
        case "J":
            return "Journalført";
        case "KP":
            return "Klar for distribusjon";
    }

    return journalstatus;
}
export interface IJournalpost {
    avsenderNavn?: string;
    avsenderMottaker?: AvsenderMottakerDto;
    dokumenter: DokumentDto[];
    dokumentDato?: string;
    dokumentTidspunkt?: string;
    ekspedertDato?: string;
    fagomrade?: string;
    gjelderIdent?: string;
    gjelderAktor?: AktorDto;
    innhold?: string;
    journalforendeEnhet?: string;
    journalfortAv?: string;

    journalfortDato?: string;
    journalpostId?: string;

    kilde?:
        | "NAV_NO_BID"
        | "SKAN_BID"
        | "NAV_NO"
        | "SKAN_NETS"
        | "LOKAL_UTSKRIFT"
        | "SENTRAL_UTSKRIFT"
        | "SDP"
        | "INGEN_DISTRIBUSJON";
    kanal?:
        | "NAV_NO_BID"
        | "SKAN_BID"
        | "NAV_NO"
        | "SKAN_NETS"
        | "LOKAL_UTSKRIFT"
        | "SENTRAL_UTSKRIFT"
        | "SDP"
        | "INGEN_DISTRIBUSJON";
    mottattDato?: string;
    dokumentType?: string;
    journalstatus?: string;
    feilfort?: boolean;
    brevkode?: KodeDto;
    distribuertTilAdresse?: DistribuerTilAdresse;
    /** Informasjon om returdetaljer til journalpost */
    sakstilknytninger: string[];
    /** Språket til dokumentet i Journalposten */
    språk?: string;
    /** Saksbehandler som opprettet journalposten */
    opprettetAvIdent?: string;
    /** Referanse til originale kilden til journalposten. Kan være referanse til forsendelse eller bidrag journalpost med prefiks. Feks BID_12323 eller BIF_123213 */
}
