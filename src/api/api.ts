import { useApi } from "@navikt/bidrag-ui-common";

import environment from "../environment";
import { Api as BidragDokumentApi } from "./BidragDokumentApi";
import { Api as BidragDokumentArkivApi } from "./BidragDokumentArkivApi";
import { Api as BidragForsendelseApi } from "./BidragForsendelseApi";
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
export const SAK_API = useApi(
    new SakApi({ baseURL: environment.url.bidragSak }),
    "bidrag-sak",
    "fss",
    environment.system.environment
);
export const BIDRAG_DOKUMENT_API = useApi(
    new BidragDokumentApi({ baseURL: environment.url.bidragDokument }),
    "bidrag-dokument",
    "fss"
);
export const BIDRAG_ORGANISASJON_API = useApi(
    new BidragOrganisasjontApi({ baseURL: environment.url.bidragOrganisasjon }),
    "bidrag-organisasjon",
    "fss"
);
export const BIDRAG_FORSENDELSE_API = useApi(
    new BidragForsendelseApi({ baseURL: environment.url.bidragDokumentForsendelse }),
    "bidrag-dokument-forsendelse",
    "gcp"
);

export const BIDRAG_TILGANGSKONTROLL_API = useApi(
    new BidragTilgangskontrollApi({ baseURL: environment.url.bidragTilgangskontroll }),
    "bidrag-tilgangskontroll",
    "gcp"
);

export const BIDRAG_DOKUMENT_ARKIV_API = useApi(
    new BidragDokumentArkivApi({ baseURL: environment.url.bidragDokumentArkiv }),
    "bidrag-dokument-arkiv",
    "fss"
);
