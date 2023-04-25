import { TESTDATA_CASE_1 } from "./fellesdata";

export const simpleForsendelse = {
    mottaker: { ident: TESTDATA_CASE_1.BM, navn: "Kallesen, Mango" },
    gjelderIdent: TESTDATA_CASE_1.BM,
    dokumenter: [
        {
            dokumentreferanse: "BIF100000005",
            tittel: "Søknad om barnebidrag",
            dokumentDato: "2023-01-23",
            dokumentmalId: "BI01S02",
            metadata: {},
            status: "UNDER_REDIGERING",
            arkivsystem: "MIDLERTIDLIG_BREVLAGER",
        },
        {
            dokumentreferanse: "624862287",
            tittel: "Vedtak om forskudd over 11 år",
            dokumentDato: "2023-01-20",
            journalpostId: "JOARK-598115254",
            dokumentmalId: "BI000",
            metadata: {},
            status: "FERDIGSTILT",
            arkivsystem: "JOARK",
        },
        {
            dokumentreferanse: "624862288",
            tittel: "Vedtak om barnebidrag",
            dokumentDato: "2023-02-20",
            journalpostId: "JOARK-598115255",
            dokumentmalId: "BI000",
            metadata: {},
            status: "FERDIGSTILT",
            arkivsystem: "JOARK",
        },
        {
            dokumentreferanse: "BIF100000006",
            tittel: "Beskjed til bidragsmottaker",
            dokumentDato: "2023-01-23",
            dokumentmalId: "BI01S02",
            metadata: {},
            status: "FERDIGSTILT",
            arkivsystem: "MIDLERTIDLIG_BREVLAGER",
        },
        {
            dokumentreferanse: "624862289",
            tittel: "HOVEDDOK 2",
            dokumentDato: "2023-01-20",
            journalpostId: "JOARK-598115254",
            dokumentmalId: "BI000",
            metadata: {},
            status: "FERDIGSTILT",
            arkivsystem: "JOARK",
        },
        {
            dokumentreferanse: "624862290",
            tittel: "Vedtak om barnebidrag 2",
            dokumentDato: "2023-02-20",
            journalpostId: "JOARK-598115255",
            dokumentmalId: "BI000",
            metadata: {},
            status: "FERDIGSTILT",
            arkivsystem: "JOARK",
        },
    ],
    saksnummer: "2300062",
    enhet: "4806",
    opprettetAvIdent: "Z994977",
    opprettetAvNavn: "F_Z994977 E_Z994977",
    tittel: "FRITEKSTBREV",
    forsendelseType: "UTGÅENDE",
    status: "UNDER_PRODUKSJON",
    opprettetDato: "2023-01-23",
};