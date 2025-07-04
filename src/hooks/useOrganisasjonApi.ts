import { SecuritySessionUtils } from "@navikt/bidrag-ui-common";
import { useSuspenseQuery, UseSuspenseQueryResult } from "@tanstack/react-query";

import { useBidragOrganisasjonApi } from "../api/api";
import { EnhetDto, JournalforendeEnhetDto } from "../api/BidragOrganisasjontApi";

const OrganisasjonQueryKeys = {
    organisasjon: "organisasjon",
    hentJournalforendeEnheter: () => [OrganisasjonQueryKeys.organisasjon, "hentJournalforendeEnheter"],
    hentSaksbehandlerEnhetliste: () => [OrganisasjonQueryKeys.organisasjon, "hentSaksbehandlerEnhetliste"],
};

export const useHentJournalforendeEnheter = (): UseSuspenseQueryResult<JournalforendeEnhetDto[]> => {
    const bidragOrganisasjonApi = useBidragOrganisasjonApi();
    return useSuspenseQuery({
        queryKey: OrganisasjonQueryKeys.hentJournalforendeEnheter(),
        queryFn: () => bidragOrganisasjonApi.arbeidsfordeling.hentArbeidsfordelingJournalforendeEnheter(),
    });
};

export const useHentSaksbehandlerEnhetListe = (): UseSuspenseQueryResult<EnhetDto[]> => {
    const bidragOrganisasjonApi = useBidragOrganisasjonApi();
    return useSuspenseQuery({
        queryKey: OrganisasjonQueryKeys.hentSaksbehandlerEnhetliste(),
        queryFn: async () => {
            const saksbehandlerId = await SecuritySessionUtils.hentSaksbehandlerId();
            return bidragOrganisasjonApi.saksbehandler.hentSaksbehandlerEnheter(saksbehandlerId);
        },
    });
};
