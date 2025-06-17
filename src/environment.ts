// @ts-nocheck
const system = {
    isTest: process.env.NODE_ENV === "TEST",
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    environment: process.env.ENVIRONMENT,
    legacyEnvironment: process.env.LEGACY_ENVIRONMENT,
};

const feature = {
    isDebug: localStorage.getItem("DEBUG_MODE") === "true",
    visDokumentmalKode:
        process.env.VIS_DOKUMENTMAL_KODE === "true" || localStorage.getItem("VIS_DOKUMENTMAL_KODE") === "true",
};

const url = {
    bidragDokumentForsendelse: process.env.BIDRAG_DOKUMENT_FORSENDELSE_URL,
    bidragKodeverk: process.env.BIDRAG_KODEVERK_URL,
    bidragTilgangskontroll: process.env.BIDRAG_TILGANGSKONTROLL_URL,
    bidragDokumentArkiv: process.env.BIDRAG_DOKUMENT_ARKIV_URL,
    bidragPerson: process.env.BIDRAG_PERSON_URL,
    bidragSamhandler: process.env.BIDRAG_SAMHANDLER_URL,
    bidragSak: process.env.BIDRAG_SAK_URL,
    bidragDokument: process.env.BIDRAG_DOKUMENT_URL,
    bidragOrganisasjon: process.env.BIDRAG_ORGANISASJON,
    bisys: process.env.BISYS_URL,
};

export default { url, system, feature };
