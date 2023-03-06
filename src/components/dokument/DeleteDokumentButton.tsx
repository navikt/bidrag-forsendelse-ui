import { Delete } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import { Modal } from "@navikt/ds-react";
import { Heading } from "@navikt/ds-react";
import { BodyLong } from "@navikt/ds-react";
import { useState } from "react";
import React from "react";

import { Dokument } from "../../types/forsendelseInternal";

interface IDeleteDokumentButtonProps {
    forsendelseId: string;
    dokument: Dokument;
}
export default function DeleteDokumentButton({ dokument, forsendelseId }: IDeleteDokumentButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button size={"small"} variant={"tertiary"} icon={<Delete />} onClick={() => setIsModalOpen(true)} />
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Modal.Content>
                    <Heading spacing level="1" size="medium" id="modal-heading">
                        Er du sikker på at du vil fjerne dokument fra forsendelse?
                    </Heading>
                    <BodyLong spacing>
                        Hvis du fjerner dokument fra forsendelse vil du miste eventuell arbeid utført ved redigering
                    </BodyLong>
                    <div className={"flex flex-row gap-2"}>
                        <Button onClick={() => setIsModalOpen(false)} variant="primary">
                            Fjern
                        </Button>
                        <Button onClick={() => setIsModalOpen(false)} variant="tertiary">
                            Avbryt
                        </Button>
                    </div>
                </Modal.Content>
            </Modal>
        </>
    );
}
