import { InformationSquareIcon } from "@navikt/aksel-icons";
import { Button, Modal } from "@navikt/ds-react";
import { PropsWithChildren, ReactElement, useState } from "react";

type InfoKnappProps = {
    component: ReactElement;
};
export default function InfoKnapp({ children }: PropsWithChildren<unknown>) {
    const [modalOpen, setModalOpen] = useState(false);

    const closeModal = () => setModalOpen(false);
    const openModal = () => setModalOpen(true);
    return (
        <>
            <Button variant="tertiary" size="xsmall" icon={<InformationSquareIcon />} onClick={openModal}></Button>
            {modalOpen && (
                <Modal open shouldCloseOnEsc onClose={closeModal} className="max-w-[900px]">
                    <Modal.Content>{children}</Modal.Content>
                </Modal>
            )}
        </>
    );
}
