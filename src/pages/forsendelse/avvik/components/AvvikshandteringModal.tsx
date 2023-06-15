import "./AvvikshandteringModal.css";

import BisysLink from "@navikt/bidrag-ui-common/esm/react_components/bisys/BisysLink";
import { Left } from "@navikt/ds-icons";
import { Button, Loader, Modal } from "@navikt/ds-react";
import { Heading } from "@navikt/ds-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../../../../api/api";
import { Avvikshendelse } from "../../../../api/BidragForsendelseApi";
import environment from "../../../../environment";
import useTilgangskontrollApi from "../../../../hooks/useTilgangskontrollApi";
import { Avvik, AvvikType } from "../../../../types/AvvikTypes";
import { FAGOMRADE } from "../../../../types/Journalpost";
import { useAvvikModalContext } from "../AvvikshandteringButton";
import { AvvikViewModel, getViewmodelByType } from "../model/AvvikViewModel";
import MainMenu from "./MainMenu";
import StepIndicator from "./StepIndicator";
import { mapToAvvikRequest } from "./types/AvvikTypes";
import EndreFagomradeForsendelse from "./types/EndreFagomradeForsendelse";
import OverforTilAnnenEnhet from "./types/OverforTilAnnenEnhet";
import SlettForsendelse from "./types/SlettForsendelse";

interface AvvikshandteringModalProps {
    initialAvvik?: Avvik;
    initialAvvikType?: AvvikType;
}
export const AvvikMutationKeys = {
    sendAvvik: "sendAvvik",
};
type KanViderebehandleEtterAvvik = boolean;
interface AvvikStateContextProps {
    sendAvvikStatus: "idle" | "error" | "loading";
}
export const useAvvikStateContext = () => useContext(AvvikStateContext);
const AvvikStateContext = React.createContext<AvvikStateContextProps>({} as AvvikStateContextProps);
function AvvikshandteringModal(props: AvvikshandteringModalProps) {
    const { forsendelseId, saksnummer, paloggetEnhet, avvikListe, onCancel } = useAvvikModalContext();
    const harTilgangTilTemaFar = useTilgangskontrollApi().harTilgangTilTemaFar();
    const [selectedAvvik, setSelectedAvvik] = useState<AvvikViewModel | undefined>();
    const [activeStep, setActiveStep] = useState(props.initialAvvik || props.initialAvvikType ? 1 : 0);
    const avvikStateValue = useMemo(() => hentAvvik(), [avvikListe]);

    const sendAvvikFn = useMutation<KanViderebehandleEtterAvvik, void, Avvik>({
        mutationKey: AvvikMutationKeys.sendAvvik,
        mutationFn: async (avvik) => {
            const requestBody: Avvikshendelse = mapToAvvikRequest(avvik, saksnummer);
            await BIDRAG_FORSENDELSE_API.api.utforAvvik(forsendelseId, requestBody, {
                headers: {
                    "X-enhet": paloggetEnhet,
                },
            });
            const harEndretFagomradeTilFarskap =
                avvik.type == AvvikType.ENDRE_FAGOMRADE && avvik.fagomrade == FAGOMRADE.FAR;
            return false;

            // return (
            //     (harTilgangTilTemaFar && harEndretFagomradeTilFarskap) ||
            //     skalKunneViderebehandleJournalpostEtterUtførtAvvik(avvik.type)
            // );
        },
    });

    function hentAvvik(): AvvikViewModel[] {
        return avvikListe.map((avvik) => getViewmodelByType(avvik)).filter((a) => a != undefined);
    }

    useEffect(() => {
        if (props.initialAvvik || props.initialAvvikType) {
            setSelectedAvvik(getAvvikViewModel(props.initialAvvik?.type || props.initialAvvikType));
        }
    }, []);

    const changeStep = (step: number) => {
        if (step === 0) {
            setSelectedAvvik(undefined);
        }
        setActiveStep(step);
    };

    function getAvvikViewModel(avvikType: AvvikType) {
        return avvikStateValue?.find((avvikViewModel) => avvikViewModel.type === avvikType);
    }

    const performSendAvvik = async (avvik: Avvik) => {
        sendAvvikFn.mutate(avvik);
    };

    const shouldBeAbleToReturnToMainPage = () => {
        const isSuccess = sendAvvikFn.isSuccess;
        if (sendAvvikFn.isIdle || !selectedAvvik || !isSuccess) {
            return true;
        }
        return sendAvvikFn.data;
    };

    function skalKunneViderebehandleJournalpostEtterUtførtAvvik(avvik: string) {
        return ![AvvikType.OVERFOR_TIL_ANNEN_ENHET, AvvikType.SLETT_JOURNALPOST].some(
            (avvikType) => avvikType === avvik
        );
    }

    const selectAvvik = (selectedAvvik: AvvikViewModel) => {
        setSelectedAvvik(selectedAvvik);
        setActiveStep(1);
        sendAvvikFn.reset();
    };

    function onPrevious() {
        changeStep(Math.max(activeStep - 1, 0));
    }

    function renderAvvik() {
        if (!selectedAvvik) return <MainMenu avvikViewModels={avvikStateValue} onClick={selectAvvik} />;
        return (
            <>
                <StepIndicator
                    disableAvvikMeny={!shouldBeAbleToReturnToMainPage()}
                    activeStep={activeStep}
                    onChange={changeStep}
                    selectedAvvik={selectedAvvik}
                />
                <Heading level={"3"} size={"medium"} spacing>
                    {selectedAvvik.title}
                </Heading>
                <React.Suspense fallback={<Loader size="small" />}>
                    {activeStep > 0 && sendAvvikFn.isIdle && <PreviousStepButton onPrevious={onPrevious} />}
                    <AvvikStep
                        selectedAvvik={selectedAvvik}
                        activeStep={activeStep}
                        setActiveStep={setActiveStep}
                        sendAvvik={performSendAvvik}
                        {...props}
                    />
                </React.Suspense>
                {!shouldBeAbleToReturnToMainPage() && (
                    <div className="mt-4">
                        <BisysLink bisysUrl={environment.url.bisys} page="sakshistorikk" />
                    </div>
                )}
            </>
        );
    }

    function getSendAvvikStatus() {
        if (sendAvvikFn.isError) return "error";
        if (sendAvvikFn.isLoading) return "loading";
        return "idle";
    }

    return (
        <Modal
            className="min-w-[40rem] max-w-[60rem]"
            open
            onClose={onCancel}
            closeButton={shouldBeAbleToReturnToMainPage()}
            shouldCloseOnOverlayClick={shouldBeAbleToReturnToMainPage()}
        >
            <Modal.Content>
                <AvvikStateContext.Provider value={{ sendAvvikStatus: getSendAvvikStatus() }}>
                    <React.Suspense fallback={<Loader size="medium" />}>
                        <Heading size="large">Avvikshåndtering</Heading>
                        <>{renderAvvik()}</>
                    </React.Suspense>
                </AvvikStateContext.Provider>
            </Modal.Content>
        </Modal>
    );
}

function PreviousStepButton({ onPrevious }: { onPrevious: () => void }) {
    return (
        <div className={"mb-4"}>
            <Button onClick={onPrevious} variant={"tertiary"} size={"small"} icon={<Left />}>
                Forrige steg
            </Button>
        </div>
    );
}

interface AvvikStepProps extends AvvikshandteringModalProps {
    activeStep: number;
    selectedAvvik: AvvikViewModel;
    setActiveStep: (value: number) => void;
    sendAvvik: (avvik: Avvik, ident?: string) => Promise<void>;
}

function AvvikStep(props: AvvikStepProps) {
    const { selectedAvvik } = props;
    switch (selectedAvvik.type) {
        case AvvikType.ENDRE_FAGOMRADE:
            return <EndreFagomradeForsendelse {...props} />;
        case AvvikType.SLETT_JOURNALPOST:
            return <SlettForsendelse {...props} />;
        case AvvikType.OVERFOR_TIL_ANNEN_ENHET:
            return <OverforTilAnnenEnhet {...props} />;
        default:
            return <div>Obs, dette burde ikke skje</div>;
    }
}

export default AvvikshandteringModal;
