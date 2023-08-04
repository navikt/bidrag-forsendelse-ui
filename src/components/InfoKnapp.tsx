import { InformationSquareIcon } from "@navikt/aksel-icons";
import { Button, Modal } from "@navikt/ds-react";
import { PropsWithChildren, useState } from "react";
type InfoKnappProps = {
    className?: string;
    title?: string;
};
export default function InfoKnapp({ children, className }: PropsWithChildren<InfoKnappProps>) {
    const [modalOpen, setModalOpen] = useState(false);

    const closeModal = () => {
        setModalOpen(false);
    };
    const openModal = () => setModalOpen(true);
    return (
        <>
            <Button
                title="Brukerveileding for dokumenttabell"
                variant="tertiary"
                size="xsmall"
                icon={<InformationSquareIcon />}
                onClick={openModal}
            ></Button>
            <Modal
                open={modalOpen}
                overlayClassName="test"
                shouldCloseOnEsc
                onClose={closeModal}
                className={`max-w-[900px] ${className}`}
            >
                <Modal.Content>
                    <div className="max-h-[800px]">{children}</div>
                </Modal.Content>
            </Modal>
        </>
    );
}
