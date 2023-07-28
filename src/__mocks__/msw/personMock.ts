import { rest, RestHandler, RestRequest } from "msw";

import { PersonRequest } from "../../api/BidragPersonApi";
import environment from "../../environment";
import { personMap } from "../testdata/personData";

export default function personMock(): RestHandler[] {
    const baseUrl = environment.url.bidragPerson;
    return [
        rest.post(`${baseUrl}/informasjon`, async (req: RestRequest<PersonRequest>, res, ctx) => {
            const personIdent = (await req.json()).ident;
            return res(
                ctx.set("Content-Type", "application/json"),
                ctx.delay(500),
                // Respond with the "ArrayBuffer".
                ctx.body(JSON.stringify(personMap.get(personIdent)))
            );
        }),
        rest.post(
            `${environment.url.bidragTilgangskontroll}/api/tilgang/tema`,
            async (req: RestRequest<PersonRequest>, res, ctx) => {
                const personIdent = (await req.json()).ident;
                return res(
                    // Respond with the "ArrayBuffer".
                    ctx.body("true")
                );
            }
        ),
    ];
}
