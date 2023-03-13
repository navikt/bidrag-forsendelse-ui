import { DokumentStatus } from "../constants/DokumentStatus";
import { RolleType } from "../constants/RolleType";

export interface IDokument {
    index: number;
    journalpostId: string;
    dokumentreferanse?: string;
    dokumentmalId?: string;
    språk?: string;
    tittel: string;
    dokumentDato: string;
    status: DokumentStatus;
    fraSaksnummer?: string;
    fraRolle?: RolleType;
    lagret: boolean;
}
