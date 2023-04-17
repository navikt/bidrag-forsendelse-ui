import "./ForsendelsePage.css";

import { Cell, Grid, Heading } from "@navikt/ds-react";
import { Loader } from "@navikt/ds-react";
import { ContentContainer } from "@navikt/ds-react";
import React from "react";
import { PropsWithChildren } from "react";

import DokumenterTable from "../../components/dokument/DokumenterTable";
import ValidationErrorSummary from "../../components/ValidationErrorSummary";
import PageWrapper from "../PageWrapper";
import ForsendelseSakHeader from "./components/ForsendelseSakHeader";
import Gjelder from "./components/Gjelder";
import Mottaker from "./components/Mottaker";
import SendButton from "./components/SendButton";
import { DokumenterFormProvider } from "./context/DokumenterFormContext";
import { useSession } from "./context/SessionContext";
import { SessionProvider } from "./context/SessionContext";
interface ForsendelsePageProps {
    forsendelseId: string;
    sessionId: string;
    enhet: string;
}
function ForsendelseView() {
    const { forsendelseId } = useSession();

    return (
        <ContentContainer>
            <Grid>
                <Cell xs={12} md={12} lg={10}>
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
                            <DokumenterTable />
                        </div>
                        <div className={"mt-10"}>
                            <ValidationErrorSummary />

                            <div className={"mt-2"}>
                                <SendButton />
                            </div>
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
            <SessionProvider forsendelseId={forsendelseId} sessionId={sessionId} enhet={enhet}>
                <DokumenterFormProvider forsendelseId={forsendelseId}>
                    <React.Suspense fallback={<Loader size={"3xlarge"} title={"Laster..."} />}>
                        <div>
                            <ForsendelseSakHeader />
                            <ForsendelseView />
                        </div>
                    </React.Suspense>
                </DokumenterFormProvider>
            </SessionProvider>
        </PageWrapper>
    );
}
