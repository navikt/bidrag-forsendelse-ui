import { Loader } from "@navikt/ds-react";
import React from "react";

import { SOKNAD_FRA, VEDTAK_KILDE, VEDTAK_TYPE } from "../../hooks/useForsendelseApi";
import ForsendelseSakHeader from "../forsendelse/components/ForsendelseSakHeader";
import PageWrapper from "../PageWrapper";
import { OpprettForsendelseProvider } from "./OpprettForsendelseContext";
import OpprettForsendelsePage from "./OpprettForsendelsePage";

interface ForsendelsePageProps {
    vedtakType: VEDTAK_TYPE;
    vedtakKilde: VEDTAK_KILDE;
    engangsBelopType: string;
    behandlingType: string;
    stonadType: string;
    soknadFra: SOKNAD_FRA;
}
export default function ({ ...otherProps }: ForsendelsePageProps) {
    return (
        <PageWrapper name={"opprett-forsendelse-page"}>
            <OpprettForsendelseProvider {...otherProps}>
                <React.Suspense fallback={<Loader size={"3xlarge"} title={"Laster..."} />}>
                    <div>
                        <ForsendelseSakHeader />
                        <OpprettForsendelsePage />
                    </div>
                </React.Suspense>
            </OpprettForsendelseProvider>
        </PageWrapper>
    );
}
