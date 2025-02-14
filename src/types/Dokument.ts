import { RolleType } from "@navikt/bidrag-ui-common";

import { DokumentArkivSystemDto } from "../api/BidragDokumentApi";
import { DokumentDto } from "../api/BidragForsendelseApi";
import { DokumentStatus } from "../constants/DokumentStatus";

export interface IDokument extends DokumentDto {
    index: number;
    journalpostId?: string;
    erSkjema?: boolean;
    dokumentreferanse?: string;
    arkivsystem?: DokumentArkivSystemDto;
    lenkeTilDokumentreferanse?: string;
    /** Originale dokumentreferanse hvis er kopi av en ekstern dokument (feks fra JOARK) */
    originalDokumentreferanse?: string;
    /** Originale journalpostid hvis er kopi av en ekstern dokument (feks fra JOARK) */
    originalJournalpostId?: string;
    forsendelseId?: string;
    dokumentmalId?: string;
    språk?: string;
    tittel: string;
    dokumentDato?: string;
    status?: DokumentStatus;
    gammelStatus?: DokumentStatus;
    fraSaksnummer?: string;
    fraRolle?: RolleType;
    lagret: boolean;
}
