import "./ForsendelsePage.css";

import { Cell, Grid, Heading } from "@navikt/ds-react";
import { Loader } from "@navikt/ds-react";
import { ContentContainer } from "@navikt/ds-react";
import React from "react";
import { PropsWithChildren } from "react";

import DokumenterTable from "../../components/dokument/DokumenterTable";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import PageWrapper from "../PageWrapper";
import ForsendelseSakHeader from "./components/ForsendelseSakHeader";
import Gjelder from "./components/Gjelder";
import Mottaker from "./components/Mottaker";
import { ForsendelseProvider } from "./context/ForsendelseContext";
import { useForsendelse } from "./context/ForsendelseContext";
interface ForsendelsePageProps {
    forsendelseId: string;
    sessionId: string;
    enhet: string;
}
function ForsendelseView() {
    const { forsendelseId } = useForsendelse();
    const { hentForsendelse } = useForsendelseApi();

    const forsendelse = hentForsendelse();
    return (
        <ContentContainer>
            <Grid>
                <Cell xs={4} md={6} lg={8}>
                    <div className={"py-18 leading-xlarge tracking-wide"}>
                        <Heading spacing size={"medium"} className={"w-max"}>
                            Forsendelse nr. {forsendelseId}
                        </Heading>
                        <div className={"w-max"}>
                            <div>
                                <React.Suspense fallback={<Loader size={"large"} title={"Laster..."} />}>
                                    <Gjelder />
                                    <Mottaker />
                                </React.Suspense>
                            </div>
                        </div>
                        <div>
                            <Heading spacing level={"3"} size={"small"} className={"max-w"}>
                                Dokumentliste
                            </Heading>
                            <DokumenterTable dokumenter={forsendelse.dokumenter} forsendelseId={forsendelseId} />
                        </div>
                    </div>
                </Cell>
            </Grid>
        </ContentContainer>
    );
}

export default function ForsendelsePage({ forsendelseId, sessionId, enhet }: PropsWithChildren<ForsendelsePageProps>) {
    return (
        <PageWrapper name={"forsendelse-page"}>
            <ForsendelseProvider forsendelseId={forsendelseId} sessionId={sessionId} enhet={enhet}>
                <React.Suspense fallback={<Loader size={"3xlarge"} title={"Laster..."} />}>
                    <div>
                        <ForsendelseSakHeader />
                        <ForsendelseView />
                    </div>
                </React.Suspense>
            </ForsendelseProvider>
        </PageWrapper>
    );
}
