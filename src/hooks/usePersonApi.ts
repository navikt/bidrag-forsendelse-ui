import IdentUtils from "@navikt/bidrag-ui-common/esm/utils/IdentUtils";
import ObjectUtils from "@navikt/bidrag-ui-common/esm/utils/ObjectUtils";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { PERSON_API, SAMHANDLER_API } from "../api/api";
import { MottakerAdresseTo } from "../api/BidragForsendelseApi";
import { PersonAdresseDto, PersonDto } from "../api/BidragPersonApi";
import { countryCodeIso3ToIso2 } from "../utils/AdresseUtils";

type PersonInfo = { ident: string; navn?: string; valid?: boolean; adresse?: MottakerAdresseTo };

const PersonApiQueryKeys = {
    person: "person",
    hentPerson: (ident: string) => [PersonApiQueryKeys.person, ident],
    hentAktorForIdent: (ident: string) => [PersonApiQueryKeys.person, "aktor", ident],
};
export default function useSamhandlerPersonApi() {
    const hentPerson = (ident?: string): PersonDto => {
        const { data: personData, refetch } = useSuspenseQuery({
            queryKey: PersonApiQueryKeys.hentPerson(ident),
            queryFn: async () => {
                if (!ident) return { ident, visningsnavn: "" };
                return (await PERSON_API.informasjon.hentPersonPost({ ident }))?.data;
            },
        });

        return personData;
    };

    function hentSamhandlerEllerPersonForIdent(ident: string) {
        return useQuery({
            queryKey: PersonApiQueryKeys.hentAktorForIdent(ident),
            queryFn: async (): Promise<PersonInfo> => {
                if (ObjectUtils.isEmpty(ident)) return { ident, valid: false };
                if (IdentUtils.isSamhandlerId(ident)) {
                    const result = await SAMHANDLER_API.samhandler.hentSamhandler(JSON.stringify(ident));
                    if (result.status != 200) throw Error(`Fant ikke samhandler med ident ${ident}`);
                    return {
                        ident,
                        navn: result.data.navn,
                        valid: true,
                        adresse: {
                            adresselinje1: "",
                            ...result.data.adresse,
                            landkode: result.data.adresse?.land ? countryCodeIso3ToIso2(result.data.adresse.land) : "",
                            landkode3: result.data.adresse?.land,
                        },
                    };
                } else if (IdentUtils.isFnr(ident)) {
                    const result = await PERSON_API.informasjon.hentPersonPost({ ident });
                    const postAdresseResult = await hentPersonAdresse(ident);
                    if (result.status != 200) throw Error(`Fant ikke person med ident ${ident}`);
                    return {
                        ident,
                        navn: result.data.visningsnavn,
                        valid: true,
                        adresse: postAdresseResult
                            ? {
                                  adresselinje1: "",
                                  ...postAdresseResult,
                                  landkode: postAdresseResult.land,
                                  landkode3: postAdresseResult.land3,
                              }
                            : null,
                    };
                }
                return { ident, valid: false };
            },
            throwOnError: false,
            retry: 2,
        });
    }

    async function hentPersonAdresse(ident: string): Promise<PersonAdresseDto | null> {
        const postAdresseResult = await PERSON_API.adresse.hentPersonPostadresse(null, {
            ident,
        });
        if (postAdresseResult.status == 201) return null;
        return postAdresseResult.data;
    }
    return {
        hentSamhandlerEllerPersonForIdent,
        hentPerson,
    };
}
