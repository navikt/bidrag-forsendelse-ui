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

export interface KodeverkBeskrivelse {
    tekst: string;
    term: string;
}

export interface KodeverkBetydning {
    /** @format date */
    gyldigFra: string;
    /** @format date */
    gyldigTil: string;
    beskrivelser: Record<string, KodeverkBeskrivelse>;
}

export interface KodeverkKoderBetydningerResponse {
    betydninger: Record<string, KodeverkBetydning[]>;
}

export interface Hierarkinode {
    kode?: string;
    termer: Record<string, string>;
    undernoder: Record<string, Hierarkinode>;
}

export interface KodeverkHierarkiResponse {
    hierarkinivaaer: string[];
    noder: Record<string, Hierarkinode>;
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
        this.instance = axios.create({
            ...axiosConfig,
            baseURL: axiosConfig.baseURL || "https://bidrag-kodeverk.intern.dev.nav.no",
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
 * @title OpenAPI definition
 * @version v0
 * @baseUrl https://bidrag-kodeverk.intern.dev.nav.no
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    kodeverk = {
        /**
         * @description Henter kodeverk (proxy)
         *
         * @tags kodeverk-controller
         * @name HentKodeverk
         * @request GET:/kodeverk/{kodeverk}
         * @secure
         */
        hentKodeverk: (kodeverk: string, params: RequestParams = {}) =>
            this.request<KodeverkKoderBetydningerResponse, any>({
                path: `/kodeverk/${kodeverk}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),
    };
    internal = {
        /**
         * No description
         *
         * @tags kodeverk-controller
         * @name Health
         * @request GET:/internal/health/readiness
         */
        health: (params: RequestParams = {}) =>
            this.request<string, any>({
                path: `/internal/health/readiness`,
                method: "GET",
                format: "json",
                ...params,
            }),
    };
    hierarki = {
        /**
         * @description Henter kodeverk hierarki (proxy)
         *
         * @tags kodeverk-controller
         * @name HentKodeverkHierarki
         * @request GET:/hierarki/{kodeverk}
         * @secure
         */
        hentKodeverkHierarki: (kodeverk: string, params: RequestParams = {}) =>
            this.request<KodeverkHierarkiResponse, any>({
                path: `/hierarki/${kodeverk}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),
    };
}
