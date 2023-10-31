import { useQuery } from "react-query";

import { PostnummerPoststed } from "../types/KodeverkTypes";
import { LandkodeLand } from "../types/KodeverkTypes";
import KodeverkService from "./KodeverkService";

export const QueryKeys = {
    avvik: "avvik",
    sak: "sak",
    forsendelse: "forsendelse",
    person: "person",
    avvik_forsendelse: (forsendelseId: string) => [QueryKeys.avvik, forsendelseId],
    landkoder: ["landkoder"],
    postnummere: ["postnummere"],
    hentSak: (saksnummer: string) => [QueryKeys.sak, saksnummer],
    sakerPerson: (personident: string) => [QueryKeys.sak, QueryKeys.person, personident],
    hentJournalposterForPerson: (personident: string) => [QueryKeys.person, QueryKeys.forsendelse, personident],
};

export const hentLandkoder = (): LandkodeLand[] => {
    const { data: landkoder } = useQuery({
        queryKey: QueryKeys.landkoder,
        queryFn: ({ signal }) => new KodeverkService().getLandkoder(),
    });

    return landkoder;
};

export const hentPostnummere = (): PostnummerPoststed[] => {
    const { data: postnummere } = useQuery({
        queryKey: QueryKeys.postnummere,
        queryFn: ({ signal }) => new KodeverkService().getPostnummere(),
    });

    return postnummere;
};
