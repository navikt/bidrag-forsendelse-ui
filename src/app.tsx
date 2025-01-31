import "./index.css";

import {
    createReactRouterV6Options,
    FaroRoutes,
    getWebInstrumentations,
    initializeFaro,
    LogLevel,
    ReactIntegration,
} from "@grafana/faro-react";
import { SecuritySessionUtils } from "@navikt/bidrag-ui-common";
import { HGrid, HStack } from "@navikt/ds-react";
import React from "react";
import {
    BrowserRouter,
    createRoutesFromChildren,
    matchRoutes,
    Route,
    Routes,
    useLocation,
    useNavigationType,
    useParams,
    useSearchParams,
} from "react-router-dom";

import { initMock } from "./__mocks__/msw";
import { EngangsbelopType, SoknadFra, StonadType, VedtakType } from "./api/BidragForsendelseApi";
import Brukerveiledning from "./docs/Brukerveiledning.mdx";
import { SessionProvider } from "./pages/forsendelse/context/SessionContext";
import ForsendelsePage from "./pages/forsendelse/ForsendelsePage";
import Opprettforsendelse from "./pages/opprettforsendelse";
import Opprettnotat from "./pages/opprettnotat";
import PageWrapper from "./pages/PageWrapper";

export const faro = initializeFaro({
    app: {
        name: "bidrag-forsendelse-ui",
    },
    url: process.env.TELEMETRY_URL as string,
    user: {
        username: await SecuritySessionUtils.hentSaksbehandlerId(),
    },
    instrumentations: [
        // Load the default Web instrumentations
        ...getWebInstrumentations({
            captureConsole: true,
            captureConsoleDisabledLevels: [LogLevel.DEBUG, LogLevel.TRACE],
        }),

        new ReactIntegration({
            router: createReactRouterV6Options({
                createRoutesFromChildren,
                matchRoutes,
                Routes,
                useLocation,
                useNavigationType,
            }),
        }),
    ],
});
// This file is only used for development. The entrypoint is under pages folder
initMock();
export default function App() {
    return (
        <React.StrictMode>
            <BrowserRouter>
                <FaroRoutes>
                    <Route path="/forsendelse/brukerveiledning" element={<BrukerveiledningPageWrapper />} />
                    <Route path="/:forsendelseId" element={<ForsendelsePageWrapper />} />
                    <Route path="/forsendelse/:forsendelseId" element={<ForsendelsePageWrapper />} />
                    <Route path="sak/:saksnummer/">
                        <Route path="forsendelse" element={<OpprettNyForsendelsePageWrapper />} />
                        <Route path="notat" element={<OpprettNyNotatPageWrapper />} />
                        <Route path="forsendelse/:forsendelseId" element={<ForsendelsePageWrapper />} />
                    </Route>
                </FaroRoutes>
            </BrowserRouter>
        </React.StrictMode>
    );
}

function BrukerveiledningPageWrapper() {
    return (
        <PageWrapper name="Forsendelse brukerveiledning">
            <HGrid>
                <HStack gap={{ xs: "12", md: "12", lg: "4" }}>
                    <Brukerveiledning saksbehandlerNavn={""} />
                </HStack>
            </HGrid>
        </PageWrapper>
    );
}
function ForsendelsePageWrapper() {
    const { forsendelseId, saksnummer } = useParams();
    const [searchParams, _] = useSearchParams();
    return (
        <ForsendelsePage
            forsendelseId={forsendelseId}
            saksnummer={saksnummer}
            sessionId={searchParams.get("sessionState")}
            enhet={searchParams.get("enhet")}
        />
    );
}
function OpprettNyNotatPageWrapper() {
    const { saksnummer } = useParams();
    const [searchParams, _] = useSearchParams();
    return (
        <SessionProvider
            saksnummer={saksnummer}
            sessionId={searchParams.get("sessionState")}
            enhet={searchParams.get("enhet")}
        >
            <Opprettnotat
                barnObjNr={searchParams.getAll("barn_obj_nr") ?? []}
                vedtakType={searchParams.get("vedtakType") as VedtakType}
                erFattetBeregnet={
                    searchParams.get("erFattetBeregnet") != undefined
                        ? searchParams.get("erFattetBeregnet") == "true"
                        : null
                }
                erVedtakIkkeTilbakekreving={searchParams.get("erVedtakIkkeTilbakekreving") == "true"}
                soknadId={searchParams.get("soknadId")}
                soknadType={searchParams.get("soknadType")}
                behandlingId={searchParams.get("behandlingId")}
                vedtakId={searchParams.get("vedtakId")}
                soknadFra={searchParams.get("soknadFra") as SoknadFra}
                behandlingType={searchParams.get("behandlingType")}
                engangsBelopType={searchParams.get("engangsbelopType") as EngangsbelopType}
                stonadType={searchParams.get("stonadType") as StonadType}
            />
        </SessionProvider>
    );
}
function OpprettNyForsendelsePageWrapper() {
    const { saksnummer, forsendelseId, enhet } = useParams();
    const [searchParams, _] = useSearchParams();
    return (
        <SessionProvider
            forsendelseId={forsendelseId}
            saksnummer={saksnummer}
            sessionId={searchParams.get("sessionState")}
            enhet={searchParams.get("enhet")}
        >
            <Opprettforsendelse
                barnObjNr={searchParams.getAll("barn_obj_nr") ?? []}
                vedtakType={searchParams.get("vedtakType") as VedtakType}
                erFattetBeregnet={
                    searchParams.get("erFattetBeregnet") != undefined
                        ? searchParams.get("erFattetBeregnet") == "true"
                        : null
                }
                erVedtakIkkeTilbakekreving={searchParams.get("erVedtakIkkeTilbakekreving") == "true"}
                soknadId={searchParams.get("soknadId")}
                soknadType={searchParams.get("soknadType")}
                behandlingId={searchParams.get("behandlingId")}
                vedtakId={searchParams.get("vedtakId")}
                soknadFra={searchParams.get("soknadFra") as SoknadFra}
                behandlingType={searchParams.get("behandlingType")}
                engangsBelopType={searchParams.get("engangsbelopType") as EngangsbelopType}
                stonadType={searchParams.get("stonadType") as StonadType}
            />
        </SessionProvider>
    );
}
