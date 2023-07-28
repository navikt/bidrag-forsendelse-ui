import { Alert, BodyShort, Button, Heading, Modal } from "@navikt/ds-react";
import { useState } from "react";
import { useMutation } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../../api/api";
import { Avvikshendelse } from "../../api/BidragForsendelseApi";
import { RedirectTo } from "../../utils/RedirectUtils";
import { useSession } from "../forsendelse/context/SessionContext";

export default function SlettForsendelseButton() {
    const { forsendelseIdMedPrefix, enhet, saksnummer } = useSession();
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const slettForsendelseFn = useMutation({
        mutationKey: "slett_forsendelse",
        mutationFn: async () => {
            const requestBody: Avvikshendelse = {
                avvikType: "SLETT_JOURNALPOST",
            };
            await BIDRAG_FORSENDELSE_API.api.utforAvvik(forsendelseIdMedPrefix, requestBody, {
                headers: {
                    "X-enhet": enhet,
                },
            });
        },
        onSuccess: () => {
            RedirectTo.sakshistorikk(saksnummer);
        },
    });
    if (!forsendelseIdMedPrefix) return null;
    return (
        <>
            <Button type="button" size="small" onClick={openModal} variant="secondary" value="Slett forsendelse">
                Slett forsendelse
            </Button>
            {modalOpen && (
                <Modal open onClose={closeModal}>
                    <Modal.Content className="">
                        <Heading size="medium">Slett forsendelse</Heading>
                        {slettForsendelseFn.isError && (
                            <Alert variant="error">Det skjedde en feil ved sletting av forsendelse</Alert>
                        )}
                        <BodyShort spacing className="pt-2 pb-2">
                            Er du sikker på at du vil slette forsendelse under opprettelse?
                        </BodyShort>
                        <div className="flex flex-row gap-[5px]">
                            <Button
                                size="small"
                                onClick={() => slettForsendelseFn.mutate()}
                                loading={slettForsendelseFn.isLoading}
                            >
                                Slett og gå tilbake til sakshistorikk
                            </Button>
                            <Button
                                size="small"
                                onClick={closeModal}
                                disabled={slettForsendelseFn.isLoading}
                                variant="tertiary"
                            >
                                Avbryt
                            </Button>
                        </div>
                    </Modal.Content>
                </Modal>
            )}
        </>
    );
}
