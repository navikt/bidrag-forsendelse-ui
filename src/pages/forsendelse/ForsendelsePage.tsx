import "./ForsendelsePage.css";

import { Cell, Grid, Heading } from "@navikt/ds-react";
import { Loader } from "@navikt/ds-react";
import { ContentContainer } from "@navikt/ds-react";
import React from "react";
import { PropsWithChildren } from "react";

import DokumenterTable from "../../components/dokument/DokumenterTable";
import InfoKnapp from "../../components/InfoKnapp";
import BidragErrorPanel from "../../context/BidragErrorPanel";
import DokumentTableInfo from "../../docs/DokumentTable.mdx";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import OpprettForsendelsePage from "../opprettforsendelse/OpprettForsendelsePage";
import PageWrapper from "../PageWrapper";
import AvvikshandteringButton from "./avvik/AvvikshandteringButton";
import ForsendelseDetaljer from "./components/ForsendelseDetaljer";
import ForsendelseSakHeader from "./components/ForsendelseSakHeader";
import ForsendelseTittel from "./components/ForsendelseTittel";
import Gjelder from "./components/Gjelder";
import Mottaker from "./components/Mottaker";
import SendButton from "./components/SendButton";
import ValidationErrorSummary from "./components/ValidationErrorSummary";
import { DokumenterFormProvider } from "./context/DokumenterFormContext";
import { SessionProvider } from "./context/SessionContext";
interface ForsendelsePageProps {
    forsendelseId: string;
    saksnummer: string;
    sessionId: string;
    enhet: string;
}
function ForsendelseView() {
    const forsendelse = useForsendelseApi().hentForsendelse();

    if (forsendelse.status == "UNDER_OPPRETTELSE") {
        return <OpprettForsendelsePage />;
    }
    return (
        <ContentContainer>
            <Grid>
                <Cell xs={12} md={12} lg={10}>
                    <div className={"leading-xlarge tracking-wide"}>
                        <ForsendelseTittel />
                        <Grid className={"w-max"}>
                            <Cell xs={12} md={12} lg={10}>
                                <React.Suspense fallback={<Loader size={"large"} title={"Laster..."} />}>
                                    <Gjelder />
                                    <Mottaker />
                                </React.Suspense>
                            </Cell>
                            <Cell xs={12} md={12} lg={4}>
                                <ForsendelseDetaljer />
                            </Cell>
                        </Grid>
                        <div>
                            <Heading level={"3"} size={"medium"} className={"max-w"}>
                                Dokumenter{" "}
                                <InfoKnapp>
                                    <DokumentTableInfo />
                                </InfoKnapp>
                            </Heading>
                            <DokumenterTable />
                        </div>
                        <div className={"mt-10"}>
                            <ValidationErrorSummary />
                            <BidragErrorPanel />

                            <div className={"mt-2 flex flex-row gap-[5px]"}>
                                <SendButton />
                                <AvvikshandteringButton />
                            </div>
                        </div>
                    </div>
                </Cell>
            </Grid>
        </ContentContainer>
    );
}

export default function ForsendelsePage({
    forsendelseId,
    sessionId,
    enhet,
    saksnummer,
}: PropsWithChildren<ForsendelsePageProps>) {
    return (
        <PageWrapper name={"forsendelse-page"}>
            <SessionProvider forsendelseId={forsendelseId} saksnummer={saksnummer} sessionId={sessionId} enhet={enhet}>
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
