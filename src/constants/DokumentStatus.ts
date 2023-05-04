export enum DokumentStatus {
    SLETTET = "SLETTET",
    IKKE_BESTILT = "IKKE_BESTILT",
    BESTILLING_FEILET = "BESTILLING_FEILET",
    UNDER_REDIGERING = "UNDER_REDIGERING",
    KONTROLLERT = "KONTROLLERT",
    MÅ_KONTROLLERES = "MÅ_KONTROLLERES",
    FERDIGSTILT = "FERDIGSTILT",
}
export const DokumentStatusTags = {
    [DokumentStatus.UNDER_REDIGERING]: "warning",
    [DokumentStatus.MÅ_KONTROLLERES]: "warning",
    [DokumentStatus.FERDIGSTILT]: "success",
    [DokumentStatus.KONTROLLERT]: "success",
    [DokumentStatus.IKKE_BESTILT]: "warning",
    [DokumentStatus.SLETTET]: "danger",
} as const;
export const DokumentStatusDisplayName = {
    [DokumentStatus.UNDER_REDIGERING]: "Under redigering",
    [DokumentStatus.MÅ_KONTROLLERES]: "Må kontrolleres",
    [DokumentStatus.FERDIGSTILT]: "Ferdigstilt",
    [DokumentStatus.KONTROLLERT]: "Kontrollert",
    [DokumentStatus.IKKE_BESTILT]: "Ikke bestilt",
    [DokumentStatus.SLETTET]: "Fjernet",
} as const;
