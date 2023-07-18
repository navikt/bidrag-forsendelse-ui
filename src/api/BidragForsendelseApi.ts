/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Detaljer om behandling hvis forsendelsen inneholder brev for en behandling eller vedtak */
export interface BehandlingInfoDto {
    vedtakId?: string;
    behandlingId?: string;
    soknadId?: string;
    engangsBelopType?: EngangsbelopType;
    stonadType?: StonadType;
    vedtakType?: VedtakType;
    erFattetBeregnet?: boolean;
    soknadFra?: SoknadFra;
    roller: string[];
}

/** Arkivsystem hvor dokument er lagret */
export enum DokumentArkivSystemDto {
    JOARK = "JOARK",
    MIDLERTIDLIG_BREVLAGER = "MIDLERTIDLIG_BREVLAGER",
    UKJENT = "UKJENT",
    BIDRAG = "BIDRAG",
}

/** Dette skal være UNDER_PRODUKSJON for redigerbare dokumenter som ikke er ferdigprodusert. Ellers settes det til FERDIGSTILT */
export enum DokumentStatusTo {
    IKKE_BESTILT = "IKKE_BESTILT",
    BESTILLING_FEILET = "BESTILLING_FEILET",
    AVBRUTT = "AVBRUTT",
    UNDER_PRODUKSJON = "UNDER_PRODUKSJON",
    UNDER_REDIGERING = "UNDER_REDIGERING",
    FERDIGSTILT = "FERDIGSTILT",
    MAKONTROLLERES = "MÅ_KONTROLLERES",
    KONTROLLERT = "KONTROLLERT",
}

export enum EngangsbelopType {
    DIREKTE_OPPGJOR = "DIREKTE_OPPGJOR",
    ETTERGIVELSE = "ETTERGIVELSE",
    ETTERGIVELSE_TILBAKEKREVING = "ETTERGIVELSE_TILBAKEKREVING",
    TILBAKEKREVING = "TILBAKEKREVING",
    SAERTILSKUDD = "SAERTILSKUDD",
    GEBYR_MOTTAKER = "GEBYR_MOTTAKER",
    GEBYR_SKYLDNER = "GEBYR_SKYLDNER",
}

/** Tema forsendelsen skal opprettes med */
export enum JournalTema {
    BID = "BID",
    FAR = "FAR",
}

/** Adresse til mottaker hvis dokumentet sendes som brev */
export interface MottakerAdresseTo {
    adresselinje1: string;
    adresselinje2?: string;
    adresselinje3?: string;
    bruksenhetsnummer?: string;
    /** Lankode må være i ISO 3166-1 alpha-2 format */
    landkode?: string;
    /** Lankode må være i ISO 3166-1 alpha-3 format */
    landkode3?: string;
    postnummer?: string;
    poststed?: string;
}

export enum MottakerIdentTypeTo {
    FNR = "FNR",
    SAMHANDLER = "SAMHANDLER",
}

export interface MottakerTo {
    ident?: string;
    språk?: string;
    navn?: string;
    identType?: MottakerIdentTypeTo;
    /** Adresse til mottaker hvis dokumentet sendes som brev */
    adresse?: MottakerAdresseTo;
}

/** Metadata for dokument som skal knyttes til forsendelsen. Første dokument i listen blir automatisk satt som hoveddokument i forsendelsen */
export interface OpprettDokumentForesporsel {
    /** Dokumentets tittel */
    tittel: string;
    /** Språket på inneholdet i dokumentet. */
    språk?: string;
    /** Arkivsystem hvor dokument er lagret */
    arkivsystem?: DokumentArkivSystemDto;
    /**
     * Dato dokument ble opprettet
     * @format date-time
     */
    dokumentDato?: string;
    /** Referansen til dokumentet hvis det er allerede er lagret i arkivsystem. Hvis dette ikke settes opprettes det en ny dokumentreferanse som kan brukes ved opprettelse av dokument */
    dokumentreferanse?: string;
    /** JournalpostId til dokumentet hvis det er allerede er lagret i arkivsystem */
    journalpostId?: string;
    /** DokumentmalId sier noe om dokumentets innhold og oppbygning. (Også kjent som brevkode) */
    dokumentmalId?: string;
    /** Dette skal være UNDER_PRODUKSJON for redigerbare dokumenter som ikke er ferdigprodusert. Ellers settes det til FERDIGSTILT */
    status: DokumentStatusTo;
    /** Om dokumentet med dokumentmalId skal bestilles. Hvis dette er satt til false så antas det at kallende system bestiller dokumentet selv. */
    bestillDokument: boolean;
}

/** Metadata for opprettelse av forsendelse */
export interface OpprettForsendelseForesporsel {
    /** Ident til brukeren som journalposten gjelder */
    gjelderIdent: string;
    mottaker?: MottakerTo;
    /**
     *
     *     Dokumenter som skal knyttes til journalpost.
     *     En journalpost må minst ha et dokument.
     *     Det første dokument i meldingen blir tilknyttet som hoveddokument på journalposten.
     */
    dokumenter: OpprettDokumentForesporsel[];
    /** Bidragsak som forsendelse skal tilknyttes */
    saksnummer: string;
    /** NAV-enheten som oppretter forsendelsen */
    enhet: string;
    /** Detaljer om behandling hvis forsendelsen inneholder brev for en behandling eller vedtak */
    behandlingInfo?: BehandlingInfoDto;
    /** Identifikator til batch kjøring forsendelsen ble opprettet av */
    batchId?: string;
    /** Tema forsendelsen skal opprettes med */
    tema?: JournalTema;
    /** Språk forsendelsen skal være på */
    språk?: string;
    /** Ident til saksbehandler som oppretter journalpost. Dette vil prioriteres over ident som tilhører tokenet til kallet. */
    saksbehandlerIdent?: string;
}

export enum SoknadFra {
    BM_I_ANNEN_SAK = "BM_I_ANNEN_SAK",
    BARN18AAR = "BARN_18_AAR",
    NAV_BIDRAG = "NAV_BIDRAG",
    FYLKESNEMDA = "FYLKESNEMDA",
    NAV_INTERNASJONALT = "NAV_INTERNASJONALT",
    KOMMUNE = "KOMMUNE",
    KONVERTERING = "KONVERTERING",
    BIDRAGSMOTTAKER = "BIDRAGSMOTTAKER",
    NORSKE_MYNDIGHET = "NORSKE_MYNDIGHET",
    BIDRAGSPLIKTIG = "BIDRAGSPLIKTIG",
    UTENLANDSKE_MYNDIGHET = "UTENLANDSKE_MYNDIGHET",
    VERGE = "VERGE",
    TRYGDEETATEN_INNKREVING = "TRYGDEETATEN_INNKREVING",
    KLAGE_ANKE = "KLAGE_ANKE",
}

export enum StonadType {
    BIDRAG = "BIDRAG",
    FORSKUDD = "FORSKUDD",
    BIDRAG18AAR = "BIDRAG18AAR",
    EKTEFELLEBIDRAG = "EKTEFELLEBIDRAG",
    MOTREGNING = "MOTREGNING",
    OPPFOSTRINGSBIDRAG = "OPPFOSTRINGSBIDRAG",
}

export enum VedtakType {
    INDEKSREGULERING = "INDEKSREGULERING",
    ALDERSJUSTERING = "ALDERSJUSTERING",
    OPPHOR = "OPPHØR",
    ALDERSOPPHOR = "ALDERSOPPHØR",
    REVURDERING = "REVURDERING",
    FASTSETTELSE = "FASTSETTELSE",
    INNKREVING = "INNKREVING",
    KLAGE = "KLAGE",
    ENDRING = "ENDRING",
    ENDRING_MOTTAKER = "ENDRING_MOTTAKER",
}

/** Metadata til en respons etter dokumenter i forsendelse ble opprettet */
export interface DokumentRespons {
    dokumentreferanse: string;
    /** Dokumentreferanse hvis dokumentet er lenke til et dokument i annen forsendelse */
    lenkeTilDokumentreferanse?: string;
    /** Originale dokumentreferanse hvis er kopi av en ekstern dokument (feks fra JOARK) */
    originalDokumentreferanse?: string;
    /** Originale journalpostid hvis er kopi av en ekstern dokument (feks fra JOARK) */
    originalJournalpostId?: string;
    forsendelseId?: string;
    tittel: string;
    /** @format date-time */
    dokumentDato: string;
    journalpostId?: string;
    dokumentmalId?: string;
    redigeringMetadata?: string;
    /** Dette skal være UNDER_PRODUKSJON for redigerbare dokumenter som ikke er ferdigprodusert. Ellers settes det til FERDIGSTILT */
    status?: DokumentStatusTo;
    /** Arkivsystem hvor dokument er lagret */
    arkivsystem?: DokumentArkivSystemDto;
}

/** Type på forsendelse. Kan være NOTAT eller UTGÅENDE */
export enum ForsendelseTypeTo {
    UTGAENDE = "UTGÅENDE",
    NOTAT = "NOTAT",
}

/** Metadata til en respons etter forsendelse ble opprettet */
export interface OpprettForsendelseRespons {
    /**
     * ForsendelseId på forsendelse som ble opprettet
     * @format int64
     */
    forsendelseId?: number;
    /** Type på forsendelse. Kan være NOTAT eller UTGÅENDE */
    forsendelseType?: ForsendelseTypeTo;
    /** Liste med dokumenter som er knyttet til journalposten */
    dokumenter: DokumentRespons[];
}

/** En avvikshendelse som kan utføres på en journalpost */
export interface Avvikshendelse {
    /** Type avvik */
    avvikType: string;
    /** Manuell beskrivelse av avvik */
    beskrivelse?: string;
    /** Eventuelle detaljer som skal følge avviket */
    detaljer: Record<string, string>;
    /** Saksnummer til sak når journalpost er journalført */
    saksnummer?: string;
    /** Adresse for hvor brev sendes ved sentral print */
    adresse?: DistribuerTilAdresse;
    /** Dokumenter som brukes ved kopiering ny journalpost. Benyttes ved avvik KOPIER_FRA_ANNEN_FAGOMRADE */
    dokumenter?: DokumentDto[];
}

/** Adresse for hvor brev sendes ved sentral print */
export interface DistribuerTilAdresse {
    adresselinje1?: string;
    adresselinje2?: string;
    adresselinje3?: string;
    /** ISO 3166-1 alpha-2 to-bokstavers landkode */
    land?: string;
    postnummer?: string;
    poststed?: string;
}

/** Metadata for et dokument */
export interface DokumentDto {
    /** Referansen til dokumentet i arkivsystemet */
    dokumentreferanse?: string;
    /** Journalpost hvor dokumentet er arkivert. Dette brukes hvis dokumentet er arkivert i annen arkivsystem enn det som er sendt med i forespørsel. */
    journalpostId?: string;
    /**
     * Inngående (I), utgående (U) dokument, (X) internt notat
     * @deprecated
     */
    dokumentType?: string;
    /** Kort oppsummering av dokumentets innhold */
    tittel?: string;
    /** Selve PDF dokumentet formatert som Base64 */
    dokument?: string;
    /**
     * Typen dokument. Brevkoden sier noe om dokumentets innhold og oppbygning. Erstattes av dokumentmalId
     * @deprecated
     */
    brevkode?: string;
    /** Typen dokument. Dokumentmal sier noe om dokumentets innhold og oppbygning. */
    dokumentmalId?: string;
    /** Dokumentets status. Benyttes hvis journalposten er av typen forsendelse */
    status?: "IKKE_BESTILT" | "BESTILLING_FEILET" | "UNDER_PRODUKSJON" | "UNDER_REDIGERING" | "FERDIGSTILT" | "AVBRUTT";
    /** Arkivsystem hvor dokumentet er produsert og lagret */
    arkivSystem?: "JOARK" | "MIDLERTIDLIG_BREVLAGER" | "UKJENT" | "BIDRAG";
    /** Metadata om dokumentet */
    metadata: Record<string, string>;
}

/** Bestill distribusjon av journalpost */
export interface DistribuerJournalpostRequest {
    /** Identifiserer batch som forsendelsen inngår i. Brukes for sporing */
    batchId?: string;
    /** Forsendelsen er skrevet ut og distribuert lokalt. Distribusjon registreres men ingen distribusjon bestilles. */
    lokalUtskrift: boolean;
    /** Adresse for hvor brev sendes ved sentral print */
    adresse?: DistribuerTilAdresse;
}

/** Respons etter bestilt distribusjon */
export interface DistribuerJournalpostResponse {
    /** Journalpostid for dokument som det ble bestilt distribusjon for */
    journalpostId: string;
    /** Bestillingid som unikt identifiserer distribusjonsbestillingen. Vil være null hvis ingen distribusjon er bestilt. */
    bestillingsId?: string;
}

export interface HentDokumentValgRequest {
    vedtakType?: VedtakType;
    behandlingType?: string;
    soknadFra?: SoknadFra;
    erFattetBeregnet?: boolean;
    vedtakId?: string;
    behandlingId?: string;
    enhet?: string;
}

export interface DokumentMalDetaljer {
    beskrivelse: string;
    type: "UTGÅENDE" | "NOTAT";
    kanBestilles: boolean;
}

/** Metadata for dokument som skal knyttes til forsendelsen. Første dokument i listen blir automatisk satt som hoveddokument i forsendelsen */
export interface OppdaterDokumentForesporsel {
    /** JournalpostId til dokumentet hvis det er allerede er lagret i arkivsystem */
    journalpostId?: string;
    dokumentmalId?: string;
    dokumentreferanse?: string;
    tittel?: string;
    fjernTilknytning?: boolean;
    /** @format date-time */
    dokumentDato?: string;
    arkivsystem?: "JOARK" | "MIDLERTIDLIG_BREVLAGER" | "UKJENT" | "BIDRAG";
}

/** Metadata for oppdatering av forsendelse */
export interface OppdaterForsendelseForesporsel {
    /** Liste over dokumentene på journalposten der metadata skal oppdateres */
    dokumenter: OppdaterDokumentForesporsel[];
    /**
     * Dato hoveddokument i forsendelsen ble opprettet
     * @format date-time
     */
    dokumentDato?: string;
    /** Ident til brukeren som journalposten gjelder. Kan bare oppdateres hvis status = UNDER_OPPRETTELSE */
    gjelderIdent?: string;
    mottaker?: MottakerTo;
    /** NAV-enheten som oppretter forsendelsen. Kan bare oppdateres hvis status = UNDER_OPPRETTELSE */
    enhet?: string;
    /** Tema forsendelsen skal opprettes med */
    tema?: JournalTema;
    /** Språk forsendelsen skal være på */
    språk?: string;
    /** Tittelen på forsendelse. Dette er tittel som vil vises i journalen i Bisys og i forsendelse skjermbildet */
    tittel?: string;
}

/** Metadata til en respons etter journalpost ble oppdatert */
export interface OppdaterForsendelseResponse {
    /** ForsendelseId på forsendelse som ble opprettet */
    forsendelseId?: string;
    /** Tittel på forsendelsen */
    tittel?: string;
    /** Liste med dokumenter som er knyttet til journalposten */
    dokumenter: DokumentRespons[];
}

export interface FerdigstillDokumentRequest {
    /** @format byte */
    fysiskDokument: string;
    redigeringMetadata?: string;
}

/** Metadata for endring av et dokument */
export interface EndreDokument {
    /** Brevkoden til dokumentet */
    brevkode?: string;
    /**
     * Identifikator av dokument informasjon
     * @deprecated
     */
    dokId?: string;
    /** Identifikator til dokumentet */
    dokumentreferanse?: string;
    /** Tittel på dokumentet */
    tittel?: string;
}

/** Metadata for endring av en journalpost */
export interface EndreJournalpostCommand {
    /** Identifikator av journalpost */
    journalpostId?: string;
    /**
     * Avsenders navn (med eventuelt fornavn bak komma)
     * @deprecated
     */
    avsenderNavn?: string;
    /** Avsender/Mottakers navn (med eventuelt fornavn bak komma) */
    avsenderMottakerNavn?: string;
    /** Avsender/Mottakers id */
    avsenderMottakerId?: string;
    /** Kort oppsummert av journalført innhold */
    beskrivelse?: string;
    /**
     * Dato for dokument i journalpost
     * @format date
     */
    dokumentDato?: string;
    /** Fnr/dnr/bostnr eller orgnr for hvem/hva dokumentet gjelder */
    gjelder?: string;
    /**
     * Dato dokument ble journalført
     * @format date
     */
    journaldato?: string;
    /** Saksnummer til bidragsaker som journalpost skal tilknyttes */
    tilknyttSaker: string[];
    /** En liste over endringer i dokumenter */
    endreDokumenter: EndreDokument[];
    /** Behandlingstema */
    behandlingstema?: string;
    /** Endre fagområde */
    fagomrade?: string;
    /** Type ident for gjelder: FNR, ORGNR, AKTOERID */
    gjelderType?: string;
    /** Tittel på journalposten */
    tittel?: string;
    /** Skal journalposten journalføres aka. registreres */
    skalJournalfores: boolean;
    /** Liste med retur detaljer som skal endres */
    endreReturDetaljer?: EndreReturDetaljer[];
}

/** Metadata for endring av et retur detalj */
export interface EndreReturDetaljer {
    /**
     * Dato på retur detaljer som skal endres
     * @format date
     */
    originalDato?: string;
    /**
     * Ny dato på retur detaljer
     * @format date
     */
    nyDato?: string;
    /** Beskrivelse av retur (eks. addresse forsøkt sendt) */
    beskrivelse: string;
}

export interface DokumentMetadata {
    /** Journalpostid med arkiv prefiks som skal benyttes når dokumentet hentes */
    journalpostId?: string;
    dokumentreferanse?: string;
    tittel?: string;
    /** Hvilken format dokument er på. Dette forteller hvordan dokumentet må åpnes. */
    format: "PDF" | "MBDOK" | "HTML";
    /** Status på dokumentet */
    status: "IKKE_BESTILT" | "BESTILLING_FEILET" | "UNDER_PRODUKSJON" | "UNDER_REDIGERING" | "FERDIGSTILT" | "AVBRUTT";
    /** Hvilken arkivsystem dokumentet er lagret på */
    arkivsystem: "JOARK" | "MIDLERTIDLIG_BREVLAGER" | "UKJENT" | "BIDRAG";
}

/** Metadata om behandling */
export interface BehandlingInfoResponseDto {
    vedtakId?: string;
    behandlingId?: string;
    soknadId?: string;
    behandlingType?: string;
}

/** Metadata om forsendelse */
export interface ForsendelseResponsTo {
    /** Ident til brukeren som journalposten gjelder */
    gjelderIdent?: string;
    mottaker?: MottakerTo;
    /** Liste over dokumentene på journalposten der metadata skal oppdateres */
    dokumenter: DokumentRespons[];
    /** Bidragsak som forsendelsen er knyttet til */
    saksnummer?: string;
    /** NAV-enheten som oppretter forsendelsen */
    enhet?: string;
    /** Tema på forsendelsen */
    tema?: string;
    /** Metadata om behandling */
    behandlingInfo?: BehandlingInfoResponseDto;
    /** Ident på saksbehandler eller applikasjon som opprettet forsendelsen */
    opprettetAvIdent?: string;
    /** Navn på saksbehandler eller applikasjon som opprettet forsendelsen */
    opprettetAvNavn?: string;
    /** Tittel på hoveddokumentet i forsendelsen */
    tittel?: string;
    /** Journalpostid som forsendelsen ble arkivert på. Dette vil bli satt hvis status er FERDIGSTILT */
    arkivJournalpostId?: string;
    /** Type på forsendelse. Kan være NOTAT eller UTGÅENDE */
    forsendelseType?: ForsendelseTypeTo;
    /** Status på forsendelsen */
    status?: ForsendelseStatusTo;
    /**
     * Dato forsendelsen ble opprettet
     * @format date
     */
    opprettetDato?: string;
    /**
     * Dato på hoveddokumentet i forsendelsen
     * @format date
     */
    dokumentDato?: string;
    /**
     * Dato forsendelsen ble distribuert
     * @format date
     */
    distribuertDato?: string;
}

/** Status på forsendelsen */
export enum ForsendelseStatusTo {
    UNDER_OPPRETTELSE = "UNDER_OPPRETTELSE",
    UNDER_PRODUKSJON = "UNDER_PRODUKSJON",
    FERDIGSTILT = "FERDIGSTILT",
    SLETTET = "SLETTET",
    DISTRIBUERT = "DISTRIBUERT",
    DISTRIBUERT_LOKALT = "DISTRIBUERT_LOKALT",
}

/** Metadata om en aktør */
export interface AktorDto {
    /** Identifaktor til aktøren */
    ident: string;
    /** Hvilken identtype som skal brukes */
    type?: string;
}

/**
 *
 * Avsender journalposten ble sendt fra hvis utgående.
 * Mottaker journalposten skal sendes til hvis inngående.
 */
export interface AvsenderMottakerDto {
    /** Avsenders/Mottakers navn (med eventuelt fornavn bak komma). Skal ikke oppgis hvis ident er en FNR */
    navn?: string;
    /** Person ident eller organisasjonsnummer */
    ident?: string;
    /** Identtype */
    type: "FNR" | "SAMHANDLER" | "ORGNR" | "UTENLANDSK_ORGNR" | "UKJENT";
    /** Adresse til mottaker hvis dokumentet sendes som brev */
    adresse?: MottakerAdresseTo;
}

/** Metadata til en journalpost */
export interface JournalpostDto {
    /**
     * Avsenders navn (med eventuelt fornavn bak komma)
     * @deprecated
     */
    avsenderNavn?: string;
    /**
     *
     * Avsender journalposten ble sendt fra hvis utgående.
     * Mottaker journalposten skal sendes til hvis inngående.
     */
    avsenderMottaker?: AvsenderMottakerDto;
    /** Dokumentene som følger journalposten */
    dokumenter: DokumentDto[];
    /**
     * Dato for dokument i journalpost
     * @format date
     */
    dokumentDato?: string;
    /**
     * Tidspunkt for dokument i journalpost
     * @format date-time
     */
    dokumentTidspunkt?: string;
    /**
     * Dato dokumentene på journalposten ble sendt til bruker.
     * @format date
     */
    ekspedertDato?: string;
    /** Fagområdet for journalposten. BID for bidrag og FAR for farskap */
    fagomrade?: string;
    /** Ident for hvem/hva dokumente(t/ne) gjelder */
    gjelderIdent?: string;
    /** Metadata om en aktør */
    gjelderAktor?: AktorDto;
    /** Kort oppsummert av journalført innhold */
    innhold?: string;
    /** Enhetsnummer hvor journalføring ble gjort */
    journalforendeEnhet?: string;
    /** Saksbehandler som var journalfører */
    journalfortAv?: string;
    /**
     * Dato dokument ble journalført
     * @format date
     */
    journalfortDato?: string;
    /** Identifikator av journalpost i midlertidig brevlager eller fra joark på formatet [BID|JOARK]-<journalpostId> */
    journalpostId?: string;
    /**
     * Journalposten ble mottatt/sendt ut i kanal
     * @deprecated
     */
    kilde?:
        | "NAV_NO_BID"
        | "SKAN_BID"
        | "NAV_NO"
        | "SKAN_NETS"
        | "LOKAL_UTSKRIFT"
        | "SENTRAL_UTSKRIFT"
        | "SDP"
        | "INGEN_DISTRIBUSJON";
    /** Journalposten ble mottatt/sendt ut i kanal */
    kanal?:
        | "NAV_NO_BID"
        | "SKAN_BID"
        | "NAV_NO"
        | "SKAN_NETS"
        | "LOKAL_UTSKRIFT"
        | "SENTRAL_UTSKRIFT"
        | "SDP"
        | "INGEN_DISTRIBUSJON";
    /**
     * Dato for når dokument er mottat, dvs. dato for journalføring eller skanning
     * @format date
     */
    mottattDato?: string;
    /** Inngående (I), utgående (U) journalpost; (X) internt notat */
    dokumentType?: string;
    /**
     * Journalpostens status, (A, D, J, M, O, R, S, T, U, KP, EJ, E)
     * @deprecated
     */
    journalstatus?: string;
    /** Journalpostens status */
    status?:
        | "MOTTATT"
        | "JOURNALFØRT"
        | "EKSPEDERT"
        | "DISTRIBUERT"
        | "AVBRUTT"
        | "KLAR_FOR_DISTRIBUSJON"
        | "RETUR"
        | "FERDIGSTILT"
        | "FEILREGISTRERT"
        | "RESERVERT"
        | "UTGÅR"
        | "UNDER_OPPRETTELSE"
        | "UNDER_PRODUKSJON"
        | "UKJENT";
    /** Om journalposten er feilført på bidragssak */
    feilfort?: boolean;
    /** Metadata for kode vs dekode i et kodeobjekt */
    brevkode?: KodeDto;
    /** Metadata for retur detaljer */
    returDetaljer?: ReturDetaljer;
    /** Joark journalpostid for bidrag journalpost som er arkivert i Joark */
    joarkJournalpostId?: string;
    /** Adresse for hvor brev sendes ved sentral print */
    distribuertTilAdresse?: DistribuerTilAdresse;
    /** Informasjon om returdetaljer til journalpost */
    sakstilknytninger: string[];
    /** Språket til dokumentet i Journalposten */
    språk?: string;
    /** Saksbehandler som opprettet journalposten */
    opprettetAvIdent?: string;
    /** Referanse til originale kilden til journalposten. Kan være referanse til forsendelse eller bidrag journalpost med prefiks. Feks BID_12323 eller BIF_123213 */
    eksternReferanseId?: string;
}

/** Metadata for kode vs dekode i et kodeobjekt */
export interface KodeDto {
    /** Koden */
    kode?: string;
    /** Dekode (kodebeskrivelse) */
    dekode?: string;
    /** Om kodeobjektet inneholder en gyldig verdi */
    erGyldig: boolean;
}

/** Metadata for retur detaljer */
export interface ReturDetaljer {
    /**
     * Dato for siste retur
     * @format date
     */
    dato?: string;
    /**
     * Totalt antall returer
     * @format int32
     */
    antall?: number;
    /** Liste med logg av alle registrerte returer */
    logg?: ReturDetaljerLog[];
}

/** Metadata for retur detaljer log */
export interface ReturDetaljerLog {
    /**
     * Dato for retur
     * @format date
     */
    dato?: string;
    /** Beskrivelse av retur (eks. addresse forsøkt sendt) */
    beskrivelse?: string;
    /** Returdetalje er låst for endring. Dette blir satt etter en ny distribusjon er bestilt */
    locked?: boolean;
}

export interface DokumentDetaljer {
    tittel: string;
    dokumentreferanse?: string;
    /** @format int32 */
    antallSider: number;
}

export interface DokumentRedigeringMetadataResponsDto {
    tittel: string;
    /** Dette skal være UNDER_PRODUKSJON for redigerbare dokumenter som ikke er ferdigprodusert. Ellers settes det til FERDIGSTILT */
    status: DokumentStatusTo;
    /** Status på forsendelsen */
    forsendelseStatus: ForsendelseStatusTo;
    redigeringMetadata?: string;
    dokumenter: DokumentDetaljer[];
}

/** Metadata til en respons etter journalpost med tilhørende data */
export interface JournalpostResponse {
    /** Metadata til en journalpost */
    journalpost?: JournalpostDto;
    /** alle saker som journalposten er tilknyttet */
    sakstilknytninger: string[];
}

/** Metadata om forsendelse */
export interface ForsendelseIkkeDistribuertResponsTo {
    /** Forsendelseid med BIF- prefiks */
    forsendelseId?: string;
    /** Bidragsak som forsendelsen er knyttet til */
    saksnummer?: string;
    /** NAV-enheten som oppretter forsendelsen */
    enhet?: string;
    /** Tittel på hoveddokumentet i forsendelsen */
    tittel?: string;
    /**
     * Dato forsendelsen ble opprettet
     * @format date-time
     */
    opprettetDato?: string;
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseType;
    /** request body */
    body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
    securityWorker?: (
        securityData: SecurityDataType | null
    ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
    secure?: boolean;
    format?: ResponseType;
}

export enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public instance: AxiosInstance;
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private secure?: boolean;
    private format?: ResponseType;

    constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
        this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8999" });
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
        const method = params1.method || (params2 && params2.method);

        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }

    protected stringifyFormItem(formItem: unknown) {
        if (typeof formItem === "object" && formItem !== null) {
            return JSON.stringify(formItem);
        } else {
            return `${formItem}`;
        }
    }

    protected createFormData(input: Record<string, unknown>): FormData {
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            const propertyContent: any[] = property instanceof Array ? property : [property];

            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File;
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
            }

            return formData;
        }, new FormData());
    }

    public request = async <T = any, _E = any>({
        secure,
        path,
        type,
        query,
        format,
        body,
        ...params
    }: FullRequestParams): Promise<AxiosResponse<T>> => {
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const responseFormat = format || this.format || undefined;

        if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
            body = this.createFormData(body as Record<string, unknown>);
        }

        if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
            body = JSON.stringify(body);
        }

        return this.instance.request({
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
            },
            params: query,
            responseType: responseFormat,
            data: body,
            url: path,
        });
    };
}

/**
 * @title bidrag-dokument-forsendelse
 * @version v1
 * @baseUrl http://localhost:8999
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    api = {
        /**
         * No description
         *
         * @tags opprett-forsendelse-kontroller
         * @name OpprettForsendelse
         * @summary Oppretter ny forsendelse
         * @request POST:/api/forsendelse
         * @secure
         */
        opprettForsendelse: (data: OpprettForsendelseForesporsel, params: RequestParams = {}) =>
            this.request<OpprettForsendelseRespons, OpprettForsendelseRespons>({
                path: `/api/forsendelse`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags endre-forsendelse-kontroller
         * @name KnyttTilDokument
         * @summary Knytt eller opprett ny dokument til forsendelse
         * @request POST:/api/forsendelse/{forsendelseIdMedPrefix}/dokument
         * @secure
         */
        knyttTilDokument: (
            forsendelseIdMedPrefix: string,
            data: OpprettDokumentForesporsel,
            params: RequestParams = {}
        ) =>
            this.request<DokumentRespons, any>({
                path: `/api/forsendelse/${forsendelseIdMedPrefix}/dokument`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Hent gyldige avvikstyper for forsendelse
         *
         * @tags avvik-kontroller
         * @name HentAvvik
         * @request GET:/api/forsendelse/journal/{forsendelseIdMedPrefix}/avvik
         * @secure
         */
        hentAvvik: (forsendelseIdMedPrefix: string, params: RequestParams = {}) =>
            this.request<
                (
                    | "ARKIVERE_JOURNALPOST"
                    | "BESTILL_ORIGINAL"
                    | "BESTILL_RESKANNING"
                    | "BESTILL_SPLITTING"
                    | "ENDRE_FAGOMRADE"
                    | "SEND_TIL_FAGOMRADE"
                    | "KOPIER_FRA_ANNEN_FAGOMRADE"
                    | "SEND_KOPI_TIL_FAGOMRADE"
                    | "FEILFORE_SAK"
                    | "INNG_TIL_UTG_DOKUMENT"
                    | "OVERFOR_TIL_ANNEN_ENHET"
                    | "SLETT_JOURNALPOST"
                    | "TREKK_JOURNALPOST"
                    | "REGISTRER_RETUR"
                    | "MANGLER_ADRESSE"
                    | "BESTILL_NY_DISTRIBUSJON"
                    | "FARSKAP_UTELUKKET"
                )[],
                (
                    | "ARKIVERE_JOURNALPOST"
                    | "BESTILL_ORIGINAL"
                    | "BESTILL_RESKANNING"
                    | "BESTILL_SPLITTING"
                    | "ENDRE_FAGOMRADE"
                    | "SEND_TIL_FAGOMRADE"
                    | "KOPIER_FRA_ANNEN_FAGOMRADE"
                    | "SEND_KOPI_TIL_FAGOMRADE"
                    | "FEILFORE_SAK"
                    | "INNG_TIL_UTG_DOKUMENT"
                    | "OVERFOR_TIL_ANNEN_ENHET"
                    | "SLETT_JOURNALPOST"
                    | "TREKK_JOURNALPOST"
                    | "REGISTRER_RETUR"
                    | "MANGLER_ADRESSE"
                    | "BESTILL_NY_DISTRIBUSJON"
                    | "FARSKAP_UTELUKKET"
                )[]
            >({
                path: `/api/forsendelse/journal/${forsendelseIdMedPrefix}/avvik`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags avvik-kontroller
         * @name UtforAvvik
         * @summary Utfør avvikshåndtering
         * @request POST:/api/forsendelse/journal/{forsendelseIdMedPrefix}/avvik
         * @secure
         */
        utforAvvik: (forsendelseIdMedPrefix: string, data: Avvikshendelse, params: RequestParams = {}) =>
            this.request<any, void>({
                path: `/api/forsendelse/journal/${forsendelseIdMedPrefix}/avvik`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Bestill distribusjon av forsendelse
         *
         * @tags distribusjon-kontroller
         * @name DistribuerForsendelse
         * @request POST:/api/forsendelse/journal/distribuer/{forsendelseIdMedPrefix}
         * @secure
         */
        distribuerForsendelse: (
            forsendelseIdMedPrefix: string,
            data: DistribuerJournalpostRequest,
            query?: {
                batchId?: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<DistribuerJournalpostResponse, DistribuerJournalpostResponse>({
                path: `/api/forsendelse/journal/distribuer/${forsendelseIdMedPrefix}`,
                method: "POST",
                query: query,
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Henter dokumentmaler som er støttet av applikasjonen
         *
         * @tags forsendelse-innsyn-kontroller
         * @name HentDokumentValg
         * @request POST:/api/forsendelse/dokumentvalg
         * @secure
         */
        hentDokumentValg: (data: HentDokumentValgRequest, params: RequestParams = {}) =>
            this.request<Record<string, DokumentMalDetaljer>, any>({
                path: `/api/forsendelse/dokumentvalg`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Hent forsendelse med forsendelseid
         *
         * @tags forsendelse-innsyn-kontroller
         * @name HentForsendelse
         * @request GET:/api/forsendelse/{forsendelseIdMedPrefix}
         * @secure
         */
        hentForsendelse: (
            forsendelseIdMedPrefix: string,
            query?: {
                /** journalposten tilhører sak */
                saksnummer?: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<any, ForsendelseResponsTo>({
                path: `/api/forsendelse/${forsendelseIdMedPrefix}`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags endre-forsendelse-kontroller
         * @name OppdaterForsendelse
         * @summary Endre forsendelse
         * @request PATCH:/api/forsendelse/{forsendelseIdMedPrefix}
         * @secure
         */
        oppdaterForsendelse: (
            forsendelseIdMedPrefix: string,
            data: OppdaterForsendelseForesporsel,
            params: RequestParams = {}
        ) =>
            this.request<OppdaterForsendelseResponse, OppdaterForsendelseResponse>({
                path: `/api/forsendelse/${forsendelseIdMedPrefix}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags endre-forsendelse-kontroller
         * @name OppdaterDokument
         * @summary Oppdater dokument i en forsendelsee
         * @request PATCH:/api/forsendelse/{forsendelseIdMedPrefix}/dokument/{dokumentreferanse}
         * @secure
         */
        oppdaterDokument: (
            forsendelseIdMedPrefix: string,
            dokumentreferanse: string,
            data: OppdaterDokumentForesporsel,
            params: RequestParams = {}
        ) =>
            this.request<DokumentRespons, any>({
                path: `/api/forsendelse/${forsendelseIdMedPrefix}/dokument/${dokumentreferanse}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags rediger-dokument-kontroller
         * @name HentDokumentRedigeringMetadata
         * @summary Hent dokument redigering metadata
         * @request GET:/api/forsendelse/redigering/{forsendelseIdMedPrefix}/{dokumentreferanse}
         * @secure
         */
        hentDokumentRedigeringMetadata: (
            forsendelseIdMedPrefix: string,
            dokumentreferanse: string,
            params: RequestParams = {}
        ) =>
            this.request<DokumentRedigeringMetadataResponsDto, DokumentRedigeringMetadataResponsDto>({
                path: `/api/forsendelse/redigering/${forsendelseIdMedPrefix}/${dokumentreferanse}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags rediger-dokument-kontroller
         * @name OppdaterDokumentRedigeringmetadata
         * @summary Oppdater dokument redigeringdata
         * @request PATCH:/api/forsendelse/redigering/{forsendelseIdMedPrefix}/{dokumentreferanse}
         * @secure
         */
        oppdaterDokumentRedigeringmetadata: (
            forsendelseIdMedPrefix: string,
            dokumentreferanse: string,
            data: string,
            params: RequestParams = {}
        ) =>
            this.request<void, void>({
                path: `/api/forsendelse/redigering/${forsendelseIdMedPrefix}/${dokumentreferanse}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags rediger-dokument-kontroller
         * @name FerdigstillDokument
         * @summary Ferdigstill dokument i en forsendelse
         * @request PATCH:/api/forsendelse/redigering/{forsendelseIdMedPrefix}/{dokumentreferanse}/ferdigstill
         * @secure
         */
        ferdigstillDokument: (
            forsendelseIdMedPrefix: string,
            dokumentreferanse: string,
            data: FerdigstillDokumentRequest,
            params: RequestParams = {}
        ) =>
            this.request<DokumentRespons, any>({
                path: `/api/forsendelse/redigering/${forsendelseIdMedPrefix}/${dokumentreferanse}/ferdigstill`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags rediger-dokument-kontroller
         * @name OpphevFerdigstillDokument
         * @summary Ferdigstill dokument i en forsendelse
         * @request PATCH:/api/forsendelse/redigering/{forsendelseIdMedPrefix}/{dokumentreferanse}/ferdigstill/opphev
         * @secure
         */
        opphevFerdigstillDokument: (
            forsendelseIdMedPrefix: string,
            dokumentreferanse: string,
            params: RequestParams = {}
        ) =>
            this.request<DokumentRespons, any>({
                path: `/api/forsendelse/redigering/${forsendelseIdMedPrefix}/${dokumentreferanse}/ferdigstill/opphev`,
                method: "PATCH",
                secure: true,
                ...params,
            }),

        /**
         * @description Hent forsendelse med forsendelseid
         *
         * @tags forsendelse-journal-kontroller
         * @name HentForsendelse1
         * @request GET:/api/forsendelse/journal/{forsendelseIdMedPrefix}
         * @secure
         */
        hentForsendelse1: (
            forsendelseIdMedPrefix: string,
            query?: {
                /** journalposten tilhører sak */
                saksnummer?: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<any, JournalpostResponse>({
                path: `/api/forsendelse/journal/${forsendelseIdMedPrefix}`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags endre-forsendelse-kontroller
         * @name OppdaterForsendelseLegacy
         * @summary Endre forsendelse
         * @request PATCH:/api/forsendelse/journal/{forsendelseIdMedPrefix}
         * @secure
         */
        oppdaterForsendelseLegacy: (
            forsendelseIdMedPrefix: string,
            data: EndreJournalpostCommand,
            params: RequestParams = {}
        ) =>
            this.request<void, void>({
                path: `/api/forsendelse/journal/${forsendelseIdMedPrefix}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Henter dokumentmaler som er støttet av applikasjonen
         *
         * @tags forsendelse-innsyn-kontroller
         * @name StottedeDokumentmaler
         * @request OPTIONS:/api/forsendelse/dokumentmaler
         * @secure
         */
        stottedeDokumentmaler: (params: RequestParams = {}) =>
            this.request<string[], any>({
                path: `/api/forsendelse/dokumentmaler`,
                method: "OPTIONS",
                secure: true,
                ...params,
            }),

        /**
         * @description Henter dokumentmaler som er støttet av applikasjonen
         *
         * @tags forsendelse-innsyn-kontroller
         * @name StottedeDokumentmalDetaljer
         * @request OPTIONS:/api/forsendelse/dokumentmaler/detaljer
         * @secure
         */
        stottedeDokumentmalDetaljer: (params: RequestParams = {}) =>
            this.request<Record<string, DokumentMalDetaljer>, any>({
                path: `/api/forsendelse/dokumentmaler/detaljer`,
                method: "OPTIONS",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags dokument-kontroller
         * @name HentDokumentMetadata
         * @summary Hent metadata om dokument
         * @request OPTIONS:/api/forsendelse/dokument/{forsendelseIdMedPrefix}
         * @secure
         */
        hentDokumentMetadata: (forsendelseIdMedPrefix: string, params: RequestParams = {}) =>
            this.request<DokumentMetadata[], any>({
                path: `/api/forsendelse/dokument/${forsendelseIdMedPrefix}`,
                method: "OPTIONS",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags dokument-kontroller
         * @name HentDokument
         * @summary Hent fysisk dokument som byte
         * @request GET:/api/forsendelse/dokument/{forsendelseIdMedPrefix}/{dokumentreferanse}
         * @secure
         */
        hentDokument: (forsendelseIdMedPrefix: string, dokumentreferanse: string, params: RequestParams = {}) =>
            this.request<string, any>({
                path: `/api/forsendelse/dokument/${forsendelseIdMedPrefix}/${dokumentreferanse}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags dokument-kontroller
         * @name HentDokumentMetadata1
         * @summary Hent metadata om dokument
         * @request OPTIONS:/api/forsendelse/dokument/{forsendelseIdMedPrefix}/{dokumentreferanse}
         * @secure
         */
        hentDokumentMetadata1: (
            forsendelseIdMedPrefix: string,
            dokumentreferanse: string,
            params: RequestParams = {}
        ) =>
            this.request<DokumentMetadata[], any>({
                path: `/api/forsendelse/dokument/${forsendelseIdMedPrefix}/${dokumentreferanse}`,
                method: "OPTIONS",
                secure: true,
                ...params,
            }),

        /**
         * @description Hent alle forsendelse som har saksnummer
         *
         * @tags forsendelse-journal-kontroller
         * @name HentJournal
         * @request GET:/api/forsendelse/sak/{saksnummer}/journal
         * @secure
         */
        hentJournal: (
            saksnummer: string,
            query?: {
                fagomrade?: ("BID" | "FAR")[];
            },
            params: RequestParams = {}
        ) =>
            this.request<JournalpostDto[], any>({
                path: `/api/forsendelse/sak/${saksnummer}/journal`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Hent alle forsendelse med saksnummer
         *
         * @tags forsendelse-innsyn-kontroller
         * @name HentJournal1
         * @request GET:/api/forsendelse/sak/{saksnummer}/forsendelser
         * @secure
         */
        hentJournal1: (saksnummer: string, params: RequestParams = {}) =>
            this.request<ForsendelseResponsTo[], any>({
                path: `/api/forsendelse/sak/${saksnummer}/forsendelser`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Hent alle forsendelse som er opprettet før dagens dato og ikke er distribuert
         *
         * @tags forsendelse-journal-kontroller
         * @name HentForsendelserIkkeDistribuert
         * @request GET:/api/forsendelse/journal/ikkedistribuert
         * @secure
         */
        hentForsendelserIkkeDistribuert: (params: RequestParams = {}) =>
            this.request<ForsendelseIkkeDistribuertResponsTo[], any>({
                path: `/api/forsendelse/journal/ikkedistribuert`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags distribusjon-kontroller
         * @name KanDistribuere
         * @summary Sjekk om forsendelse kan distribueres
         * @request GET:/api/forsendelse/journal/distribuer/{forsendelseIdMedPrefix}/enabled
         * @secure
         */
        kanDistribuere: (forsendelseIdMedPrefix: string, params: RequestParams = {}) =>
            this.request<void, void>({
                path: `/api/forsendelse/journal/distribuer/${forsendelseIdMedPrefix}/enabled`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Henter dokumentmaler som er støttet av applikasjonen
         *
         * @tags forsendelse-innsyn-kontroller
         * @name HentDokumentValgNotater
         * @request GET:/api/forsendelse/dokumentvalg/notat
         * @secure
         */
        hentDokumentValgNotater: (params: RequestParams = {}) =>
            this.request<Record<string, DokumentMalDetaljer>, any>({
                path: `/api/forsendelse/dokumentvalg/notat`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Henter dokumentmaler som er støttet av applikasjonen
         *
         * @tags forsendelse-innsyn-kontroller
         * @name HentDokumentValgForForsendelse
         * @request GET:/api/forsendelse/dokumentvalg/forsendelse/{forsendelseIdMedPrefix}
         * @secure
         */
        hentDokumentValgForForsendelse: (forsendelseIdMedPrefix: string, params: RequestParams = {}) =>
            this.request<Record<string, DokumentMalDetaljer>, any>({
                path: `/api/forsendelse/dokumentvalg/forsendelse/${forsendelseIdMedPrefix}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags endre-forsendelse-kontroller
         * @name FjernDokumentFraForsendelse
         * @summary Slett dokument fra forsendelse
         * @request DELETE:/api/forsendelse/{forsendelseIdMedPrefix}/{dokumentreferanse}
         * @secure
         */
        fjernDokumentFraForsendelse: (
            forsendelseIdMedPrefix: string,
            dokumentreferanse: string,
            params: RequestParams = {}
        ) =>
            this.request<OppdaterForsendelseResponse, any>({
                path: `/api/forsendelse/${forsendelseIdMedPrefix}/${dokumentreferanse}`,
                method: "DELETE",
                secure: true,
                ...params,
            }),
    };
}
