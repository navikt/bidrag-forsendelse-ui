import { SecuritySessionUtils } from "@navikt/bidrag-ui-common";
import { useQuery, UseQueryResult } from "react-query";

import { BIDRAG_ORGANISASJON_API } from "../api/api";
import { EnhetDto, JournalforendeEnhetDto } from "../api/BidragOrganisasjontApi";

type UseOrganisasjonApiProps = {
    hentJournalforendeEnheter: () => UseQueryResult<JournalforendeEnhetDto[]>;
    hentSaksbehandlerEnhetListe: () => UseQueryResult<EnhetDto[]>;
};

const OrganisasjonQueryKeys = {
    organisasjon: "organisasjon",
    hentJournalforendeEnheter: () => [OrganisasjonQueryKeys.organisasjon, "hentJournalforendeEnheter"],
    hentSaksbehandlerEnhetliste: () => [OrganisasjonQueryKeys.organisasjon, "hentSaksbehandlerEnhetliste"],
};
export default function useOrganisasjonApi(): UseOrganisasjonApiProps {
    function hentJournalforendeEnheter(): UseQueryResult<JournalforendeEnhetDto[]> {
        return useQuery({
            queryKey: OrganisasjonQueryKeys.hentJournalforendeEnheter(),
            queryFn: () => BIDRAG_ORGANISASJON_API.arbeidsfordeling.hentArbeidsfordelingJournalforendeEnheter(),
        });
    }
    function hentSaksbehandlerEnhetListe(): UseQueryResult<EnhetDto[]> {
        return useQuery({
            queryKey: OrganisasjonQueryKeys.hentSaksbehandlerEnhetliste(),
            queryFn: async () => {
                const saksbehandlerId = await SecuritySessionUtils.hentSaksbehandlerId();
                return BIDRAG_ORGANISASJON_API.saksbehandler.hentSaksbehandlerEnheter(saksbehandlerId);
            },
        });
    }
    return {
        hentJournalforendeEnheter,
        hentSaksbehandlerEnhetListe,
    };
}
