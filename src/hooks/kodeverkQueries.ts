import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import KodeverkService from "../api/KodeverkService";
import { LandkodeLand, PostnummerPoststed } from "../types/KodeverkTypes";
export const KodeverkQueryKeys = {
    landkoder: ["landkoder"],
    postnummere: ["postnummere"],
};

const postnummereQuery = {
    queryKey: KodeverkQueryKeys.postnummere,
    queryFn: () => new KodeverkService().getPostnummere(),
};

export const hentLandkoder = (): LandkodeLand[] => {
    const { data: landkoder } = useSuspenseQuery({
        queryKey: KodeverkQueryKeys.landkoder,
        queryFn: () => new KodeverkService().getLandkoder(),
    });

    return landkoder;
};

export const hentPostnummere = (): PostnummerPoststed[] => {
    const { data: postnummere } = useSuspenseQuery(postnummereQuery);

    return postnummere;
};

export const prefetchPostnummere = (): void => {
    const queryClient = useQueryClient();
    useEffect(() => {
        queryClient.prefetchQuery(postnummereQuery);
    }, []);
};
