import { Loader } from "@navikt/ds-react";
import React from "react";

import ForsendelseSakHeader from "../forsendelse/components/ForsendelseSakHeader";
import PageWrapper from "../PageWrapper";
import { IOpprettForsendelseProviderProps, OpprettForsendelseProvider } from "./OpprettForsendelseContext";
import OpprettForsendelsePage from "./OpprettForsendelsePage";

export default function ({ ...otherProps }: IOpprettForsendelseProviderProps) {
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
