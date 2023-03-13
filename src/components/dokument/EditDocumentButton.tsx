import { Broadcast, BroadcastMessage, BroadcastNames, EditDocumentBroadcastMessage } from "@navikt/bidrag-ui-common";
import { Close } from "@navikt/ds-icons";
import { ExternalLink } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import React, { PropsWithChildren, useState } from "react";
import { v4 as uuidV4 } from "uuid";

import { IDokument } from "../../types/Dokument";
import OpenDocumentUtils from "../../utils/OpenDocumentUtils";

interface EditDocumentButtonProps {
    dokumentList?: IDokument[];
    journalpostId: string;
    editedDocument?: EditDocumentBroadcastMessage;
    onEditFinished: (document?: EditDocumentBroadcastMessage) => void;
    onEditStarted?: () => void;
}

async function editDocument(journalpostId: string, editedDocument?: EditDocumentBroadcastMessage) {
    const windowId = uuidV4();
    OpenDocumentUtils.openDocumentEditor(journalpostId, editedDocument);

    return waitForDocumentEditFinished(windowId).then((res) => res.payload);
}

function waitForDocumentEditFinished(id: string): Promise<BroadcastMessage<EditDocumentBroadcastMessage>> {
    return Broadcast.waitForBroadcast(BroadcastNames.EDIT_DOCUMENT_RESULT, id);
}

export default function EditDocumentButton({
    journalpostId,
    editedDocument,
    onEditFinished,
    onEditStarted,
}: PropsWithChildren<EditDocumentButtonProps>) {
    const [isWaiting, setIsWaiting] = useState(false);
    function _editDocument() {
        onEditStarted?.();
        setIsWaiting(true);
        editDocument(journalpostId, editedDocument)
            .then(onEditFinished)
            .finally(() => setIsWaiting(false));
    }

    return (
        <div className={"flex flex-row gap-2"}>
            <Button
                loading={isWaiting}
                variant="tertiary"
                onClick={_editDocument}
                icon={<ExternalLink fr="true" />}
                size={"small"}
                type={"button"}
            />
            {isWaiting && (
                <Button
                    variant="secondary"
                    onClick={() => {
                        onEditFinished();
                        setIsWaiting(false);
                    }}
                    icon={<Close fr="true" />}
                    size={"small"}
                    type={"button"}
                />
            )}
        </div>
    );
}
