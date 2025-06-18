import { http, HttpHandler, HttpResponse } from "msw";

import environment from "../../environment";
import { personMap } from "../testdata/personData";
import { withDelay } from "./dokumentMock";

type InformasjonRequestBody = {
    ident: string;
};

type ResponseBody = string;

export default function personMock(): HttpHandler[] {
    const baseUrl = environment.url.bidragPerson;
    return [
        http.post<never, InformasjonRequestBody, ResponseBody>(
            `${baseUrl}/informasjon`,
            withDelay(500, async ({ request }) => {
                const personIdent = await request.json();
                return HttpResponse.json(JSON.stringify(personMap.get(personIdent.ident)));
            })
        ),
        http.post<never, never, ResponseBody>(
            `${environment.url.bidragTilgangskontroll}/api/tilgang/tema`,
            async () => {
                return HttpResponse.json("true");
            }
        ),
    ];
}
