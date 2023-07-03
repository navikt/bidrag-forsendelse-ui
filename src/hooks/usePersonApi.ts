import IdentUtils from "@navikt/bidrag-ui-common/esm/utils/IdentUtils";
import ObjectUtils from "@navikt/bidrag-ui-common/esm/utils/ObjectUtils";
import { useQuery } from "react-query";

import { PERSON_API, SAMHANDLER_API } from "../api/api";
import { MottakerAdresseTo } from "../api/BidragForsendelseApi";
import { PersonDto } from "../api/BidragPersonApi";

type PersonInfo = { ident: string; navn?: string; valid?: boolean; adresse?: MottakerAdresseTo };

const PersonApiQueryKeys = {
    person: "person",
    hentPerson: (ident: string) => [PersonApiQueryKeys.person, ident],
    hentAktorForIdent: (ident: string) => [PersonApiQueryKeys.person, "aktor", ident],
};
export default function useSamhandlerPersonApi() {
    const hentPerson = (ident?: string): PersonDto => {
        if (!ident) {
            return { ident };
        }
        const { data: personData, refetch } = useQuery({
            queryKey: PersonApiQueryKeys.hentPerson(ident),
            queryFn: ({ signal }) => PERSON_API.informasjon.hentPersonPost({ ident }),
        });

        return personData.data;
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
                        },
                    };
                } else if (IdentUtils.isFnr(ident)) {
                    const result = await PERSON_API.informasjon.hentPersonPost({ ident });
                    const postAdresseResult = await PERSON_API.adresse.hentPersonPostadresse(null, {
                        ident,
                    });
                    if (result.status != 200) throw Error(`Fant ikke person med ident ${ident}`);
                    return {
                        ident,
                        navn: result.data.navn,
                        valid: true,
                        adresse: {
                            adresselinje1: "",
                            ...postAdresseResult.data,
                        },
                    };
                }
                return { ident, valid: false };
            },
            useErrorBoundary: false,
            retry: 2,
            suspense: false,
        });
    }

    return {
        hentSamhandlerEllerPersonForIdent,
        hentPerson,
    };
}
