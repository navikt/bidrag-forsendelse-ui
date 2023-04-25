import { Loader } from "@navikt/ds-react";
import React from "react";

import ForsendelseSakHeader from "../forsendelse/components/ForsendelseSakHeader";
import { SessionProvider } from "../forsendelse/context/SessionContext";
import PageWrapper from "../PageWrapper";
import OpprettForsendelsePage from "./OpprettForsendelsePage";

interface ForsendelsePageProps {
    saksnummer: string;
    sessionId: string;
    enhet: string;
}
export default function ({ saksnummer, sessionId, enhet }: ForsendelsePageProps) {
    return (
        <PageWrapper name={"opprett-forsendelse-page"}>
            <SessionProvider saksnummer={saksnummer} sessionId={sessionId} enhet={enhet}>
                <React.Suspense fallback={<Loader size={"3xlarge"} title={"Laster..."} />}>
                    <div>
                        <ForsendelseSakHeader />
                        <OpprettForsendelsePage />
                    </div>
                </React.Suspense>
            </SessionProvider>
        </PageWrapper>
    );
}
