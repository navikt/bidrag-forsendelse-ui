import { useSuspenseQuery } from "@tanstack/react-query";

import { BIDRAG_TILGANGSKONTROLL_API } from "../api/api";
import { ContentType } from "../api/BidragTilgangskontrollApi";

export default function useTilgangskontrollApi() {
    function harTilgangTilTemaFar() {
        return useSuspenseQuery({
            queryKey: ["tilgang", "FAR"],
            queryFn: async (): Promise<boolean> => {
                return (
                    await BIDRAG_TILGANGSKONTROLL_API.api.sjekkTilgangTema("FAR", undefined, { type: ContentType.Text })
                ).data;
            },
            retry: 2,
        });
    }

    return {
        harTilgangTilTemaFar,
    };
}
