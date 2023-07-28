import { JournalpostDto } from "../../api/BidragDokumentApi";
import { SAKSNUMMER } from "../../constants/fellestyper";

export const journalposterSakMap: Map<SAKSNUMMER, JournalpostDto[]> = new Map<SAKSNUMMER, JournalpostDto[]>([
    ["2300001", [createJournalpost("Vedtak om forskudd"), createJournalpost("Søknad om Barnebidrag")]],
    [
        "2300062",
        [
            createJournalpost("Vedtak om barnebidrag"),
            createJournalpost("Søknad om forskudd"),
            createJournalpost("Vedtak om forskudd"),
            createJournalpost("Søknad om Barnebidrag"),
        ],
    ],
    [
        "2300105",
        [
            createJournalpost("Vedtak om barnebidrag"),
            createJournalpost("Søknad om forskudd"),
            createJournalpost("Vedtak om forskudd"),
            createJournalpost("Søknad om Barnebidrag"),
        ],
    ],
    ["2300113", [createJournalpost("Vedtak om barnebidrag"), createJournalpost("Søknad om Barnebidrag")]],
    ["2300001", [createJournalpost("Vedtak om barnebidrag"), createJournalpost("Søknad om Barnebidrag")]],
]);

function createDokRef() {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
}
function createJournalpost(tittel: string): JournalpostDto {
    return {
        avsenderMottaker: {
            navn: "æzåd æxawPDL-TEST",
            ident: null,
            type: "UKJENT",
            adresse: null,
        },
        dokumenter: [
            {
                dokumentreferanse: createDokRef(),
                journalpostId: null,
                tittel: tittel,
                dokument: null,
                dokumentmalId: "BI01S63",
                status: "FERDIGSTILT",
                arkivSystem: "JOARK",
                metadata: {},
            },
            {
                dokumentreferanse: createDokRef(),
                journalpostId: null,
                dokumentType: "I",
                tittel: "Vedlegg 1",
                dokument: null,
                brevkode: null,
                dokumentmalId: "BI01S63",
                status: "FERDIGSTILT",
                arkivSystem: "JOARK",
                metadata: {},
            },
            {
                dokumentreferanse: createDokRef(),
                journalpostId: null,
                dokumentType: "I",
                tittel: "Vedlegg 2",
                dokument: null,
                brevkode: null,
                dokumentmalId: "BI01S63",
                status: "FERDIGSTILT",
                arkivSystem: "JOARK",
                metadata: {},
            },
        ],
        dokumentDato: "2023-01-26",
        dokumentTidspunkt: null,
        ekspedertDato: null,
        fagomrade: "BID",
        gjelderIdent: null,
        gjelderAktor: {
            ident: "10027029588",
            type: "FNR",
        },
        innhold: tittel,
        journalforendeEnhet: "4806",
        journalfortAv: null,
        journalfortDato: null,
        journalpostId: "JOARK-" + createDokRef(),
        kilde: "NAV_NO",
        kanal: "NAV_NO",
        mottattDato: "2022-05-10",
        dokumentType: "I",
        journalstatus: "J",
        feilfort: false,
        brevkode: {
            kode: "BI01S63",
            dekode: null,
            erGyldig: true,
        },
        returDetaljer: null,
        joarkJournalpostId: null,
        distribuertTilAdresse: null,
        sakstilknytninger: [],
        språk: null,
        opprettetAvIdent: null,
        eksternReferanseId: null,
    };
}
