import "./index.css";

import React from "react";
import { BrowserRouter, Route, Routes, useParams, useSearchParams } from "react-router-dom";

import { initMock } from "./__mocks__/msw";
import { SOKNAD_FRA, VEDTAK_KILDE, VEDTAK_TYPE } from "./hooks/useForsendelseApi";
import { SessionProvider } from "./pages/forsendelse/context/SessionContext";
import ForsendelsePage from "./pages/forsendelse/ForsendelsePage";
import Opprettforsendelse from "./pages/opprettforsendelse";
import Opprettnotat from "./pages/opprettnotat";

// This file is only used for development. The entrypoint is under pages folder
initMock();
export default function App() {
    return (
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/:forsendelseId" element={<ForsendelsePageWrapper />} />
                    <Route path="/forsendelse/:forsendelseId" element={<ForsendelsePageWrapper />} />
                    <Route path="sak/:saksnummer/">
                        <Route path="forsendelse" element={<OpprettNyForsendelsePageWrapper />} />
                        <Route path="notat" element={<OpprettNyNotatPageWrapper />} />
                        <Route path="forsendelse/:forsendelseId" element={<ForsendelsePageWrapper />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
}

function ForsendelsePageWrapper() {
    const { forsendelseId, saksnummer } = useParams();
    const [searchParams, _] = useSearchParams();
    return (
        <ForsendelsePage
            forsendelseId={forsendelseId}
            saksnummer={saksnummer}
            sessionId={searchParams.get("sessionId")}
            enhet={searchParams.get("enhet")}
        />
    );
}
function OpprettNyNotatPageWrapper() {
    const { saksnummer } = useParams();
    const [searchParams, _] = useSearchParams();
    return (
        <Opprettnotat
            saksnummer={saksnummer}
            sessionId={searchParams.get("sessionId")}
            enhet={searchParams.get("enhet")}
        />
    );
}
function OpprettNyForsendelsePageWrapper() {
    const { saksnummer, forsendelseId, enhet } = useParams();
    const [searchParams, _] = useSearchParams();
    return (
        <SessionProvider
            forsendelseId={forsendelseId}
            saksnummer={saksnummer}
            sessionId={searchParams.get("sessionId")}
            enhet={searchParams.get("enhet")}
        >
            <Opprettforsendelse
                vedtakType={searchParams.get("vedtakType") as VEDTAK_TYPE}
                vedtakKilde={searchParams.get("vedtakKilde") as VEDTAK_KILDE}
                soknadFra={searchParams.get("soknadFra") as SOKNAD_FRA}
                behandlingType={searchParams.get("behandlingType")}
                engangsBelopType={searchParams.get("engangsBelopType")}
                stonadType={searchParams.get("stonadType")}
            />
        </SessionProvider>
    );
}
