import { ExternalLink } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import React from "react";

import { DokumentStatus } from "../../constants/DokumentStatus";
import { queryClient } from "../../pages/PageWrapper";
import OpenDocumentUtils from "../../utils/OpenDocumentUtils";
import EditDocumentButton from "./EditDocumentButton";

interface IOpenDokumentButtonProps {
    dokumentreferanse?: string;
    journalpostId?: string;
    status?: DokumentStatus | string;
    forsendelseId?: string;
}
export default function OpenDokumentButton({
    dokumentreferanse,
    forsendelseId,
    status,
    journalpostId,
}: IOpenDokumentButtonProps) {
    if (status == "MÅ_KONTROLLERES" || status == "KONTROLLERT") {
        return (
            <EditDocumentButton
                journalpostId={"BIF-" + forsendelseId}
                dokumentreferanse={dokumentreferanse}
                onEditFinished={() => queryClient.invalidateQueries("forsendelse")}
            />
        );
    }

    return (
        <Button
            size={"small"}
            variant={"tertiary"}
            icon={<ExternalLink />}
            onClick={() => OpenDocumentUtils.åpneDokument(forsendelseId, dokumentreferanse)}
        />
    );
}
