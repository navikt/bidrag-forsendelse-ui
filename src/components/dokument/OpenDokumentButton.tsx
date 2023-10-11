import { OpenDocumentUtils } from "@navikt/bidrag-ui-common";
import { ExternalLink } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import React, { useState } from "react";

import { DOKUMENT_KAN_IKKE_ÅPNES_STATUS, DokumentStatus } from "../../constants/DokumentStatus";
import { queryClient } from "../../pages/PageWrapper";
import { IJournalpostStatus } from "../../types/Journalpost";
import EditDocumentButton from "./EditDocumentButton";

interface IOpenDokumentButtonProps {
    dokumentreferanse?: string;
    journalpostId?: string;
    status?: DokumentStatus | string | IJournalpostStatus;
}
export default function OpenDokumentButton({ dokumentreferanse, status, journalpostId }: IOpenDokumentButtonProps) {
    const [isOpeningIframe, setIsOpeningIframe] = useState(false);
    if (DOKUMENT_KAN_IKKE_ÅPNES_STATUS.includes(status as DokumentStatus | IJournalpostStatus)) {
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

    const id = `doklink_${journalpostId}_${dokumentreferanse}`;
    function openDocumentIframe() {
        setIsOpeningIframe(true);
        document.getElementById(id).click();
        setTimeout(() => {
            setIsOpeningIframe(false);
        }, 2000);
    }
    return (
        <>
            <Button
                size={"small"}
                variant={"tertiary"}
                icon={<ExternalLink />}
                loading={isOpeningIframe}
                disabled={isOpeningIframe}
                title={isOpeningIframe ? "Åpner dokument" : "Åpne dokument"}
                onClick={openDocumentIframe}
            />
            <OpenDokumentIframe
                id={id}
                path={OpenDocumentUtils.getÅpneDokumentLenke(journalpostId, dokumentreferanse, false, true)}
            />
        </>
    );
}

interface OpenDokumentIframeProps {
    id: string;
    path: string;
}
function OpenDokumentIframe({ path, id }: OpenDokumentIframeProps) {
    return (
        <>
            <iframe name="bidragui" style={{ display: "none" }}></iframe>
            <a id={id} style={{ display: "none" }} href={path} target="bidragui"></a>
        </>
    );
}
