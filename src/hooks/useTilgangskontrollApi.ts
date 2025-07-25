import { useSuspenseQuery } from "@tanstack/react-query";

import { useBidragTilgangskontrollApi } from "../api/api";
import { ContentType } from "../api/BidragTilgangskontrollApi";

export default function useHarTilgangTilTemaFar() {
    const bidragTilgangskontrollApi = useBidragTilgangskontrollApi();
    return useSuspenseQuery({
        queryKey: ["tilgang", "FAR"],
        queryFn: async (): Promise<boolean> => {
            return (await bidragTilgangskontrollApi.api.sjekkTilgangTema("FAR", undefined, { type: ContentType.Text }))
                .data;
        },
        retry: 2,
    });
}
