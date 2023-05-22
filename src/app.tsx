import "./index.css";

import React from "react";
import { BrowserRouter, Route, Routes, useParams, useSearchParams } from "react-router-dom";

import { initMock } from "./__mocks__/msw";
import { BEHANDLING_TYPE, SOKNAD_FRA, SOKNAD_TYPE } from "./hooks/useForsendelseApi";
import ForsendelsePage from "./pages/forsendelse/ForsendelsePage";
import Opprettforsendelse from "./pages/opprettforsendelse";

// This file is only used for development. The entrypoint is under pages folder
initMock();
export default function App() {
    return (
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/:forsendelseId" element={<ForsendelsePageWrapper />} />
                    <Route path="/forsendelse/:forsendelseId" element={<ForsendelsePageWrapper />} />
                    <Route path="sak/:saksnummer/forsendelse/" element={<OpprettNyForsendelsePageWrapper />} />
                    <Route path="/sak/:saksnummer/forsendelse/:forsendelseId" element={<ForsendelsePageWrapper />} />
                    <Route path="/" element={<div>Hello world</div>} />
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

function OpprettNyForsendelsePageWrapper() {
    const { saksnummer } = useParams();
    const [searchParams, _] = useSearchParams();
    return (
        <Opprettforsendelse
            saksnummer={saksnummer}
            sessionId={searchParams.get("sessionId")}
            enhet={searchParams.get("enhet")}
            behandlingType={searchParams.get("behandlingType") as BEHANDLING_TYPE}
            soknadType={searchParams.get("soknadType") as SOKNAD_TYPE}
            soknadFra={searchParams.get("soknadFra") as SOKNAD_FRA}
            erVedtakFattet={searchParams.get("erVedtakFattet") == "true"}
            manuelBeregning={searchParams.get("soknadmanuelBeregningFra") == "true"}
            klage={searchParams.get("soknadFra") == "true"}
        />
    );
}
