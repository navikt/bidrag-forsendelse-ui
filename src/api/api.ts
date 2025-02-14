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

export const SAMHANDLER_API = useApi(
    new SamhandlerApi({ baseURL: environment.url.bidragSamhandler }),
    "bidrag-samhandler",
    "gcp"
);
export const PERSON_API = useApi(new PersonApi({ baseURL: environment.url.bidragPerson }), "bidrag-person", "fss");
export const SAK_API = useApi(new SakApi({ baseURL: environment.url.bidragSak }), "bidrag-sak", "fss");
export const BIDRAG_DOKUMENT_API = useApi(
    new BidragDokumentApi({ baseURL: environment.url.bidragDokument }),
    "bidrag-dokument",
    "fss",
    environment.system.legacyEnvironment
);
export const BIDRAG_ORGANISASJON_API = useApi(
    new BidragOrganisasjontApi({ baseURL: environment.url.bidragOrganisasjon }),
    "bidrag-organisasjon",
    "fss",
    environment.system.legacyEnvironment
);
export const BIDRAG_FORSENDELSE_API = useApi(
    new BidragForsendelseApi({ baseURL: environment.url.bidragDokumentForsendelse }),
    "bidrag-dokument-forsendelse",
    "gcp",
    environment.system.legacyEnvironment
);

export const BIDRAG_TILGANGSKONTROLL_API = useApi(
    new BidragTilgangskontrollApi({ baseURL: environment.url.bidragTilgangskontroll }),
    "bidrag-tilgangskontroll",
    "gcp",
    environment.system.legacyEnvironment
);

export const BIDRAG_DOKUMENT_ARKIV_API = useApi(
    new BidragDokumentArkivApi({ baseURL: environment.url.bidragDokumentArkiv }),
    "bidrag-dokument-arkiv",
    "fss",
    environment.system.legacyEnvironment
);

export const BIDRAG_KODEVERK_API = useApi(
    new BidragKodeverkApi({ baseURL: environment.url.bidragKodeverk }),
    "bidrag-kodeverk",
    "gcp"
);
