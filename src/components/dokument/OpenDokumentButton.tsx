import { OpenDocumentUtils } from "@navikt/bidrag-ui-common";
import { ExternalLink } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import React from "react";

import { DOKUMENT_KAN_IKKE_ÅPNES_STATUS, DokumentStatus } from "../../constants/DokumentStatus";
import { queryClient } from "../../pages/PageWrapper";
import { JournalpostStatus } from "../../types/Journalpost";
import EditDocumentButton from "./EditDocumentButton";

interface IOpenDokumentButtonProps {
    dokumentreferanse?: string;
    journalpostId?: string;
    status?: DokumentStatus | string | JournalpostStatus;
}
export default function OpenDokumentButton({ dokumentreferanse, status, journalpostId }: IOpenDokumentButtonProps) {
    if (DOKUMENT_KAN_IKKE_ÅPNES_STATUS.includes(status as DokumentStatus | JournalpostStatus)) {
        return null;
    }
    if (status == "MÅ_KONTROLLERES" || status == "KONTROLLERT") {
        return (
            <EditDocumentButton
                journalpostId={journalpostId}
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
            onClick={() => OpenDocumentUtils.åpneDokument(journalpostId, dokumentreferanse)}
        />
    );
}
