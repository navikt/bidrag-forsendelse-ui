import { useApi } from "@navikt/bidrag-ui-common";

import environment from "../environment";
import { Api as BidragDokumentApi } from "./BidragDokumentApi";
import { Api as BidragForsendelseApi } from "./BidragForsendelseApi";
import { Api as PersonApi } from "./BidragPersonApi";
import { Api as SakApi } from "./BidragSakApi";

export const PERSON_API = useApi(new PersonApi({ baseURL: environment.url.bidragPerson }), "bidrag-person", "fss");
export const SAK_API = useApi(new SakApi({ baseURL: environment.url.bidragSak }), "bidrag-sak", "fss");
export const BIDRAG_DOKUMENT_API = useApi(
    new BidragDokumentApi({ baseURL: environment.url.bidragDokument }),
    "bidrag-dokument",
    "fss"
);
export const BIDRAG_FORSENDELSE_API = useApi(
    new BidragForsendelseApi({ baseURL: environment.url.bidragDokumentForsendelse }),
    "bidrag-dokument-forsendelse",
    "gcp"
);
