import { Loader } from "@navikt/ds-react";
import React from "react";

import ForsendelseSakHeader from "../forsendelse/components/ForsendelseSakHeader";
import { SessionProvider } from "../forsendelse/context/SessionContext";
import PageWrapper from "../PageWrapper";
import OpprettNotatPage from "./OpprettNotatPage";

interface OpprettNotatProps {
    saksnummer: string;
    sessionId: string;
    enhet: string;
}
export default function ({ saksnummer, sessionId, enhet }: OpprettNotatProps) {
    return (
        <PageWrapper name={"opprett-forsendelse-page"}>
            <SessionProvider saksnummer={saksnummer} sessionId={sessionId} enhet={enhet}>
                <div>
                    <ForsendelseSakHeader />
                    <React.Suspense fallback={<LoadingIndicator />}>
                        <OpprettNotatPage />
                    </React.Suspense>
                </div>
            </SessionProvider>
        </PageWrapper>
    );
}

function LoadingIndicator() {
    return (
        <div className="m-auto w-max flex flex-col justify-center">
            <Loader size={"3xlarge"} title={"Laster..."} className="m-auto" />
        </div>
    );
}
