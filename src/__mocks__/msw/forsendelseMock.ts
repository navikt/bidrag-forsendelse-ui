import { rest, RestHandler } from "msw";

import environment from "../../environment";
import { simpleForsendelse } from "../testdata/forsendelseData";

export default function forsendelseMock(): RestHandler[] {
    const baseUrl = environment.url.bidragDokumentForsendelse;
    return [
        rest.get(`${baseUrl}/api/forsendelse/v2/:forsendelseId`, (req, res, ctx) => {
            return res(
                ctx.set("Content-Type", "application/json"),
                ctx.delay(500),
                // Respond with the "ArrayBuffer".
                ctx.body(JSON.stringify(simpleForsendelse))
            );
        }),
        rest.patch(`${baseUrl}/api/forsendelse/:forsendelseId`, (req, res, ctx) => {
            return res(
                ctx.set("Content-Type", "application/json"),
                ctx.delay(500)
                // Respond with the "ArrayBuffer".
            );
        }),
    ];
}
