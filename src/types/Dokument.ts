import { RolleType } from "@navikt/bidrag-ui-common";

import { DokumentStatus } from "../constants/DokumentStatus";

export interface IDokument {
    index: number;
    journalpostId?: string;
    dokumentreferanse?: string;
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
    fraSaksnummer?: string;
    fraRolle?: RolleType;
    lagret: boolean;
}
