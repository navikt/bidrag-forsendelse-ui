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
import FlagProvider, { IConfig } from "@unleash/proxy-client-react";
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
import { Engangsbeloptype, SoktAvType, Stonadstype, Vedtakstype } from "./api/BidragForsendelseApi";
import Brukerveiledning from "./docs/Brukerveiledning.mdx";
import { SessionProvider } from "./pages/forsendelse/context/SessionContext";
import ForsendelsePage from "./pages/forsendelse/ForsendelsePage";
import Opprettforsendelse from "./pages/opprettforsendelse";
import Opprettnotat from "./pages/opprettnotat";
import PageWrapper from "./pages/PageWrapper";

const config: IConfig = {
    url: process.env.UNLEASH_API_URL as string,
    clientKey: process.env.UNLEASH_FRONTEND_TOKEN,
    refreshInterval: 15, // How often (in seconds) the client should poll the proxy for updates
    appName: "bidrag-forskudd-ui",
};
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
            <FlagProvider config={config}>
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
            </FlagProvider>
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
                vedtakType={searchParams.get("vedtakType") as Vedtakstype}
                erFattetBeregnet={
                    searchParams.get("erFattetBeregnet") !== undefined
                        ? searchParams.get("erFattetBeregnet") === "true"
                        : null
                }
                erVedtakIkkeTilbakekreving={searchParams.get("erVedtakIkkeTilbakekreving") === "true"}
                soknadId={searchParams.get("soknadId")}
                soknadType={searchParams.get("soknadType")}
                behandlingId={searchParams.get("behandlingId")}
                vedtakId={searchParams.get("vedtakId")}
                soknadFra={searchParams.get("soknadFra") as SoktAvType}
                behandlingType={searchParams.get("behandlingType")}
                engangsBelopType={searchParams.get("engangsbelopType") as Engangsbeloptype}
                stonadType={searchParams.get("stonadType") as Stonadstype}
            />
        </SessionProvider>
    );
}
function OpprettNyForsendelsePageWrapper() {
    const { saksnummer, forsendelseId } = useParams();
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
                vedtakType={searchParams.get("vedtakType") as Vedtakstype}
                erFattetBeregnet={
                    searchParams.get("erFattetBeregnet") !== undefined
                        ? searchParams.get("erFattetBeregnet") === "true"
                        : null
                }
                erVedtakIkkeTilbakekreving={searchParams.get("erVedtakIkkeTilbakekreving") === "true"}
                soknadId={searchParams.get("soknadId")}
                soknadType={searchParams.get("soknadType")}
                behandlingId={searchParams.get("behandlingId")}
                vedtakId={searchParams.get("vedtakId")}
                soknadFra={searchParams.get("soknadFra") as SoktAvType}
                behandlingType={searchParams.get("behandlingType")}
                engangsBelopType={searchParams.get("engangsbelopType") as Engangsbeloptype}
                stonadType={searchParams.get("stonadType") as Stonadstype}
            />
        </SessionProvider>
    );
}
