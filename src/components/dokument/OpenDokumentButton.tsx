import { ExternalLink } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import React from "react";

import OpenDocumentUtils from "../../utils/OpenDocumentUtils";
import EditDocumentButton from "./EditDocumentButton";

interface IOpenDokumentButtonProps {
    dokumentreferanse?: string;
    journalpostId?: string;
    status?: string;
    forsendelseId?: string;
}
export default function OpenDokumentButton({
    dokumentreferanse,
    forsendelseId,
    status,
    journalpostId,
}: IOpenDokumentButtonProps) {
    if (status == "FERDIGSTILT") {
        return (
            <Button
                size={"small"}
                variant={"tertiary"}
                icon={<ExternalLink />}
                onClick={() => OpenDocumentUtils.åpneDokument(forsendelseId, dokumentreferanse)}
            />
        );
    }

    return <EditDocumentButton journalpostId={journalpostId ?? forsendelseId} onEditFinished={console.log} />;
}
