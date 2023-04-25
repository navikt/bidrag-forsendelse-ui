import IdentUtils from "@navikt/bidrag-ui-common/esm/utils/IdentUtils";
import ObjectUtils from "@navikt/bidrag-ui-common/esm/utils/ObjectUtils";
import { useQuery, UseQueryResult } from "react-query";

import { PERSON_API, SAMHANDLER_API } from "../api/api";

type PersonInfo = { ident: string; navn?: string; valid?: boolean };
type IUsePersonApiProps = {
    hentPerson: (ident: string) => UseQueryResult<PersonInfo>;
};

const PersonApiQueryKeys = {
    person: "person",
    hentPerson: (ident: string) => [PersonApiQueryKeys.person, ident],
};
export default function useSamhandlerPersonApi(): IUsePersonApiProps {
    function hentPerson(ident: string) {
        return useQuery({
            queryKey: PersonApiQueryKeys.hentPerson(ident),
            queryFn: async (): Promise<PersonInfo> => {
                if (ObjectUtils.isEmpty(ident)) return { ident, valid: false };
                if (IdentUtils.isSamhandlerId(ident)) {
                    const result = await SAMHANDLER_API.samhandler.hentSamhandler(JSON.stringify(ident));
                    if (result.status != 200) throw Error(`Fant ikke samhandler med ident ${ident}`);
                    return {
                        ident,
                        navn: result.data.navn,
                        valid: true,
                    };
                } else if (IdentUtils.isFnr(ident)) {
                    const result = await PERSON_API.informasjon.hentPersonPost({ ident });
                    if (result.status != 200) throw Error(`Fant ikke person med ident ${ident}`);
                    return {
                        ident,
                        navn: result.data.navn,
                        valid: true,
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
        hentPerson,
    };
}
