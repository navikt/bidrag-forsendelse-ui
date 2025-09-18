import { useApi } from "@navikt/bidrag-ui-common";

import environment from "../environment";
import { Api as BidragDokumentApi } from "./BidragDokumentApi";
import { Api as BidragDokumentArkivApi } from "./BidragDokumentArkivApi";
import { Api as BidragForsendelseApi } from "./BidragForsendelseApi";
import { Api as BidragKodeverkApi } from "./BidragKodeverkApi";
import { Api as BidragOrganisasjontApi } from "./BidragOrganisasjontApi";
import { Api as PersonApi } from "./BidragPersonApi";
import { Api as SakApi } from "./BidragSakApi";
import { Api as SamhandlerApi } from "./BidragSamhandlerApi";
import { Api as BidragTilgangskontrollApi } from "./BidragTilgangskontrollApi";

export const useSamhandlerApi = () =>
    useApi(new SamhandlerApi({ baseURL: environment.url.bidragSamhandler }), {
        app: "bidrag-samhandler",
        cluster: "gcp",
    });
export const usePersonApi = () =>
    useApi(new PersonApi({ baseURL: environment.url.bidragPerson }), {
        app: "bidrag-person",
        cluster: "fss",
    });
export const useSakApi = () =>
    useApi(new SakApi({ baseURL: environment.url.bidragSak }), {
        app: "bidrag-sak",
        cluster: "fss",
    });
export const useBidragDokumentApi = () =>
    useApi(new BidragDokumentApi({ baseURL: environment.url.bidragDokument }), {
        app: "bidrag-dokument",
        cluster: "fss",
        env: environment.system.legacyEnvironment,
    });
export const useBidragOrganisasjonApi = () =>
    useApi(new BidragOrganisasjontApi({ baseURL: environment.url.bidragOrganisasjon }), {
        app: "bidrag-organisasjon",
        cluster: "fss",
        env: environment.system.legacyEnvironment,
    });
export const useBidragForsendelseApi = () =>
    useApi(new BidragForsendelseApi({ baseURL: environment.url.bidragDokumentForsendelse }), {
        app: "bidrag-dokument-forsendelse",
        cluster: "gcp",
        env: environment.system.legacyEnvironment,
    });

export const useBidragTilgangskontrollApi = () =>
    useApi(new BidragTilgangskontrollApi({ baseURL: environment.url.bidragTilgangskontroll }), {
        app: "bidrag-tilgangskontroll",
        cluster: "gcp",
        env: environment.system.legacyEnvironment,
    });

export const useBidragDokumentArkivApi = () =>
    useApi(new BidragDokumentArkivApi({ baseURL: environment.url.bidragDokumentArkiv }), {
        app: "bidrag-dokument-arkiv",
        cluster: "fss",
        env: environment.system.legacyEnvironment,
    });

export const useBidragKodeverkApi = () =>
    useApi(new BidragKodeverkApi({ baseURL: environment.url.bidragKodeverk }), {
        app: "bidrag-kodeverk",
        cluster: "gcp",
        env: environment.system.legacyEnvironment,
    });
