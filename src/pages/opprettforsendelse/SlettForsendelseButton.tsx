import { Alert, BodyShort, Button, Modal } from "@navikt/ds-react";
import { useRef } from "react";
import { useMutation } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../../api/api";
import { Avvikshendelse } from "../../api/BidragForsendelseApi";
import { RedirectTo } from "../../utils/RedirectUtils";
import { useSession } from "../forsendelse/context/SessionContext";

export default function SlettForsendelseButton() {
    const { forsendelseIdMedPrefix, enhet, saksnummer } = useSession();
    const openModal = () => ref.current?.showModal();
    const closeModal = (e: React.MouseEvent<any>) => {
        e.preventDefault();
        ref.current?.close();
    };
    const ref = useRef<HTMLDialogElement>(null);

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
            <Modal
                ref={ref}
                onClose={closeModal}
                header={{
                    heading: "Slett forsendelse",
                }}
            >
                <Modal.Body>
                    {slettForsendelseFn.isError && (
                        <Alert variant="error">Det skjedde en feil ved sletting av forsendelse</Alert>
                    )}
                    <BodyShort>Er du sikker på at du vil slette forsendelse under opprettelse?</BodyShort>
                </Modal.Body>
                <Modal.Footer>
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
                </Modal.Footer>
            </Modal>
        </>
    );
}
