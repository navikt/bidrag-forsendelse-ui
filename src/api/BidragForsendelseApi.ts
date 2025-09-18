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

export interface OppdaterEttersendelseDokumentRequest {
    /** @format int64 */
    id?: number;
    tittel: string;
    skjemaId?: string;
}

export interface OppdaterEttersendingsoppgaveRequest {
    /** @format int64 */
    forsendelseId: number;
    tittel?: string;
    ettersendelseForJournalpostId?: string;
    skjemaId?: string;
    /** @format int32 */
    innsendingsfristDager?: number;
    oppdaterDokument?: OppdaterEttersendelseDokumentRequest;
}

export interface EttersendingsoppgaveDto {
    tittel?: string;
    ettersendelseForJournalpostId?: string;
    skjemaId?: string;
    /** @format int32 */
    innsendingsfristDager?: number;
    vedleggsliste: EttersendingsoppgaveVedleggDto[];
}

export interface EttersendingsoppgaveVedleggDto {
    tittel: string;
    skjemaId?: string;
    /** @format int64 */
    id: number;
}

export interface BehandlingInfoDto {
    vedtakId?: string;
    behandlingId?: string;
    soknadId?: string;
    engangsBelopType?: Engangsbeloptype;
    stonadType?: Stonadstype;
    /** Brukes bare hvis stonadType og engangsbelopType er null */
    behandlingType?: string;
    vedtakType?: Vedtakstype;
    /** Soknadtype er gamle kodeverdier som er erstattet av vedtaktype. */
    soknadType?: string;
    erFattetBeregnet?: boolean;
    /** Hvis resultatkoden fra BBM er IT så skal denne være sann */
    erVedtakIkkeTilbakekreving?: boolean;
    soknadFra?: SoktAvType;
    barnIBehandling: string[];
}

export enum Engangsbeloptype {
    DIREKTE_OPPGJOR = "DIREKTE_OPPGJOR",
    DIREKTEOPPGJOR = "DIREKTE_OPPGJØR",
    ETTERGIVELSE = "ETTERGIVELSE",
    ETTERGIVELSE_TILBAKEKREVING = "ETTERGIVELSE_TILBAKEKREVING",
    GEBYR_MOTTAKER = "GEBYR_MOTTAKER",
    GEBYR_SKYLDNER = "GEBYR_SKYLDNER",
    INNKREVING_GJELD = "INNKREVING_GJELD",
    TILBAKEKREVING = "TILBAKEKREVING",
    SAERTILSKUDD = "SAERTILSKUDD",
    SAeRTILSKUDD = "SÆRTILSKUDD",
    SAeRBIDRAG = "SÆRBIDRAG",
}

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
    arkivsystem?: OpprettDokumentForesporselArkivsystemEnum;
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
    /** Om dokumentet med dokumentmalId skal bestilles. Hvis dette er satt til false så antas det at kallende system bestiller dokumentet selv. */
    bestillDokument: boolean;
    /** Om dokumentet skal automatisk ferdigstilles etter bestilling */
    ferdigstill: boolean;
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
    tema?: OpprettForsendelseForesporselTemaEnum;
    /** Språk forsendelsen skal være på */
    språk?: string;
    /** Ident til saksbehandler som oppretter journalpost. Dette vil prioriteres over ident som tilhører tokenet til kallet. */
    saksbehandlerIdent?: string;
    /** Opprett tittel på forsendelse automatisk basert på behandling detaljer. Skal bare settes til false hvis gamle brevmeny (Bisys) brukes */
    opprettTittel?: boolean;
    unikReferanse?: string;
    /** Distribuer forsendelse automatisk etter ferdigstilling. Dette kan brukes hvis det er opprettet av batch eller en vedtaksbrev som skal automatisk distribueres etter fattet vedtak (feks manuell aldersjustering) */
    distribuerAutomatiskEtterFerdigstilling: boolean;
}

export enum Stonadstype {
    BIDRAG = "BIDRAG",
    FORSKUDD = "FORSKUDD",
    BIDRAG18AAR = "BIDRAG18AAR",
    EKTEFELLEBIDRAG = "EKTEFELLEBIDRAG",
    MOTREGNING = "MOTREGNING",
    OPPFOSTRINGSBIDRAG = "OPPFOSTRINGSBIDRAG",
}

export enum SoktAvType {
    BIDRAGSMOTTAKER = "BIDRAGSMOTTAKER",
    BIDRAGSPLIKTIG = "BIDRAGSPLIKTIG",
    BARN18AR = "BARN_18_ÅR",
    BM_I_ANNEN_SAK = "BM_I_ANNEN_SAK",
    NAV_BIDRAG = "NAV_BIDRAG",
    FYLKESNEMDA = "FYLKESNEMDA",
    NAV_INTERNASJONALT = "NAV_INTERNASJONALT",
    KOMMUNE = "KOMMUNE",
    NORSKE_MYNDIGHET = "NORSKE_MYNDIGHET",
    UTENLANDSKE_MYNDIGHET = "UTENLANDSKE_MYNDIGHET",
    VERGE = "VERGE",
    TRYGDEETATEN_INNKREVING = "TRYGDEETATEN_INNKREVING",
    KLAGE_ANKE = "KLAGE_ANKE",
    KONVERTERING = "KONVERTERING",
}

export enum Vedtakstype {
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

export interface ConflictException {
    message?: string;
    body?: any;
    cause?: {
        stackTrace?: {
            classLoaderName?: string;
            moduleName?: string;
            moduleVersion?: string;
            methodName?: string;
            fileName?: string;
            /** @format int32 */
            lineNumber?: number;
            className?: string;
            nativeMethod?: boolean;
        }[];
        message?: string;
        localizedMessage?: string;
    };
    stackTrace?: {
        classLoaderName?: string;
        moduleName?: string;
        moduleVersion?: string;
        methodName?: string;
        fileName?: string;
        /** @format int32 */
        lineNumber?: number;
        className?: string;
        nativeMethod?: boolean;
    }[];
    statusCode?: DefaultHttpStatusCode | HttpStatus;
    statusText?: string;
    responseHeaders?: {
        connection?: string[];
        contentType?: MediaType;
        origin?: string;
        host?: {
            hostString?: string;
            address?: {
                hostAddress?: string;
                /** @format byte */
                address?: string;
                hostName?: string;
                linkLocalAddress?: boolean;
                anyLocalAddress?: boolean;
                multicastAddress?: boolean;
                loopbackAddress?: boolean;
                siteLocalAddress?: boolean;
                mcglobal?: boolean;
                mcnodeLocal?: boolean;
                mclinkLocal?: boolean;
                mcsiteLocal?: boolean;
                mcorgLocal?: boolean;
                canonicalHostName?: string;
            };
            /** @format int32 */
            port?: number;
            unresolved?: boolean;
            hostName?: string;
        };
        /** @format int64 */
        ifModifiedSince?: number;
        /** @format int64 */
        contentLength?: number;
        empty?: boolean;
        /** @format uri */
        location?: string;
        all?: Record<string, string>;
        /** @format int64 */
        lastModified?: number;
        /** @format int64 */
        date?: number;
        cacheControl?: string;
        contentDisposition?: ContentDisposition;
        acceptCharset?: string[];
        /** @uniqueItems true */
        allow?: HttpMethod[];
        bearerAuth?: string;
        basicAuth?: string;
        accept?: MediaType[];
        acceptPatch?: MediaType[];
        etag?: string;
        /** @format int64 */
        expires?: number;
        ifMatch?: string[];
        ifNoneMatch?: string[];
        pragma?: string;
        upgrade?: string;
        vary?: string[];
        range?: HttpRange[];
        /** @format int64 */
        accessControlMaxAge?: number;
        acceptLanguage?: {
            range?: string;
            /** @format double */
            weight?: number;
        }[];
        contentLanguage?: string;
        /** @format int64 */
        ifUnmodifiedSince?: number;
        accessControlAllowCredentials?: boolean;
        acceptLanguageAsLocales?: string[];
        accessControlAllowHeaders?: string[];
        accessControlAllowMethods?: HttpMethod[];
        accessControlAllowOrigin?: string;
        accessControlExposeHeaders?: string[];
        accessControlRequestHeaders?: string[];
        accessControlRequestMethod?: HttpMethod;
        [key: string]: any;
    };
    /**
     * @deprecated
     * @format int32
     */
    rawStatusCode?: number;
    bodyConvertFunction?: any;
    /** @format byte */
    responseBodyAsByteArray?: string;
    responseBodyAsString?: string;
    rootCause?: {
        cause?: {
            stackTrace?: {
                classLoaderName?: string;
                moduleName?: string;
                moduleVersion?: string;
                methodName?: string;
                fileName?: string;
                /** @format int32 */
                lineNumber?: number;
                className?: string;
                nativeMethod?: boolean;
            }[];
            message?: string;
            localizedMessage?: string;
        };
        stackTrace?: {
            classLoaderName?: string;
            moduleName?: string;
            moduleVersion?: string;
            methodName?: string;
            fileName?: string;
            /** @format int32 */
            lineNumber?: number;
            className?: string;
            nativeMethod?: boolean;
        }[];
        message?: string;
        suppressed?: {
            stackTrace?: {
                classLoaderName?: string;
                moduleName?: string;
                moduleVersion?: string;
                methodName?: string;
                fileName?: string;
                /** @format int32 */
                lineNumber?: number;
                className?: string;
                nativeMethod?: boolean;
            }[];
            message?: string;
            localizedMessage?: string;
        }[];
        localizedMessage?: string;
    };
    mostSpecificCause?: {
        stackTrace?: {
            classLoaderName?: string;
            moduleName?: string;
            moduleVersion?: string;
            methodName?: string;
            fileName?: string;
            /** @format int32 */
            lineNumber?: number;
            className?: string;
            nativeMethod?: boolean;
        }[];
        message?: string;
        localizedMessage?: string;
    };
    suppressed?: {
        stackTrace?: {
            classLoaderName?: string;
            moduleName?: string;
            moduleVersion?: string;
            methodName?: string;
            fileName?: string;
            /** @format int32 */
            lineNumber?: number;
            className?: string;
            nativeMethod?: boolean;
        }[];
        message?: string;
        localizedMessage?: string;
    }[];
    localizedMessage?: string;
}

export interface ContentDisposition {
    type?: string;
    name?: string;
    filename?: string;
    charset?: string;
    /**
     * @deprecated
     * @format int64
     */
    size?: number;
    /**
     * @deprecated
     * @format date-time
     */
    creationDate?: string;
    /**
     * @deprecated
     * @format date-time
     */
    modificationDate?: string;
    /**
     * @deprecated
     * @format date-time
     */
    readDate?: string;
    inline?: boolean;
    attachment?: boolean;
    formData?: boolean;
}

export type DefaultHttpStatusCode = HttpStatusCode;

export type HttpMethod = any;

export type HttpRange = any;

export enum HttpStatus {
    Value100CONTINUE = "100 CONTINUE",
    Value101SWITCHINGPROTOCOLS = "101 SWITCHING_PROTOCOLS",
    Value102PROCESSING = "102 PROCESSING",
    Value103EARLYHINTS = "103 EARLY_HINTS",
    Value103CHECKPOINT = "103 CHECKPOINT",
    Value200OK = "200 OK",
    Value201CREATED = "201 CREATED",
    Value202ACCEPTED = "202 ACCEPTED",
    Value203NONAUTHORITATIVEINFORMATION = "203 NON_AUTHORITATIVE_INFORMATION",
    Value204NOCONTENT = "204 NO_CONTENT",
    Value205RESETCONTENT = "205 RESET_CONTENT",
    Value206PARTIALCONTENT = "206 PARTIAL_CONTENT",
    Value207MULTISTATUS = "207 MULTI_STATUS",
    Value208ALREADYREPORTED = "208 ALREADY_REPORTED",
    Value226IMUSED = "226 IM_USED",
    Value300MULTIPLECHOICES = "300 MULTIPLE_CHOICES",
    Value301MOVEDPERMANENTLY = "301 MOVED_PERMANENTLY",
    Value302FOUND = "302 FOUND",
    Value302MOVEDTEMPORARILY = "302 MOVED_TEMPORARILY",
    Value303SEEOTHER = "303 SEE_OTHER",
    Value304NOTMODIFIED = "304 NOT_MODIFIED",
    Value305USEPROXY = "305 USE_PROXY",
    Value307TEMPORARYREDIRECT = "307 TEMPORARY_REDIRECT",
    Value308PERMANENTREDIRECT = "308 PERMANENT_REDIRECT",
    Value400BADREQUEST = "400 BAD_REQUEST",
    Value401UNAUTHORIZED = "401 UNAUTHORIZED",
    Value402PAYMENTREQUIRED = "402 PAYMENT_REQUIRED",
    Value403FORBIDDEN = "403 FORBIDDEN",
    Value404NOTFOUND = "404 NOT_FOUND",
    Value405METHODNOTALLOWED = "405 METHOD_NOT_ALLOWED",
    Value406NOTACCEPTABLE = "406 NOT_ACCEPTABLE",
    Value407PROXYAUTHENTICATIONREQUIRED = "407 PROXY_AUTHENTICATION_REQUIRED",
    Value408REQUESTTIMEOUT = "408 REQUEST_TIMEOUT",
    Value409CONFLICT = "409 CONFLICT",
    Value410GONE = "410 GONE",
    Value411LENGTHREQUIRED = "411 LENGTH_REQUIRED",
    Value412PRECONDITIONFAILED = "412 PRECONDITION_FAILED",
    Value413PAYLOADTOOLARGE = "413 PAYLOAD_TOO_LARGE",
    Value413REQUESTENTITYTOOLARGE = "413 REQUEST_ENTITY_TOO_LARGE",
    Value414URITOOLONG = "414 URI_TOO_LONG",
    Value414REQUESTURITOOLONG = "414 REQUEST_URI_TOO_LONG",
    Value415UNSUPPORTEDMEDIATYPE = "415 UNSUPPORTED_MEDIA_TYPE",
    Value416REQUESTEDRANGENOTSATISFIABLE = "416 REQUESTED_RANGE_NOT_SATISFIABLE",
    Value417EXPECTATIONFAILED = "417 EXPECTATION_FAILED",
    Value418IAMATEAPOT = "418 I_AM_A_TEAPOT",
    Value419INSUFFICIENTSPACEONRESOURCE = "419 INSUFFICIENT_SPACE_ON_RESOURCE",
    Value420METHODFAILURE = "420 METHOD_FAILURE",
    Value421DESTINATIONLOCKED = "421 DESTINATION_LOCKED",
    Value422UNPROCESSABLEENTITY = "422 UNPROCESSABLE_ENTITY",
    Value423LOCKED = "423 LOCKED",
    Value424FAILEDDEPENDENCY = "424 FAILED_DEPENDENCY",
    Value425TOOEARLY = "425 TOO_EARLY",
    Value426UPGRADEREQUIRED = "426 UPGRADE_REQUIRED",
    Value428PRECONDITIONREQUIRED = "428 PRECONDITION_REQUIRED",
    Value429TOOMANYREQUESTS = "429 TOO_MANY_REQUESTS",
    Value431REQUESTHEADERFIELDSTOOLARGE = "431 REQUEST_HEADER_FIELDS_TOO_LARGE",
    Value451UNAVAILABLEFORLEGALREASONS = "451 UNAVAILABLE_FOR_LEGAL_REASONS",
    Value500INTERNALSERVERERROR = "500 INTERNAL_SERVER_ERROR",
    Value501NOTIMPLEMENTED = "501 NOT_IMPLEMENTED",
    Value502BADGATEWAY = "502 BAD_GATEWAY",
    Value503SERVICEUNAVAILABLE = "503 SERVICE_UNAVAILABLE",
    Value504GATEWAYTIMEOUT = "504 GATEWAY_TIMEOUT",
    Value505HTTPVERSIONNOTSUPPORTED = "505 HTTP_VERSION_NOT_SUPPORTED",
    Value506VARIANTALSONEGOTIATES = "506 VARIANT_ALSO_NEGOTIATES",
    Value507INSUFFICIENTSTORAGE = "507 INSUFFICIENT_STORAGE",
    Value508LOOPDETECTED = "508 LOOP_DETECTED",
    Value509BANDWIDTHLIMITEXCEEDED = "509 BANDWIDTH_LIMIT_EXCEEDED",
    Value510NOTEXTENDED = "510 NOT_EXTENDED",
    Value511NETWORKAUTHENTICATIONREQUIRED = "511 NETWORK_AUTHENTICATION_REQUIRED",
}

export interface HttpStatusCode {
    error?: boolean;
    is2xxSuccessful?: boolean;
    is4xxClientError?: boolean;
    is5xxServerError?: boolean;
    is1xxInformational?: boolean;
    is3xxRedirection?: boolean;
}

export interface MediaType {
    type?: string;
    subtype?: string;
    parameters?: Record<string, string>;
    /** @format double */
    qualityValue?: number;
    wildcardSubtype?: boolean;
    subtypeSuffix?: string;
    charset?: string;
    wildcardType?: boolean;
    concrete?: boolean;
}

/** Metadata til en respons etter dokumenter i forsendelse ble opprettet */
export interface DokumentRespons {
    dokumentreferanse: string;
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
    erSkjema: boolean;
    /** Dette skal være UNDER_PRODUKSJON for redigerbare dokumenter som ikke er ferdigprodusert. Ellers settes det til FERDIGSTILT */
    status?: DokumentStatusTo;
    arkivsystem?: DokumentResponsArkivsystemEnum;
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
    /** Addresse som skal brukes ved bestilling av ny distribusjon av utgående journalpost. Benyttes ved avvik BESTILL_NY_DISTRIBUSJON */
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
    status?: DokumentDtoStatusEnum;
    /** Arkivsystem hvor dokumentet er produsert og lagret */
    arkivSystem?: DokumentDtoArkivSystemEnum;
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
    ettersendingsoppgave?: OpprettEttersendingsppgaveDto;
}

export interface OpprettEttersendingsoppgaveVedleggDto {
    tittel?: string;
    url?: string;
    vedleggsnr: string;
}

export interface OpprettEttersendingsppgaveDto {
    tittel: string;
    skjemaId: string;
    språk: Sprak;
    /** @format int32 */
    innsendingsFristDager: number;
    vedleggsliste: OpprettEttersendingsoppgaveVedleggDto[];
}

export enum Sprak {
    NB = "NB",
    NN = "NN",
    AR = "AR",
    DA = "DA",
    DE = "DE",
    EN = "EN",
    EL = "EL",
    ET = "ET",
    ES = "ES",
    FI = "FI",
    FR = "FR",
    IS = "IS",
    IT = "IT",
    JA = "JA",
    HR = "HR",
    LV = "LV",
    LT = "LT",
    NL = "NL",
    PL = "PL",
    PT = "PT",
    RO = "RO",
    RU = "RU",
    SR = "SR",
    SL = "SL",
    SK = "SK",
    SV = "SV",
    TH = "TH",
    TR = "TR",
    UK = "UK",
    HU = "HU",
    VI = "VI",
}

/** Respons etter bestilt distribusjon */
export interface DistribuerJournalpostResponse {
    /** Journalpostid for dokument som det ble bestilt distribusjon for */
    journalpostId: string;
    /** Bestillingid som unikt identifiserer distribusjonsbestillingen. Vil være null hvis ingen distribusjon er bestilt. */
    bestillingsId?: string;
    ettersendingsoppgave?: OpprettEttersendingsoppgaveResponseDto;
}

export interface OpprettEttersendingsoppgaveResponseDto {
    innsendingsId: string;
}

export interface OpprettEttersendingsoppgaveRequest {
    /** @format int64 */
    forsendelseId: number;
    tittel?: string;
    ettersendelseForJournalpostId: string;
    skjemaId: string;
}

export interface HentDokumentValgRequest {
    soknadType?: string;
    vedtakType?: Vedtakstype;
    behandlingType?: string;
    soknadFra?: SoktAvType;
    erFattetBeregnet?: boolean;
    erVedtakIkkeTilbakekreving?: boolean;
    vedtakId?: string;
    behandlingId?: string;
    enhet?: string;
    inneholderAldersjustering?: boolean;
    erOrkestrertVedtak?: boolean;
    stonadType?: Stonadstype;
    engangsBelopType?: Engangsbeloptype;
    behandlingtypeKonvertert?: string;
}

export interface DokumentMalDetaljer {
    malId: string;
    tittel: string;
    type: DokumentMalDetaljerTypeEnum;
    kanBestilles: boolean;
    redigerbar: boolean;
    beskrivelse: string;
    nyDokumentProduksjon: boolean;
    statiskInnhold: boolean;
    kreverVedtak: boolean;
    kreverBehandling: boolean;
    innholdType?: DokumentMalDetaljerInnholdTypeEnum;
    gruppeVisningsnavn?: string;
    språk: string[];
    tilhorerEnheter: string[];
    alternativeTitler: string[];
}

export interface HentDokumentValgResponse {
    dokumentMalDetaljer: Record<string, DokumentMalDetaljer>;
    automatiskOpprettDokumenter: DokumentMalDetaljer[];
}

/** Metadata for dokument som skal knyttes til forsendelsen. Første dokument i listen blir automatisk satt som hoveddokument i forsendelsen */
export interface OppdaterDokumentForesporsel {
    /** JournalpostId til dokumentet hvis det er allerede er lagret i arkivsystem */
    journalpostId?: string;
    dokumentmalId?: string;
    dokumentreferanse?: string;
    /** Språket på innholdet i dokumentet */
    språk?: string;
    tittel?: string;
    fjernTilknytning?: boolean;
    /** @format date-time */
    dokumentDato?: string;
    arkivsystem?: OppdaterDokumentForesporselArkivsystemEnum;
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
    tema?: OppdaterForsendelseForesporselTemaEnum;
    /** Språk forsendelsen skal være på */
    språk?: string;
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
    /**
     * @format binary
     * @minLength 1
     */
    fysiskDokument: File;
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
    gjelderType?: EndreJournalpostCommandGjelderTypeEnum;
    /** Tittel på journalposten */
    tittel?: string;
    /** Skal journalposten journalføres aka. registreres */
    skalJournalfores: boolean;
    /** Liste med retur detaljer som skal endres */
    endreReturDetaljer: EndreReturDetaljer[];
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
    format: DokumentMetadataFormatEnum;
    /** Status på dokumentet */
    status: DokumentMetadataStatusEnum;
    /** Hvilken arkivsystem dokumentet er lagret på */
    arkivsystem: DokumentMetadataArkivsystemEnum;
}

/** Metadata om behandling */
export interface BehandlingInfoResponseDto {
    vedtakId?: string;
    behandlingId?: string;
    soknadId?: string;
    behandlingType?: string;
    erFattet?: boolean;
    barnIBehandling?: string[];
}

/** Metadata om forsendelse */
export interface ForsendelseResponsTo {
    /** @format int64 */
    forsendelseId: number;
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
    /** Detaljer om behandling forsendelse er knyttet til */
    behandlingInfo?: BehandlingInfoResponseDto;
    /** Detaljer om varsel ettersendelse */
    ettersendingsoppgave?: EttersendingsoppgaveDto;
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
    unikReferanse?: string;
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
    type?: AktorDtoTypeEnum;
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
    type: AvsenderMottakerDtoTypeEnum;
    /** Adresse til mottaker hvis dokumentet skal sendes/er sendt gjennom sentral print */
    adresse?: MottakerAdresseTo;
}

export interface EttersendingsppgaveDto {
    tittel: string;
    skjemaId: string;
    innsendingsId?: string;
    språk: string;
    status: EttersendingsppgaveDtoStatusEnum;
    /** @format date */
    opprettetDato?: string;
    /** @format date */
    fristDato?: string;
    /** @format date */
    slettesDato?: string;
    vedleggsliste: EttersendingsoppgaveVedleggDto[];
}

/** Metadata til en journalpost */
export interface JournalpostDto {
    /**
     * Avsenders navn (med eventuelt fornavn bak komma)
     * @deprecated
     */
    avsenderNavn?: string;
    /** Informasjon om avsender eller mottaker */
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
    /** Aktøren for hvem/hva dokumente(t/ne) gjelder */
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
     * Kanalen som er kilden til at journalposten ble registrert
     * @deprecated
     */
    kilde?: JournalpostDtoKildeEnum;
    /** Kanalen journalposten ble mottatt i eller sendt ut på */
    kanal?: JournalpostDtoKanalEnum;
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
    status?: JournalpostDtoStatusEnum;
    /** Om journalposten er feilført på bidragssak */
    feilfort?: boolean;
    /** Brevkoden til en journalpost */
    brevkode?: KodeDto;
    /** Informasjon om returdetaljer til journalpost */
    returDetaljer?: ReturDetaljer;
    /** Joark journalpostid for bidrag journalpost som er arkivert i Joark */
    joarkJournalpostId?: string;
    /** Adresse som utgående journalpost var distribuert til ved sentral print */
    distribuertTilAdresse?: DistribuerTilAdresse;
    /** Informasjon om returdetaljer til journalpost */
    sakstilknytninger: string[];
    /** Språket til dokumentet i Journalposten */
    språk?: string;
    /** Saksbehandler som opprettet journalposten */
    opprettetAvIdent?: string;
    /** Referanse til originale kilden til journalposten. Kan være referanse til forsendelse eller bidrag journalpost med prefiks. Feks BID_12323 eller BIF_123213 */
    eksternReferanseId?: string;
    ettersendingsppgave?: EttersendingsppgaveDto;
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
    logg: ReturDetaljerLog[];
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
    /** journalposten som er etterspurt */
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

export interface DokumentSoknadDto {
    brukerId: string;
    skjemanr: string;
    tittel: string;
    tema: string;
    status: DokumentSoknadDtoStatusEnum;
    /** @format date-time */
    opprettetDato: string;
    vedleggsListe: VedleggDto[];
    /** @format int64 */
    id?: number;
    innsendingsId?: string;
    ettersendingsId?: string;
    spraak?: string;
    /** @format date-time */
    endretDato?: string;
    /** @format date-time */
    innsendtDato?: string;
    /** @format int64 */
    visningsSteg?: number;
    visningsType?: DokumentSoknadDtoVisningsTypeEnum;
    kanLasteOppAnnet?: boolean;
    /** @format date-time */
    innsendingsFristDato?: string;
    /** @format date-time */
    forsteInnsendingsDato?: string;
    /** @format int64 */
    fristForEttersendelse?: number;
    arkiveringsStatus?: DokumentSoknadDtoArkiveringsStatusEnum;
    erSystemGenerert?: boolean;
    soknadstype?: DokumentSoknadDtoSoknadstypeEnum;
    skjemaPath?: string;
    applikasjon?: string;
    /** @format date-time */
    skalSlettesDato?: string;
    /** @format int32 */
    mellomlagringDager?: number;
}

export interface VedleggDto {
    tittel: string;
    label: string;
    erHoveddokument: boolean;
    erVariant: boolean;
    erPdfa: boolean;
    erPakrevd: boolean;
    opplastingsStatus: VedleggDtoOpplastingsStatusEnum;
    /** @format date-time */
    opprettetdato: string;
    /** @format int64 */
    id?: number;
    vedleggsnr?: string;
    beskrivelse?: string;
    uuid?: string;
    mimetype?: VedleggDtoMimetypeEnum;
    /** @format byte */
    document?: string;
    skjemaurl?: string;
    /** @format date-time */
    innsendtdato?: string;
    formioId?: string;
    opplastingsValgKommentarLedetekst?: string;
    opplastingsValgKommentar?: string;
}

export interface SlettEttersendingsoppgave {
    /** @format int64 */
    forsendelseId: number;
}

export interface SlettEttersendingsoppgaveVedleggRequest {
    /** @format int64 */
    forsendelseId: number;
    /** @format int64 */
    id: number;
}

/** Arkivsystem hvor dokument er lagret */
export enum OpprettDokumentForesporselArkivsystemEnum {
    JOARK = "JOARK",
    MIDLERTIDLIG_BREVLAGER = "MIDLERTIDLIG_BREVLAGER",
    UKJENT = "UKJENT",
    BIDRAG = "BIDRAG",
    FORSENDELSE = "FORSENDELSE",
}

/** Tema forsendelsen skal opprettes med */
export enum OpprettForsendelseForesporselTemaEnum {
    BID = "BID",
    FAR = "FAR",
}

export enum DokumentResponsArkivsystemEnum {
    JOARK = "JOARK",
    MIDLERTIDLIG_BREVLAGER = "MIDLERTIDLIG_BREVLAGER",
    UKJENT = "UKJENT",
    BIDRAG = "BIDRAG",
    FORSENDELSE = "FORSENDELSE",
}

/** Dokumentets status. Benyttes hvis journalposten er av typen forsendelse */
export enum DokumentDtoStatusEnum {
    IKKE_BESTILT = "IKKE_BESTILT",
    BESTILLING_FEILET = "BESTILLING_FEILET",
    UNDER_PRODUKSJON = "UNDER_PRODUKSJON",
    UNDER_REDIGERING = "UNDER_REDIGERING",
    FERDIGSTILT = "FERDIGSTILT",
    AVBRUTT = "AVBRUTT",
}

/** Arkivsystem hvor dokumentet er produsert og lagret */
export enum DokumentDtoArkivSystemEnum {
    JOARK = "JOARK",
    MIDLERTIDLIG_BREVLAGER = "MIDLERTIDLIG_BREVLAGER",
    UKJENT = "UKJENT",
    BIDRAG = "BIDRAG",
    FORSENDELSE = "FORSENDELSE",
}

export enum DokumentMalDetaljerTypeEnum {
    UTGAENDE = "UTGÅENDE",
    NOTAT = "NOTAT",
}

export enum DokumentMalDetaljerInnholdTypeEnum {
    NOTAT = "NOTAT",
    VARSEL_STANDARD = "VARSEL_STANDARD",
    VARSEL = "VARSEL",
    VEDTAK = "VEDTAK",
    VEDLEGG_VEDTAK = "VEDLEGG_VEDTAK",
    VEDLEGG_VARSEL = "VEDLEGG_VARSEL",
    VEDLEGG = "VEDLEGG",
    SKJEMA = "SKJEMA",
}

export enum OppdaterDokumentForesporselArkivsystemEnum {
    JOARK = "JOARK",
    MIDLERTIDLIG_BREVLAGER = "MIDLERTIDLIG_BREVLAGER",
    UKJENT = "UKJENT",
    BIDRAG = "BIDRAG",
    FORSENDELSE = "FORSENDELSE",
}

/** Tema forsendelsen skal opprettes med */
export enum OppdaterForsendelseForesporselTemaEnum {
    BID = "BID",
    FAR = "FAR",
}

/** Type ident for gjelder: FNR, ORGNR, AKTOERID */
export enum EndreJournalpostCommandGjelderTypeEnum {
    AKTOERID = "AKTOERID",
    FNR = "FNR",
    ORGNR = "ORGNR",
}

/** Hvilken format dokument er på. Dette forteller hvordan dokumentet må åpnes. */
export enum DokumentMetadataFormatEnum {
    PDF = "PDF",
    MBDOK = "MBDOK",
    HTML = "HTML",
}

/** Status på dokumentet */
export enum DokumentMetadataStatusEnum {
    IKKE_BESTILT = "IKKE_BESTILT",
    BESTILLING_FEILET = "BESTILLING_FEILET",
    UNDER_PRODUKSJON = "UNDER_PRODUKSJON",
    UNDER_REDIGERING = "UNDER_REDIGERING",
    FERDIGSTILT = "FERDIGSTILT",
    AVBRUTT = "AVBRUTT",
}

/** Hvilken arkivsystem dokumentet er lagret på */
export enum DokumentMetadataArkivsystemEnum {
    JOARK = "JOARK",
    MIDLERTIDLIG_BREVLAGER = "MIDLERTIDLIG_BREVLAGER",
    UKJENT = "UKJENT",
    BIDRAG = "BIDRAG",
    FORSENDELSE = "FORSENDELSE",
}

/** Hvilken identtype som skal brukes */
export enum AktorDtoTypeEnum {
    AKTOERID = "AKTOERID",
    FNR = "FNR",
    ORGNR = "ORGNR",
}

/** Identtype */
export enum AvsenderMottakerDtoTypeEnum {
    FNR = "FNR",
    SAMHANDLER = "SAMHANDLER",
    ORGNR = "ORGNR",
    UTENLANDSK_ORGNR = "UTENLANDSK_ORGNR",
    UKJENT = "UKJENT",
}

export enum EttersendingsppgaveDtoStatusEnum {
    OPPRETTET = "OPPRETTET",
    UTFYLT = "UTFYLT",
    INNSENDT = "INNSENDT",
    SLETTET_AV_BRUKER = "SLETTET_AV_BRUKER",
    AUTOMATISK_SLETTET = "AUTOMATISK_SLETTET",
    UKJENT = "UKJENT",
    IKKE_OPPRETTET = "IKKE_OPPRETTET",
}

/**
 * Kanalen som er kilden til at journalposten ble registrert
 * @deprecated
 */
export enum JournalpostDtoKildeEnum {
    NAV_NO = "NAV_NO",
    NAV_NO_BID = "NAV_NO_BID",
    SKAN_BID = "SKAN_BID",
    SKAN_NETS = "SKAN_NETS",
    SKAN_IM = "SKAN_IM",
    LOKAL_UTSKRIFT = "LOKAL_UTSKRIFT",
    SENTRAL_UTSKRIFT = "SENTRAL_UTSKRIFT",
    SDP = "SDP",
    INGEN_DISTRIBUSJON = "INGEN_DISTRIBUSJON",
    INNSENDT_NAV_ANSATT = "INNSENDT_NAV_ANSATT",
    NAV_NO_UINNLOGGET = "NAV_NO_UINNLOGGET",
    NAV_NO_CHAT = "NAV_NO_CHAT",
}

/** Kanalen journalposten ble mottatt i eller sendt ut på */
export enum JournalpostDtoKanalEnum {
    NAV_NO = "NAV_NO",
    NAV_NO_BID = "NAV_NO_BID",
    SKAN_BID = "SKAN_BID",
    SKAN_NETS = "SKAN_NETS",
    SKAN_IM = "SKAN_IM",
    LOKAL_UTSKRIFT = "LOKAL_UTSKRIFT",
    SENTRAL_UTSKRIFT = "SENTRAL_UTSKRIFT",
    SDP = "SDP",
    INGEN_DISTRIBUSJON = "INGEN_DISTRIBUSJON",
    INNSENDT_NAV_ANSATT = "INNSENDT_NAV_ANSATT",
    NAV_NO_UINNLOGGET = "NAV_NO_UINNLOGGET",
    NAV_NO_CHAT = "NAV_NO_CHAT",
}

/** Journalpostens status */
export enum JournalpostDtoStatusEnum {
    AVVIK_ENDRE_FAGOMRADE = "AVVIK_ENDRE_FAGOMRADE",
    AVVIK_BESTILL_RESKANNING = "AVVIK_BESTILL_RESKANNING",
    AVVIK_BESTILL_SPLITTING = "AVVIK_BESTILL_SPLITTING",
    MOTTATT = "MOTTATT",
    JOURNALFORT = "JOURNALFØRT",
    EKSPEDERT = "EKSPEDERT",
    EKSPEDERT_JOARK = "EKSPEDERT_JOARK",
    MOTTAKSREGISTRERT = "MOTTAKSREGISTRERT",
    UKJENT = "UKJENT",
    DISTRIBUERT = "DISTRIBUERT",
    AVBRUTT = "AVBRUTT",
    KLAR_FOR_DISTRIBUSJON = "KLAR_FOR_DISTRIBUSJON",
    RETUR = "RETUR",
    FERDIGSTILT = "FERDIGSTILT",
    FEILREGISTRERT = "FEILREGISTRERT",
    RESERVERT = "RESERVERT",
    UTGAR = "UTGÅR",
    SLETTET = "SLETTET",
    UNDER_OPPRETTELSE = "UNDER_OPPRETTELSE",
    TIL_LAGRING = "TIL_LAGRING",
    OPPRETTET = "OPPRETTET",
    UNDER_PRODUKSJON = "UNDER_PRODUKSJON",
}

export enum DokumentSoknadDtoStatusEnum {
    Opprettet = "Opprettet",
    Utfylt = "Utfylt",
    Innsendt = "Innsendt",
    SlettetAvBruker = "SlettetAvBruker",
    AutomatiskSlettet = "AutomatiskSlettet",
}

export enum DokumentSoknadDtoVisningsTypeEnum {
    FyllUt = "fyllUt",
    Dokumentinnsending = "dokumentinnsending",
    Ettersending = "ettersending",
    Lospost = "lospost",
}

export enum DokumentSoknadDtoArkiveringsStatusEnum {
    IkkeSatt = "IkkeSatt",
    Arkivert = "Arkivert",
    ArkiveringFeilet = "ArkiveringFeilet",
}

export enum DokumentSoknadDtoSoknadstypeEnum {
    Soknad = "soknad",
    Ettersendelse = "ettersendelse",
}

export enum VedleggDtoOpplastingsStatusEnum {
    IkkeValgt = "IkkeValgt",
    LastetOpp = "LastetOpp",
    Innsendt = "Innsendt",
    SendSenere = "SendSenere",
    SendesAvAndre = "SendesAvAndre",
    SendesIkke = "SendesIkke",
    LastetOppIkkeRelevantLenger = "LastetOppIkkeRelevantLenger",
    LevertDokumentasjonTidligere = "LevertDokumentasjonTidligere",
    HarIkkeDokumentasjonen = "HarIkkeDokumentasjonen",
    NavKanHenteDokumentasjon = "NavKanHenteDokumentasjon",
}

export enum VedleggDtoMimetypeEnum {
    ApplicationPdf = "application/pdf",
    ApplicationJson = "application/json",
    ImagePng = "image/png",
    ImageJpeg = "image/jpeg",
    ApplicationXml = "application/xml",
}

export enum HentAvvikEnum {
    ARKIVERE_JOURNALPOST = "ARKIVERE_JOURNALPOST",
    BESTILL_ORIGINAL = "BESTILL_ORIGINAL",
    BESTILL_RESKANNING = "BESTILL_RESKANNING",
    BESTILL_SPLITTING = "BESTILL_SPLITTING",
    ENDRE_FAGOMRADE = "ENDRE_FAGOMRADE",
    SEND_TIL_FAGOMRADE = "SEND_TIL_FAGOMRADE",
    KOPIER_FRA_ANNEN_FAGOMRADE = "KOPIER_FRA_ANNEN_FAGOMRADE",
    SEND_KOPI_TIL_FAGOMRADE = "SEND_KOPI_TIL_FAGOMRADE",
    FEILFORE_SAK = "FEILFORE_SAK",
    INNG_TIL_UTG_DOKUMENT = "INNG_TIL_UTG_DOKUMENT",
    OVERFOR_TIL_ANNEN_ENHET = "OVERFOR_TIL_ANNEN_ENHET",
    SLETT_JOURNALPOST = "SLETT_JOURNALPOST",
    TREKK_JOURNALPOST = "TREKK_JOURNALPOST",
    REGISTRER_RETUR = "REGISTRER_RETUR",
    MANGLER_ADRESSE = "MANGLER_ADRESSE",
    BESTILL_NY_DISTRIBUSJON = "BESTILL_NY_DISTRIBUSJON",
    FARSKAP_UTELUKKET = "FARSKAP_UTELUKKET",
}

export enum HentAvvikEnum1 {
    ARKIVERE_JOURNALPOST = "ARKIVERE_JOURNALPOST",
    BESTILL_ORIGINAL = "BESTILL_ORIGINAL",
    BESTILL_RESKANNING = "BESTILL_RESKANNING",
    BESTILL_SPLITTING = "BESTILL_SPLITTING",
    ENDRE_FAGOMRADE = "ENDRE_FAGOMRADE",
    SEND_TIL_FAGOMRADE = "SEND_TIL_FAGOMRADE",
    KOPIER_FRA_ANNEN_FAGOMRADE = "KOPIER_FRA_ANNEN_FAGOMRADE",
    SEND_KOPI_TIL_FAGOMRADE = "SEND_KOPI_TIL_FAGOMRADE",
    FEILFORE_SAK = "FEILFORE_SAK",
    INNG_TIL_UTG_DOKUMENT = "INNG_TIL_UTG_DOKUMENT",
    OVERFOR_TIL_ANNEN_ENHET = "OVERFOR_TIL_ANNEN_ENHET",
    SLETT_JOURNALPOST = "SLETT_JOURNALPOST",
    TREKK_JOURNALPOST = "TREKK_JOURNALPOST",
    REGISTRER_RETUR = "REGISTRER_RETUR",
    MANGLER_ADRESSE = "MANGLER_ADRESSE",
    BESTILL_NY_DISTRIBUSJON = "BESTILL_NY_DISTRIBUSJON",
    FARSKAP_UTELUKKET = "FARSKAP_UTELUKKET",
}

export enum HentJournalParamsFagomradeEnum {
    BID = "BID",
    FAR = "FAR",
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

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
        if (input instanceof FormData) {
            return input;
        }
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
                ...(type ? { "Content-Type": type } : {}),
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
         * @tags ettersendingsoppgave-controller
         * @name OppdaterEttesendingsoppgave
         * @summary Oppretter ny varsel ettersendelse
         * @request PUT:/api/forsendelse/ettersendingsoppgave
         * @secure
         */
        oppdaterEttesendingsoppgave: (data: OppdaterEttersendingsoppgaveRequest, params: RequestParams = {}) =>
            this.request<EttersendingsoppgaveDto, any>({
                path: `/api/forsendelse/ettersendingsoppgave`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags ettersendingsoppgave-controller
         * @name OpprettEttersendingsoppgave
         * @summary Oppretter ny ettersendingsoppgave
         * @request POST:/api/forsendelse/ettersendingsoppgave
         * @secure
         */
        opprettEttersendingsoppgave: (data: OpprettEttersendingsoppgaveRequest, params: RequestParams = {}) =>
            this.request<EttersendingsoppgaveDto, any>({
                path: `/api/forsendelse/ettersendingsoppgave`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags ettersendingsoppgave-controller
         * @name SlettEttersendingsoppgave
         * @summary Oppretter ny ettersendingsoppave
         * @request DELETE:/api/forsendelse/ettersendingsoppgave
         * @secure
         */
        slettEttersendingsoppgave: (data: SlettEttersendingsoppgave, params: RequestParams = {}) =>
            this.request<void, void>({
                path: `/api/forsendelse/ettersendingsoppgave`,
                method: "DELETE",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

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
            this.request<OpprettForsendelseRespons, OpprettForsendelseRespons | ConflictException>({
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
         * No description
         *
         * @tags rediger-dokument-kontroller
         * @name ValiderPdf
         * @summary Valider om PDF er gyldig PDF/A dokument. Respons vil gi hva som ikke er gyldig hvis ikke gyldig PDF/A.
         * @request POST:/api/forsendelse/redigering/validerPDF
         * @secure
         */
        validerPdf: (data: File, params: RequestParams = {}) =>
            this.request<string, any>({
                path: `/api/forsendelse/redigering/validerPDF`,
                method: "POST",
                body: data,
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags rediger-dokument-kontroller
         * @name ReparerPdf
         * @summary Reparer PDF hvis den er korrupt
         * @request POST:/api/forsendelse/redigering/reparerPDF
         * @secure
         */
        reparerPdf: (data: File, params: RequestParams = {}) =>
            this.request<any, File>({
                path: `/api/forsendelse/redigering/reparerPDF`,
                method: "POST",
                body: data,
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags rediger-dokument-kontroller
         * @name ReparerPdfBase64
         * @summary Reparer PDF hvis den er korrupt
         * @request POST:/api/forsendelse/redigering/reparerPDFBase64
         * @secure
         */
        reparerPdfBase64: (data: string, params: RequestParams = {}) =>
            this.request<any, File>({
                path: `/api/forsendelse/redigering/reparerPDFBase64`,
                method: "POST",
                body: data,
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags rediger-dokument-kontroller
         * @name ConvertToPdfa2
         * @summary Valider om PDF er gyldig PDF/A dokument. Respons vil gi hva som ikke er gyldig hvis ikke gyldig PDF/A.
         * @request POST:/api/forsendelse/redigering/convertToPDFA
         * @secure
         */
        convertToPdfa2: (data: File, params: RequestParams = {}) =>
            this.request<string, any>({
                path: `/api/forsendelse/redigering/convertToPDFA`,
                method: "POST",
                body: data,
                secure: true,
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
            this.request<HentAvvikEnum[], HentAvvikEnum1[]>({
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
                ingenDistribusjon?: boolean;
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
         * @description Sjekk status på dokumentene i en enkel forsendelse og oppdater status hvis det er ute av synk. Dette skal brukes hvis feks en dokument er ferdigstilt i midlertidlig brevlager men status i databasen er fortsatt "under redigering" Denne tjenesten vil sjekke om dokumentet er ferdigstilt og oppdatere status hvis det er det. Bruk denne tjenesten istedenfor å oppdatere databasen direkte da ferdigstilt notat blir automatisk arkivert i Joark.
         *
         * @tags admin-controller
         * @name SynkForsendelseDistribusjonStatusForAlle
         * @summary Sjekk status på dokumentene i en enkel forsendelse og oppdater status hvis det er ute av synk
         * @request POST:/api/forsendelse/internal/synkForsendelseDistribusjonStatus
         * @secure
         */
        synkForsendelseDistribusjonStatusForAlle: (params: RequestParams = {}) =>
            this.request<any, void>({
                path: `/api/forsendelse/internal/synkForsendelseDistribusjonStatus`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Sjekk status på dokumentene i en enkel forsendelse og oppdater status hvis det er ute av synk. Dette skal brukes hvis feks en dokument er ferdigstilt i midlertidlig brevlager men status i databasen er fortsatt "under redigering" Denne tjenesten vil sjekke om dokumentet er ferdigstilt og oppdatere status hvis det er det. Bruk denne tjenesten istedenfor å oppdatere databasen direkte da ferdigstilt notat blir automatisk arkivert i Joark.
         *
         * @tags admin-controller
         * @name SynkForsendelseDistribusjonStatus
         * @summary Sjekk status på dokumentene i en enkel forsendelse og oppdater status hvis det er ute av synk
         * @request POST:/api/forsendelse/internal/synkForsendelseDistribusjonStatus/{forsendelseId}
         * @secure
         */
        synkForsendelseDistribusjonStatus: (forsendelseId: string, params: RequestParams = {}) =>
            this.request<any, void>({
                path: `/api/forsendelse/internal/synkForsendelseDistribusjonStatus/${forsendelseId}`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * @description Sjekk status på dokumentene i forsendelse og oppdater status hvis det er ute av synk. Dette skal brukes hvis feks en dokument er ferdigstilt i midlertidlig brevlager men status i databasen er fortsatt "under redigering" Denne tjenesten vil sjekke om dokumentet er ferdigstilt og oppdatere status hvis det er det. Bruk denne tjenesten istedenfor å oppdatere databasen direkte da ferdigstilt notat blir automatisk arkivert i Joark.
         *
         * @tags admin-controller
         * @name SjekkOgOppdaterStatus
         * @summary Sjekk status på dokumentene i forsendelser og oppdater status hvis det er ute av synk
         * @request POST:/api/forsendelse/internal/sjekkOgOppdaterStatus
         * @secure
         */
        sjekkOgOppdaterStatus: (
            query?: {
                /**
                 * @format int32
                 * @default 100
                 */
                limit?: number;
                /**
                 * @format date
                 * @example "2023-11-01"
                 */
                afterDate?: string;
                /**
                 * @format date
                 * @example "2023-12-31"
                 */
                beforeDate?: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<Record<string, string>[], any>({
                path: `/api/forsendelse/internal/sjekkOgOppdaterStatus`,
                method: "POST",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Sjekk status på dokumentene i en enkel forsendelse og oppdater status hvis det er ute av synk. Dette skal brukes hvis feks en dokument er ferdigstilt i midlertidlig brevlager men status i databasen er fortsatt "under redigering" Denne tjenesten vil sjekke om dokumentet er ferdigstilt og oppdatere status hvis det er det. Bruk denne tjenesten istedenfor å oppdatere databasen direkte da ferdigstilt notat blir automatisk arkivert i Joark.
         *
         * @tags admin-controller
         * @name SjekkOgOppdaterStatus1
         * @summary Sjekk status på dokumentene i en enkel forsendelse og oppdater status hvis det er ute av synk
         * @request POST:/api/forsendelse/internal/sjekkOgOppdaterStatus/{forsendelseId}
         * @secure
         */
        sjekkOgOppdaterStatus1: (
            forsendelseId: string,
            query?: {
                /** @default false */
                oppdaterStatus?: boolean;
            },
            params: RequestParams = {}
        ) =>
            this.request<any, Record<string, string>[]>({
                path: `/api/forsendelse/internal/sjekkOgOppdaterStatus/${forsendelseId}`,
                method: "POST",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Resynk distribusjonkanal. Hvis forsendelse er distribuert via nav.no og mottaker ikke har åpnet dokumentet i løpet av 48 timer vil forsendelsen bli redistribuert via sentral print. Denne tjenesten trigger en resynk av alle forsendelser som er sendt via nav.no for å oppdatere til riktig distribusjonstatus. Dette kjøres også som en egen skedulert jobb.
         *
         * @tags admin-controller
         * @name DistTilNavNoMenHarKanalSentralPrint
         * @summary Resynk distribusjonkanal for forsendelser som er distribuert via nav.no
         * @request POST:/api/forsendelse/internal/distribusjon/navno
         * @secure
         */
        distTilNavNoMenHarKanalSentralPrint: (
            query?: {
                /** @default true */
                simulering?: boolean;
                /**
                 * @format date
                 * @example "2023-11-01"
                 */
                afterDate?: string;
                /**
                 * @format date
                 * @example "2023-12-31"
                 */
                beforeDate?: string;
                sjekketNavNoRedistribusjonTilSentralPrint?: boolean;
                /** @format int32 */
                pageSize?: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<Record<string, string>[], any>({
                path: `/api/forsendelse/internal/distribusjon/navno`,
                method: "POST",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Resynk distribusjonkanal. Hvis forsendelse er distribuert via nav.no og mottaker ikke har åpnet dokumentet i løpet av 48 timer vil forsendelsen bli redistribuert via sentral print. Denne tjenesten trigger en resynk av alle forsendelser som er sendt via nav.no for å oppdatere til riktig distribusjonstatus. Dette kjøres også som en egen skedulert jobb.
         *
         * @tags admin-controller
         * @name DistTilNavNoMenHarKanalSentralPrintForForsendelse
         * @summary Resynk distribusjonkanal for forsendelse
         * @request POST:/api/forsendelse/internal/distribusjon/navno/{forsendelseId}
         * @secure
         */
        distTilNavNoMenHarKanalSentralPrintForForsendelse: (
            forsendelseId: number,
            query?: {
                /** @default true */
                simulering?: boolean;
            },
            params: RequestParams = {}
        ) =>
            this.request<Record<string, string>, any>({
                path: `/api/forsendelse/internal/distribusjon/navno/${forsendelseId}`,
                method: "POST",
                query: query,
                secure: true,
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
         * @description Henter dokumentmaler som er støttet av applikasjonen
         *
         * @tags forsendelse-innsyn-kontroller
         * @name HentDokumentValgV2
         * @request POST:/api/forsendelse/dokumentvalgV2
         * @secure
         */
        hentDokumentValgV2: (data: HentDokumentValgRequest, params: RequestParams = {}) =>
            this.request<HentDokumentValgResponse, any>({
                path: `/api/forsendelse/dokumentvalgV2`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Henter dokumentmaler som er støttet av applikasjonen
         *
         * @tags forsendelse-innsyn-kontroller
         * @name HentDokumentValgNotaterGet
         * @request GET:/api/forsendelse/dokumentvalg/notat
         * @deprecated
         * @secure
         */
        hentDokumentValgNotaterGet: (params: RequestParams = {}) =>
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
         * @name HentDokumentValgNotater
         * @request POST:/api/forsendelse/dokumentvalg/notat
         * @secure
         */
        hentDokumentValgNotater: (data: HentDokumentValgRequest, params: RequestParams = {}) =>
            this.request<Record<string, DokumentMalDetaljer>, any>({
                path: `/api/forsendelse/dokumentvalg/notat`,
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
         * No description
         *
         * @tags dokument-kontroller
         * @name HentDokumentForReferanse
         * @summary Hent fysisk dokument som byte
         * @request GET:/api/forsendelse/dokumentreferanse/{dokumentreferanse}
         * @secure
         */
        hentDokumentForReferanse: (dokumentreferanse: string, params: RequestParams = {}) =>
            this.request<string, any>({
                path: `/api/forsendelse/dokumentreferanse/${dokumentreferanse}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags dokument-kontroller
         * @name HentDokumentMetadataForReferanse
         * @summary Hent metadata om dokument
         * @request OPTIONS:/api/forsendelse/dokumentreferanse/{dokumentreferanse}
         * @secure
         */
        hentDokumentMetadataForReferanse: (dokumentreferanse: string, params: RequestParams = {}) =>
            this.request<DokumentMetadata[], any>({
                path: `/api/forsendelse/dokumentreferanse/${dokumentreferanse}`,
                method: "OPTIONS",
                secure: true,
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
                fagomrade?: HentJournalParamsFagomradeEnum[];
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
         * @name HenStorrelsePaDokumenter
         * @summary Hent størrelse på dokumentene i forsendelsen
         * @request GET:/api/forsendelse/journal/distribuer/{forsendelseIdMedPrefix}/size
         * @secure
         */
        henStorrelsePaDokumenter: (forsendelseIdMedPrefix: string, params: RequestParams = {}) =>
            this.request<number, any>({
                path: `/api/forsendelse/journal/distribuer/${forsendelseIdMedPrefix}/size`,
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
            this.request<string, string>({
                path: `/api/forsendelse/journal/distribuer/${forsendelseIdMedPrefix}/enabled`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Hent forsendelser som har ettersending som ikke er oppretttet
         *
         * @tags admin-controller
         * @name ForsendelserEttersendingIkkeOpprettet
         * @summary Sjekk status på dokumentene i forsendelser og oppdater status hvis det er ute av synk
         * @request GET:/api/forsendelse/internal/ettersendingIkkeOpprettet
         * @secure
         */
        forsendelserEttersendingIkkeOpprettet: (params: RequestParams = {}) =>
            this.request<Record<string, string>[], any>({
                path: `/api/forsendelse/internal/ettersendingIkkeOpprettet`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags ettersendingsoppgave-controller
         * @name HentEksisterendeEttersendingsoppgaverForsendelse
         * @summary Hent ettersendingsoppgaver
         * @request GET:/api/forsendelse/ettersendingsoppgave/oppgaver/{forsendelseId}
         * @secure
         */
        hentEksisterendeEttersendingsoppgaverForsendelse: (forsendelseId: string, params: RequestParams = {}) =>
            this.request<Record<string, DokumentSoknadDto[]>, any>({
                path: `/api/forsendelse/ettersendingsoppgave/oppgaver/${forsendelseId}`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * @description Henter dokumentmaler som er støttet av applikasjonen
         *
         * @tags forsendelse-innsyn-kontroller
         * @name HentDokumentValgForForsendelseV2
         * @request GET:/api/forsendelse/dokumentvalg/forsendelseV2/{forsendelseIdMedPrefix}
         * @secure
         */
        hentDokumentValgForForsendelseV2: (forsendelseIdMedPrefix: string, params: RequestParams = {}) =>
            this.request<HentDokumentValgResponse, any>({
                path: `/api/forsendelse/dokumentvalg/forsendelseV2/${forsendelseIdMedPrefix}`,
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

        /**
         * No description
         *
         * @tags ettersendingsoppgave-controller
         * @name SlettEttersendingsoppgaveVedlegg
         * @summary Oppretter ny varsel ettersendelse
         * @request DELETE:/api/forsendelse/ettersendingsoppgave/dokument
         * @secure
         */
        slettEttersendingsoppgaveVedlegg: (data: SlettEttersendingsoppgaveVedleggRequest, params: RequestParams = {}) =>
            this.request<EttersendingsoppgaveDto, EttersendingsoppgaveDto>({
                path: `/api/forsendelse/ettersendingsoppgave/dokument`,
                method: "DELETE",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),
    };
}
