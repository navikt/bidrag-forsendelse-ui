import { Heading } from "@navikt/ds-react";
import { Alert } from "@navikt/ds-react";
import { BodyShort } from "@navikt/ds-react";
import { Button } from "@navikt/ds-react";
import { Modal } from "@navikt/ds-react";
import React from "react";
import { useState } from "react";
import { useMutation } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../../../api/api";
import { DistribuerJournalpostRequest } from "../../../api/BidragForsendelseApi";
import { useForsendelseApi } from "../../../hooks/useForsendelseApi";
import { queryClient } from "../../PageWrapper";

interface ManuellUtsendingModalProps {
    onCancel: () => void;
}
export default function ManuellUtsendingModal({ onCancel }: ManuellUtsendingModalProps) {
    const [submitState, setSubmitState] = useState<"pending" | "idle" | "succesfull" | "error">("idle");
    const forsendelse = useForsendelseApi().hentForsendelse();
    const distribuerMutation = useMutation({
        mutationFn: () => {
            const request: DistribuerJournalpostRequest = {
                lokalUtskrift: true,
            };
            return BIDRAG_FORSENDELSE_API.api.distribuerForsendelse(forsendelse.forsendelseId, request);
        },
        onSuccess: () => {
            queryClient.invalidateQueries("forsendelse");
            setSubmitState("succesfull");
            // RedirectT o.sakshistorikk(saksnummer);
        },
        onError: (error, variables, context) => {
            setSubmitState("error");
        },
    });
    function onSubmit() {
        setSubmitState("pending");
        distribuerMutation.mutate();
    }

    function renderErrorMessage() {
        return (
            <Alert variant="error">
                <BodyShort>Det skjedde en feil. Vennligst prøv på nytt.</BodyShort>
            </Alert>
        );
    }

    return (
        <Modal
            onClose={onCancel}
            open
            closeButton={submitState !== "succesfull"}
            shouldCloseOnOverlayClick={submitState !== "succesfull"}
        >
            <Modal.Content>
                <div>
                    <Heading size={"large"}>Har du sendt forsendelsen lokalt?</Heading>
                    {submitState === "error" && renderErrorMessage()}
                    <div className={"min-w-[35rem] relative  w-full max-w-2xl h-full md:h-auto"}>
                        <div className={"py-4"}>
                            <BodyShort>
                                Jeg bekrefter at jeg har printet og sendt ut alle dokumenter i forsendelsen
                            </BodyShort>
                        </div>
                    </div>
                </div>
                <div className="flex items-center p-2 space-x-2 ">
                    <Button variant={"primary"} onClick={onSubmit} loading={submitState === "pending"}>
                        Bekreft og gå tilbake til sakshistorikk
                    </Button>
                    <Button variant={"tertiary"} disabled={submitState === "pending"} onClick={onCancel}>
                        Avbryt
                    </Button>
                </div>
            </Modal.Content>
        </Modal>
    );
}
