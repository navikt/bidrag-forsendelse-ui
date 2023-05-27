import { useQuery } from "react-query";

import { BIDRAG_TILGANGSKONTROLL_API } from "../api/api";

export default function useTilgangskontrollApi() {
    function harTilgangTilTemaFar() {
        return useQuery({
            queryKey: ["tilgang", "FAR"],
            queryFn: async (): Promise<boolean> => {
                return (await BIDRAG_TILGANGSKONTROLL_API.api.sjekkTilgangTema("FAR")).data;
            },
            useErrorBoundary: false,
            retry: 2,
            suspense: true,
        });
    }

    return {
        harTilgangTilTemaFar,
    };
}
