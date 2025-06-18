import { DefaultBodyType, delay, http, HttpHandler, HttpResponse, HttpResponseResolver, PathParams } from "msw";

import environment from "../../environment";
import { journalposterSakMap } from "../testdata/journalpostdata";

export function withDelay<
    Params extends PathParams,
    RequestBodyType extends DefaultBodyType,
    ResponseBodyType extends DefaultBodyType,
>(
    durationMs: number,
    resolver: HttpResponseResolver<Params, RequestBodyType, ResponseBodyType>
): HttpResponseResolver<Params, RequestBodyType, ResponseBodyType> {
    return async (...args) => {
        await delay(durationMs);
        return resolver(...args);
    };
}

export default function dokumentMock(): HttpHandler[] {
    const baseUrl = environment.url.bidragDokument;
    return [
        http.get(
            `${baseUrl}/sak/:saksnr/journal`,
            withDelay(500, ({ params }) => {
                const { saksnr: saksnummer } = params;
                return HttpResponse.json(JSON.stringify(journalposterSakMap.get(saksnummer as string)));
            })
        ),
        http.get(
            `${baseUrl}/journal/:forsendelseId/avvik`,
            withDelay(500, () => {
                return HttpResponse.json(JSON.stringify(["FEILFORE_SAK", "SLETT_JOURNALPOST", "ENDRE_FAGOMRADE"]));
            })
        ),
    ];
}
