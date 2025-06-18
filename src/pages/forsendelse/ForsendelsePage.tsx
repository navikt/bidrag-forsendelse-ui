import "./ForsendelsePage.css";

import { Alert, BodyShort, Heading, HGrid, Page, VStack } from "@navikt/ds-react";
import { Loader } from "@navikt/ds-react";
import { useIsMutating } from "@tanstack/react-query";
import React, { Suspense, useEffect } from "react";
import { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";

import DokumenterTable from "../../components/dokument/DokumenterTable";
import ForsendelseDocsButton from "../../components/ForsendelseDocsButton";
import InfoKnapp from "../../components/InfoKnapp";
import SaveStatusIndicator from "../../components/SaveStatusIndicator";
import BidragErrorPanel from "../../context/BidragErrorPanel";
import { useErrorContext } from "../../context/ErrorProvider";
import DokumentTableInfo from "../../docs/DokumentTable.mdx";
import useIsDebugMode from "../../hooks/useDebugMode";
import { useHentForsendelseQuery } from "../../hooks/useForsendelseApi";
import { updateUrlSearchParam } from "../../utils/window-utils";
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
import OpprettEttersendelseOppgaveButton from "./varselettersendelse/OpprettEttersendingsoppgaveButton";
interface ForsendelsePageProps {
    forsendelseId: string;
    saksnummer: string;
    sessionId: string;
    enhet: string;
}
function ForsendelseView() {
    const forsendelse = useHentForsendelseQuery();
    const { navigateToJournalpost } = useSession();
    const isDebug = useIsDebugMode();
    const { errorSource } = useErrorContext();
    const lagrerDokumenter = useIsMutating({ mutationKey: ["oppdaterDokumenterMutation"] });

    useEffect(() => {
        if (["FERDIGSTILT", "DISTRIBUERT", "DISTRIBUERT_LOKALT"].includes(forsendelse.status) && !isDebug) {
            navigateToJournalpost(forsendelse.arkivJournalpostId);
        }
    }, []);

    if (forsendelse.status === "UNDER_OPPRETTELSE") {
        return <OpprettForsendelsePage />;
    }
    return (
        <HGrid>
            <VStack gap={{ xs: "12", md: "12", lg: "10" }}>
                <ForsendelseNotEditableWarning />
                <div className={"leading-xlarge tracking-wide"}>
                    <ForsendelseTittel />
                    <div className={"w-max"}>
                        <VStack gap={{ xs: "12", md: "12", lg: "4" }}>
                            <Gjelder />
                            <Mottaker />
                        </VStack>
                        <VStack gap={{ xs: "12", md: "12", lg: "4" }}>
                            <ForsendelseDetaljer />
                        </VStack>
                    </div>
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
                                    errorSource === "dokumenter" ? "error" : lagrerDokumenter > 0 ? "saving" : "idle"
                                }
                            />
                        </div>

                        <DokumenterTable />
                        <OpprettEttersendelseOppgaveButton />
                    </div>
                    <div className={"mt-10"}>
                        <ValidationErrorSummary />
                        <BidragErrorPanel />

                        <BottomButtons />
                    </div>
                </div>
            </VStack>
        </HGrid>
    );
}

function ForsendelseNotEditableWarning() {
    const forsendelse = useHentForsendelseQuery();

    const erForsendelseUnderProduksjon = forsendelse.status === "UNDER_PRODUKSJON";

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
    const forsendelse = useHentForsendelseQuery();

    const erForsendelseUnderProduksjon = forsendelse.status === "UNDER_PRODUKSJON";

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
    useEffect(() => {
        updateUrlSearchParam("page", `Forsendelse ${forsendelseId}`);
    }, []);
    return (
        <PageWrapper name={"forsendelse-page"}>
            <SessionProvider forsendelseId={forsendelseId} saksnummer={saksnummer} sessionId={sessionId} enhet={enhet}>
                <Page className="forsendelse-page">
                    <ForsendelseSakHeader />
                    <ErrorBoundary
                        fallbackRender={({ error }) => (
                            <Alert className="m-auto w-max" variant="error">
                                {error.message}
                            </Alert>
                        )}
                    >
                        <Suspense fallback={<LoadingIndicator />}>
                            <Page.Block width="xl" gutters className="pt-4">
                                <DokumenterFormProvider forsendelseId={forsendelseId}>
                                    <ForsendelseView />
                                    <ForsendelseDocsButton />
                                </DokumenterFormProvider>
                            </Page.Block>
                        </Suspense>
                    </ErrorBoundary>
                </Page>
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
