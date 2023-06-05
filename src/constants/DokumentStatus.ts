export enum DokumentStatus {
    SLETTET = "SLETTET",
    IKKE_BESTILT = "IKKE_BESTILT",
    BESTILLING_FEILET = "BESTILLING_FEILET",
    UNDER_PRODUKSJON = "UNDER_PRODUKSJON",
    UNDER_REDIGERING = "UNDER_REDIGERING",
    KONTROLLERT = "KONTROLLERT",
    MÅ_KONTROLLERES = "MÅ_KONTROLLERES",
    FERDIGSTILT = "FERDIGSTILT",
}
export const DOKUMENT_KAN_IKKE_ÅPNES_STATUS = [
    DokumentStatus.BESTILLING_FEILET,
    DokumentStatus.IKKE_BESTILT,
    DokumentStatus.UNDER_PRODUKSJON,
];
export const DokumentStatusTags = {
    [DokumentStatus.UNDER_PRODUKSJON]: "alt2",
    [DokumentStatus.UNDER_REDIGERING]: "warning",
    [DokumentStatus.MÅ_KONTROLLERES]: "warning",
    [DokumentStatus.FERDIGSTILT]: "success",
    [DokumentStatus.KONTROLLERT]: "success",
    [DokumentStatus.IKKE_BESTILT]: "warning",
    [DokumentStatus.SLETTET]: "danger",
} as const;
export const DokumentStatusDisplayName = {
    [DokumentStatus.UNDER_PRODUKSJON]: "Under produksjon",
    [DokumentStatus.UNDER_REDIGERING]: "Under redigering",
    [DokumentStatus.MÅ_KONTROLLERES]: "Må kontrolleres",
    [DokumentStatus.FERDIGSTILT]: "Ferdigstilt",
    [DokumentStatus.KONTROLLERT]: "Kontrollert",
    [DokumentStatus.IKKE_BESTILT]: "Ikke bestilt",
    [DokumentStatus.SLETTET]: "Fjernet",
} as const;
