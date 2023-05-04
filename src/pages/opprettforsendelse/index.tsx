import { Loader } from "@navikt/ds-react";
import React from "react";

import { BEHANDLING_TYPE, SOKNAD_FRA, SOKNAD_TYPE } from "../../hooks/useForsendelseApi";
import ForsendelseSakHeader from "../forsendelse/components/ForsendelseSakHeader";
import { SessionProvider } from "../forsendelse/context/SessionContext";
import PageWrapper from "../PageWrapper";
import { OpprettForsendelseProvider } from "./OpprettForsendelseContext";
import OpprettForsendelsePage from "./OpprettForsendelsePage";

interface ForsendelsePageProps {
    saksnummer: string;
    sessionId: string;
    enhet: string;
    behandlingType: BEHANDLING_TYPE;
    soknadType: SOKNAD_TYPE;
    soknadFra: SOKNAD_FRA;
    klage?: boolean;
    erVedtakFattet?: boolean;
    manuelBeregning?: boolean;
}
export default function ({ saksnummer, sessionId, enhet, ...otherProps }: ForsendelsePageProps) {
    return (
        <PageWrapper name={"opprett-forsendelse-page"}>
            <SessionProvider saksnummer={saksnummer} sessionId={sessionId} enhet={enhet}>
                <OpprettForsendelseProvider {...otherProps}>
                    <React.Suspense fallback={<Loader size={"3xlarge"} title={"Laster..."} />}>
                        <div>
                            <ForsendelseSakHeader />
                            <OpprettForsendelsePage />
                        </div>
                    </React.Suspense>
                </OpprettForsendelseProvider>
            </SessionProvider>
        </PageWrapper>
    );
}
