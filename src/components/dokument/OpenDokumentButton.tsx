import { Eye } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import React from "react";

import { DokumentRespons } from "../../api/BidragForsendelseApi";
import OpenDocumentUtils from "../../utils/OpenDocumentUtils";
import EditDocumentButton from "./EditDocumentButton";

interface IOpenDokumentButtonProps {
    dokument: DokumentRespons;
    forsendelseId?: string;
}
export default function OpenDokumentButton({ dokument, forsendelseId }: IOpenDokumentButtonProps) {
    if (dokument.status == "FERDIGSTILT") {
        return (
            <Button
                size={"small"}
                variant={"tertiary"}
                icon={<Eye />}
                onClick={() => OpenDocumentUtils.åpneDokument(forsendelseId, dokument.dokumentreferanse)}
            />
        );
    }

    return (
        <EditDocumentButton
            dokument={dokument}
            journalpostId={dokument.journalpostId ?? forsendelseId}
            onEditFinished={console.log}
        />
    );
}
