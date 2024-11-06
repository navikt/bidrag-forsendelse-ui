import { rest, RestHandler, RestRequest } from "msw";

import environment from "../../environment";
import { journalposterSakMap } from "../testdata/journalpostdata";

export default function dokumentMock(): RestHandler[] {
    const baseUrl = environment.url.bidragDokument;
    return [
        rest.get(`${baseUrl}/sak/:saksnr/journal`, async (req: RestRequest, res, ctx) => {
            const saksnummer = req.params.saksnr as string;
            return res(
                ctx.set("Content-Type", "application/json"),
                ctx.delay(500),
                // Respond with the "ArrayBuffer".
                ctx.body(JSON.stringify(journalposterSakMap.get(saksnummer)))
            );
        }),
        rest.get(`${baseUrl}/journal/:forsendelseId/avvik`, async (req: RestRequest, res, ctx) => {
            return res(
                ctx.set("Content-Type", "application/json"),
                ctx.delay(500),
                ctx.body(JSON.stringify(["FEILFORE_SAK", "SLETT_JOURNALPOST", "ENDRE_FAGOMRADE"]))
            );
        }),
    ];
}
