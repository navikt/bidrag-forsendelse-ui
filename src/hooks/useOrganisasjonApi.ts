import { SecuritySessionUtils } from "@navikt/bidrag-ui-common";
import { useSuspenseQuery, UseSuspenseQueryResult } from "@tanstack/react-query";

import { BIDRAG_ORGANISASJON_API } from "../api/api";
import { EnhetDto, JournalforendeEnhetDto } from "../api/BidragOrganisasjontApi";

type UseOrganisasjonApiProps = {
    hentJournalforendeEnheter: () => UseSuspenseQueryResult<JournalforendeEnhetDto[]>;
    hentSaksbehandlerEnhetListe: () => UseSuspenseQueryResult<EnhetDto[]>;
};

const OrganisasjonQueryKeys = {
    organisasjon: "organisasjon",
    hentJournalforendeEnheter: () => [OrganisasjonQueryKeys.organisasjon, "hentJournalforendeEnheter"],
    hentSaksbehandlerEnhetliste: () => [OrganisasjonQueryKeys.organisasjon, "hentSaksbehandlerEnhetliste"],
};
export default function useOrganisasjonApi(): UseOrganisasjonApiProps {
    function hentJournalforendeEnheter(): UseSuspenseQueryResult<JournalforendeEnhetDto[]> {
        return useSuspenseQuery({
            queryKey: OrganisasjonQueryKeys.hentJournalforendeEnheter(),
            queryFn: () => BIDRAG_ORGANISASJON_API.arbeidsfordeling.hentArbeidsfordelingJournalforendeEnheter(),
        });
    }
    function hentSaksbehandlerEnhetListe(): UseSuspenseQueryResult<EnhetDto[]> {
        return useSuspenseQuery({
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
