// @ts-nocheck
const system = {
    isTest: process.env.NODE_ENV === "TEST",
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
};

const url = {
    bidragDokumentForsendelse: process.env.BIDRAG_DOKUMENT_FORSENDELSE_URL,
    bidragPerson: process.env.BIDRAG_PERSON_URL,
    bidragSak: process.env.BIDRAG_SAK_URL,
    bidragDokument: process.env.BIDRAG_DOKUMENT_URL,
};

export default { url, system };
