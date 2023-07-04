import "./LeggTilDokumentButton.css";

import { Add } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import { Modal } from "@navikt/ds-react";
import { Loader } from "@navikt/ds-react";
import { Heading } from "@navikt/ds-react";
import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useDokumenterForm } from "../../pages/forsendelse/context/DokumenterFormContext";
import { IDokument } from "../../types/Dokument";
import DokumentValgForsendelse from "./DokumentValgForsendelse";

export default function LeggTilFraMalKnapp() {
    const { addDocuments, saveChanges } = useDokumenterForm();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setModalOpen(true)} variant={"tertiary"} size={"small"} icon={<Add />}>
                Legg til fra mal
            </Button>
            <LeggTilDokumentFraMalModal
                open={modalOpen}
                onClose={(selectedDocuments) => {
                    selectedDocuments && addDocuments([selectedDocuments]);
                    saveChanges();
                    setModalOpen(false);
                }}
            />
        </div>
    );
}

interface LeggTilDokumentFraSakModalProps {
    onClose: (selectedDocument?: IDokument) => void;
    open: boolean;
}

interface OpprettDokumentFraMalFormProps {
    dokument: {
        malId: string;
        tittel: string;
        type: "UTGÅENDE" | "NOTAT";
    };
}
function LeggTilDokumentFraMalModal({ onClose, open }: LeggTilDokumentFraSakModalProps) {
    const methods = useForm<OpprettDokumentFraMalFormProps>();

    function onSubmit(data: OpprettDokumentFraMalFormProps) {
        console.log(data);
        if (data.dokument) {
            onClose({
                dokumentmalId: data.dokument.malId,
                tittel: data.dokument.tittel,
                index: -1,
                lagret: false,
            });
        }
    }
    useEffect(() => {
        Modal.setAppElement("#forsendelse-page");
    }, []);

    return (
        <FormProvider {...methods}>
            <Modal open={open} onClose={() => onClose()}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <Modal.Content
                        style={{
                            minWidth: "max-content",
                            minHeight: "max-content",
                            padding: "3rem 2rem 1rem 2rem",
                            overflowY: "auto",
                        }}
                    >
                        <Heading spacing level="1" size="large" id="modal-heading">
                            Legg til dokument fra mal
                        </Heading>
                        <React.Suspense fallback={<Loader size={"medium"} />}>
                            <DokumentValgForsendelse showLegend={false} />
                        </React.Suspense>
                    </Modal.Content>
                    <Modal.Content>
                        <div className={"ml-2 flex flex-row gap-2 items-end bottom-2"}>
                            <Button size="small" type="submit">
                                Legg til
                            </Button>
                            <Button size="small" variant={"tertiary"} onClick={() => onClose()}>
                                Avbryt
                            </Button>
                        </div>
                    </Modal.Content>
                </form>
            </Modal>
        </FormProvider>
    );
}
