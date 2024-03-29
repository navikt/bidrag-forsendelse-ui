import "./ForsendelsePage.css";

import { Alert, BodyShort, Cell, Grid, Heading, Skeleton } from "@navikt/ds-react";
import { Loader } from "@navikt/ds-react";
import { ContentContainer } from "@navikt/ds-react";
import { useIsMutating } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { PropsWithChildren } from "react";

import DokumenterTable from "../../components/dokument/DokumenterTable";
import ForsendelseDocsButton from "../../components/ForsendelseDocsButton";
import InfoKnapp from "../../components/InfoKnapp";
import SaveStatusIndicator from "../../components/SaveStatusIndicator";
import BidragErrorPanel from "../../context/BidragErrorPanel";
import { useErrorContext } from "../../context/ErrorProvider";
import DokumentTableInfo from "../../docs/DokumentTable.mdx";
import useIsDebugMode from "../../hooks/useDebugMode";
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
import { SessionProvider, useSession } from "./context/SessionContext";
interface ForsendelsePageProps {
    forsendelseId: string;
    saksnummer: string;
    sessionId: string;
    enhet: string;
}
function ForsendelseView() {
    const forsendelse = useForsendelseApi().hentForsendelse();
    const { navigateToJournalpost } = useSession();
    const isDebug = useIsDebugMode();
    const { errorSource, errorMessage } = useErrorContext();
    const lagrerDokumenter = useIsMutating("oppdaterDokumenterMutation");

    useEffect(() => {
        if (["FERDIGSTILT", "DISTRIBUERT", "DISTRIBUERT_LOKALT"].includes(forsendelse.status) && !isDebug) {
            navigateToJournalpost(forsendelse.arkivJournalpostId);
        }
    }, []);

    if (errorSource == "hentforsendelse") {
        return (
            <Alert className="m-auto w-max" variant="error">
                {errorMessage}
            </Alert>
        );
    }

    if (forsendelse.status == "UNDER_OPPRETTELSE") {
        return <OpprettForsendelsePage />;
    }
    return (
        <ContentContainer>
            <Grid>
                <Cell xs={12} md={12} lg={10}>
                    <ForsendelseNotEditableWarning />
                    <div className={"leading-xlarge tracking-wide"}>
                        <ForsendelseTittel />
                        <Grid className={"w-max"}>
                            <Cell xs={12} md={12} lg={10}>
                                <Gjelder />
                                <Mottaker />
                            </Cell>
                            <Cell xs={12} md={12} lg={4}>
                                <ForsendelseDetaljer />
                            </Cell>
                        </Grid>
                        <div>
                            <div className="flex flex-row gap-[2px]">
                                <Heading level={"3"} size={"medium"} className={"max-w"}>
                                    Dokumenter
                                </Heading>
                                <InfoKnapp>
                                    <DokumentTableInfo />
                                </InfoKnapp>
                                <SaveStatusIndicator
                                    state={
                                        errorSource == "dokumenter" ? "error" : lagrerDokumenter > 0 ? "saving" : "idle"
                                    }
                                />
                            </div>

                            <DokumenterTable />
                        </div>
                        <div className={"mt-10"}>
                            <ValidationErrorSummary />
                            <BidragErrorPanel />

                            <BottomButtons />
                        </div>
                    </div>
                </Cell>
            </Grid>
        </ContentContainer>
    );
}

function ForsendelseNotEditableWarning() {
    const forsendelse = useForsendelseApi().hentForsendelse();

    const erForsendelseUnderProduksjon = forsendelse.status == "UNDER_PRODUKSJON";

    function renderForsendelseState() {
        switch (forsendelse.status) {
            case "FERDIGSTILT":
                return "ferdigstilt";
            case "SLETTET":
                return "slettet";
            case "DISTRIBUERT":
            case "DISTRIBUERT_LOKALT":
                return "distribuert";
            default:
                return forsendelse.status;
        }
    }

    if (erForsendelseUnderProduksjon) return null;

    return (
        <Alert variant="warning" size="small" className="mb-2">
            <BodyShort>{`Forsendelsen har status ${renderForsendelseState()} og kan derfor ikke endres.`}</BodyShort>
        </Alert>
    );
}

function BottomButtons() {
    const forsendelse = useForsendelseApi().hentForsendelse();

    const erForsendelseUnderProduksjon = forsendelse.status == "UNDER_PRODUKSJON";

    if (!erForsendelseUnderProduksjon) return null;
    return (
        <div className={"mt-2 flex flex-row gap-[5px]"}>
            <SendButton />
            <AvvikshandteringButton />
        </div>
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
                <div>
                    <ForsendelseSakHeader />
                    <React.Suspense fallback={<LoadingIndicator />}>
                        <DokumenterFormProvider forsendelseId={forsendelseId}>
                            <ForsendelseView />
                            <ForsendelseDocsButton />
                        </DokumenterFormProvider>
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
            <BodyShort>Laster forsendelse...</BodyShort>
        </div>
    );
}

function LoadingIndicatorSkeleton() {
    return (
        <ContentContainer>
            <Grid>
                <Cell xs={12} md={12} lg={10}>
                    <div className="flex flex-col gap-[20px]">
                        <Skeleton variant="rectangle" width="70%" height="50px" />

                        <Skeleton variant="rectangle" width="70%" height="270px" />
                        <Skeleton variant="rectangle" width="100%" height="317px" />
                        {/* 'as'-prop kan brukes på all typografien vår med Skeleton */}
                        <Skeleton variant="rectangle" width="50%" height="50px" />
                    </div>
                </Cell>
            </Grid>
        </ContentContainer>
    );
}
