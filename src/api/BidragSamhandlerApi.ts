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

/** Representerer navn og/eller adresse for en samhandler. */
export interface AdresseDto {
    /** Første adresselinje inneholder normalt gatenavn, men kan også innehold f.eks c/o. */
    adresselinje1?: string;
    /** Andre adresselinje brukes primært i utlandsadresser, hvor postnr og poststed ikke er tilgjengelig som strukturerte data. */
    adresselinje2?: string;
    /** Tredje adresselinje brukes i noen tilfeller til region. */
    adresselinje3?: string;
    /** Postnr dersom dette er tilgjengelig som strukturerte data. */
    postnr?: string;
    /** Poststed dersom dette er tilgjengelig som strukturerte data. */
    poststed?: string;
    /** Land. ISO 3166-1 alfa-3. */
    land?: string;
}

/** Representerer kontonummer for en samhandler. For norske kontonummer er det kun norskKontornr som er utfyllt, ellers benyttes de andre feltene for utlandske kontonummer. */
export interface KontonummerDto {
    /** Norsk kontonummer, 11 siffer. */
    norskKontonummer?: string;
    /** IBAN angir kontonummeret på et internasjonalt format. */
    iban?: string;
    /** SWIFT angir banken på et internasjonalt format. */
    swift?: string;
    /** Bankens navn. */
    banknavn?: string;
    /** Bankens landkode. ISO 3166-1 alfa-3. */
    landkodeBank?: string;
    /** BankCode. Format varierer. */
    bankCode?: string;
    /** Kontoens valuta. */
    valutakode?: string;
}

export interface SamhandlerDto {
    tssId: string;
    /** Navn på samhandler */
    navn?: string;
    /** Offentlig id for samhandlere. */
    offentligId?: string;
    /** Type offentlig id. F.eks ORG for norske organisasjonsnummere. */
    offentligIdType?: string;
    /** Representerer navn og/eller adresse for en samhandler. */
    adresse?: AdresseDto;
    /** Representerer kontonummer for en samhandler. For norske kontonummer er det kun norskKontornr som er utfyllt, ellers benyttes de andre feltene for utlandske kontonummer. */
    kontonummer?: KontonummerDto;
}

/** Query-felter for søk etter samhandlere. */
export interface SokSamhandlerQuery {
    navn: string;
    postnummer?: string;
    område?: string;
    /**
     * Sidenummer med resultater man ønsker, hvis det finnes og man ønsker påfølgende resultater.
     * @format int32
     */
    side: number;
}

/** Søkeresultat etter søk på samhandler. */
export interface SamhandlersokeresultatDto {
    samhandlere: SamhandlerDto[];
    /** True hvis det finnes flere forekomster enn det som er returnert i dette objektet. */
    flereForekomster: boolean;
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
        this.instance = axios.create({
            ...axiosConfig,
            baseURL: axiosConfig.baseURL || "https://bidrag-samhandler-feature.dev.intern.nav.no",
        });
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
 * @title bidrag-samhandler
 * @version v1
 * @baseUrl https://bidrag-samhandler-feature.dev.intern.nav.no
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    samhandler = {
        /**
         * @description Søker etter samhandlere basert på navn, område og postnummer
         *
         * @tags samhandler-controller
         * @name SokSamhandler
         * @request GET:/samhandler
         * @secure
         */
        sokSamhandler: (
            query: {
                /** Query-felter for søk etter samhandlere. */
                søkSamhandlerQuery: SokSamhandlerQuery;
            },
            params: RequestParams = {}
        ) =>
            this.request<SamhandlersokeresultatDto, any>({
                path: `/samhandler`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * @description Henter samhandler for ident
         *
         * @tags samhandler-controller
         * @name HentSamhandler
         * @request POST:/samhandler
         * @secure
         */
        hentSamhandler: (data: string, params: RequestParams = {}) =>
            this.request<SamhandlerDto, any>({
                path: `/samhandler`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),
    };
}
