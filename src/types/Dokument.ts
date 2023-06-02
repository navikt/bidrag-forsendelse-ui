import { RolleType } from "@navikt/bidrag-ui-common";

import { DokumentStatus } from "../constants/DokumentStatus";

export interface IDokument {
    index: number;
    journalpostId?: string;
    dokumentreferanse?: string;
    dokumentmalId?: string;
    språk?: string;
    tittel: string;
    dokumentDato?: string;
    status?: DokumentStatus;
    fraSaksnummer?: string;
    fraRolle?: RolleType;
    lagret: boolean;
}
