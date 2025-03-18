import { StringUtils } from "@navikt/bidrag-ui-common";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { BIDRAG_KODEVERK_API } from "../api/api";
import { KodeverkHierarkiResponse, KodeverkKoderBetydningerResponse } from "../api/BidragKodeverkApi";
import KodeverkService from "../api/KodeverkService";
import { visAndreVedleggskoder, visVedleggskoder } from "../constants/ettersendingConstants";
import { KodeBeskrivelse, LandkodeLand, PostnummerPoststed } from "../types/KodeverkTypes";
export const KodeverkQueryKeys = {
    landkoder: ["landkoder"],
    postnummere: ["postnummere"],
    navskjema: ["navskjema"],
    navBidragSkjema: ["navBidragSkjema"],
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

export const useHentNavSkjemaer = (): KodeBeskrivelse[] => {
    const { data } = useSuspenseQuery({
        queryKey: KodeverkQueryKeys.navskjema,
        queryFn: async () => {
            const response = await BIDRAG_KODEVERK_API.kodeverk.hentKodeverk("NAVSkjema");
            return mapKodeverkResponseToCodeAndName(response.data);
        },
    });

    return data;
};

export const useHentVedleggskoder = (): KodeBeskrivelse[] => {
    const { data } = useSuspenseQuery({
        queryKey: KodeverkQueryKeys.navBidragSkjema,
        queryFn: async () => {
            const response = await BIDRAG_KODEVERK_API.kodeverk.hentKodeverk("Vedleggskoder");
            return [
                ...visAndreVedleggskoder,
                ...mapKodeverkResponseToCodeAndName(response.data).filter((kodeBeskrivelse) =>
                    visVedleggskoder.includes(kodeBeskrivelse.kode)
                ),
            ];
        },
    });

    return data;
};

export const mapHierarkiResponseToCodeAndName = (kodeverk: KodeverkHierarkiResponse): KodeBeskrivelse[] =>
    Object.entries(kodeverk.noder)
        .filter(([kode, _]) => kode === "BID" || kode === "FAR")
        .flatMap(([_, node]) =>
            Object.entries(node.undernoder)
                .filter(([kode, _]) => !kode.startsWith("NAV 00") && !kode.startsWith("NAV 90"))
                .map(([kode, undernode]) => ({
                    kode: kode,
                    beskrivelse: undernode.termer["nb"],
                }))
        );

export const mapKodeverkResponseToCodeAndName = (kodeverk: KodeverkKoderBetydningerResponse): KodeBeskrivelse[] =>
    Object.entries(kodeverk.betydninger).map(([kode, betydning]) => {
        const tekst = StringUtils.isEmpty(betydning[0].beskrivelser["nb"].tekst)
            ? betydning[0].beskrivelser["nb"].term
            : betydning[0].beskrivelser["nb"].tekst;
        return {
            kode,
            beskrivelse: tekst,
        };
    });

export const prefetchPostnummere = (): void => {
    const queryClient = useQueryClient();
    useEffect(() => {
        queryClient.prefetchQuery(postnummereQuery);
    }, []);
};
