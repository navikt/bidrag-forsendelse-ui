import { RedirectTo } from "@navikt/bidrag-ui-common";
import { BodyShort, Button, Heading, Modal } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";

import { BIDRAG_FORSENDELSE_API } from "../../api/api";
import environment from "../../environment";
import { useSession } from "../../pages/forsendelse/context/SessionContext";
import { AvvikType } from "../../types/AvvikTypes";

export default function SlettForsendelseModal({ closeModal }: { closeModal: () => void }) {
    const { forsendelseId, saksnummer } = useSession();

    const deleteForsendelseFnf = useMutation({
        mutationFn: () =>
            BIDRAG_FORSENDELSE_API.api.utforAvvik(forsendelseId, {
                avvikType: AvvikType.SLETT_JOURNALPOST,
                detaljer: {},
            }),
        onSuccess: () => {
            RedirectTo.sakshistorikk(saksnummer, environment.url.bisys);
        },
    });

    function deleteDocuments() {
        deleteForsendelseFnf.mutate();
    }
    return (
        <Modal
            open
            shouldCloseOnEsc
            shouldCloseOnOverlayClick
            onClose={closeModal}
            className={`min-w-[450px] max-w-[900px]`}
        >
            <Modal.Content>
                <Heading spacing size={"medium"}>
                    Ønsker du å slette forsendelsen?
                </Heading>
                <BodyShort spacing>
                    Du er i ferd med å slette alle dokumenter i forsendelse. En forsendelse må minst ha ett dokument.
                    <br /> Ønsker du å slette hele forsendelsen istedenfor?
                </BodyShort>
                <div>
                    <div className={"mt-2 flex flex-row gap-2 items-end bottom-2"}>
                        <Button
                            size="small"
                            variant="danger"
                            onClick={deleteDocuments}
                            loading={deleteForsendelseFnf.isLoading}
                        >
                            Slett forsendelse og gå tilbake til sakshistorikk
                        </Button>
                        <Button size="small" variant={"tertiary"} onClick={closeModal}>
                            Avbryt
                        </Button>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    );
}
