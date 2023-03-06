import { Broadcast, BroadcastMessage, BroadcastNames, EditDocumentBroadcastMessage } from "@navikt/bidrag-ui-common";
import { Edit } from "@navikt/ds-icons";
import { Close } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import React, { PropsWithChildren, useState } from "react";
import { v4 as uuidV4 } from "uuid";

import { Dokument } from "../../types/forsendelseInternal";
import OpenDocumentUtils from "../../utils/OpenDocumentUtils";
import { dokumenterToString } from "./DokumentRedigeringTypes";

interface BaseOpenDocumentLinkProps {
    isLink?: boolean;
    dokument?: Dokument;
    dokumentList?: Dokument[];
    journalpostId: string;
    editedDocument?: EditDocumentBroadcastMessage;
    onEditFinished: (document?: EditDocumentBroadcastMessage) => void;
    onEditStarted?: () => void;
}
interface EditSingleDocumentButtonProps extends BaseOpenDocumentLinkProps {
    dokument: Dokument;
    dokumentList?: never;
}

interface EditMultipleDocumentsButtonProps extends BaseOpenDocumentLinkProps {
    dokument?: never;
    dokumentList: Dokument[];
}

type EditDocumentButtonProps = EditMultipleDocumentsButtonProps | EditSingleDocumentButtonProps;

async function editDocument(
    journalpostId: string,
    editedDocument?: EditDocumentBroadcastMessage,
    dokument?: Dokument,
    dokumentList?: Dokument[]
) {
    const windowId = uuidV4();
    if (dokumentList && dokumentList.length > 0) {
        const dokumenter = dokumenterToString(journalpostId, dokumentList);
        OpenDocumentUtils.openDocumentEditorWithDocuments(dokumenter, editedDocument, windowId);
    } else {
        OpenDocumentUtils.openDocumentEditor(journalpostId, dokument.dokumentreferanse, editedDocument);
    }

    return waitForDocumentEditFinished(windowId).then((res) => res.payload);
}

function waitForDocumentEditFinished(id: string): Promise<BroadcastMessage<EditDocumentBroadcastMessage>> {
    return Broadcast.waitForBroadcast(BroadcastNames.EDIT_DOCUMENT_RESULT, id);
}

export default function EditDocumentButton({
    dokument,
    journalpostId,
    dokumentList,
    editedDocument,
    onEditFinished,
    onEditStarted,
}: PropsWithChildren<EditDocumentButtonProps>) {
    const [isWaiting, setIsWaiting] = useState(false);
    function _editDocument() {
        onEditStarted?.();
        setIsWaiting(true);
        editDocument(journalpostId, editedDocument, dokument, dokumentList)
            .then(onEditFinished)
            .finally(() => setIsWaiting(false));
    }

    return (
        <div className={"flex flex-row gap-2"}>
            <Button
                loading={isWaiting}
                variant="tertiary"
                onClick={_editDocument}
                icon={<Edit fr="true" />}
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
