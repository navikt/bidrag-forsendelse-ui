import { rest, RestHandler, RestRequest } from "msw";

import environment from "../../environment";
import { sakMap } from "../testdata/sakData";
import {sakerPersonMap} from "../testdata/sakData";

export default function sakMock(): RestHandler[] {
    const baseUrl = environment.url.bidragSak;
    return [
        rest.get(`${baseUrl}/bidrag-sak/sak/:sakId`, async (req: RestRequest, res, ctx) => {
            const saksnummer = req.params.sakId as string;
            console.log("SDasdasd", saksnummer);
            return res(
                ctx.set("Content-Type", "application/json"),
                ctx.delay(500),
                // Respond with the "ArrayBuffer".
                ctx.body(JSON.stringify(sakMap.get(saksnummer)))
            );
        }),

        rest.post(`${baseUrl}/bidrag-sak/person/sak/:fnr`, async (req: RestRequest, res, ctx) => {
            const fnr = req.params.fnr as string;
            console.log("Hent saker for", fnr);
            return res(
                ctx.set("Content-Type", "application/json"),
                ctx.delay(500),
                // Respond with the "ArrayBuffer".
                ctx.body(JSON.stringify(sakerPersonMap.get(fnr)))
            );
        }),
    ];
}
