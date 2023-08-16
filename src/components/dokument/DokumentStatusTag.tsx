import { Loader, Tag } from "@navikt/ds-react";
import React from "react";

import { DokumentStatus } from "../../constants/DokumentStatus";
import { DokumentStatusTags } from "../../constants/DokumentStatus";
import { DokumentStatusDisplayName } from "../../constants/DokumentStatus";

interface DokumentStatusTagProps {
    status: DokumentStatus;
}
export default function DokumentStatusTag({ status }: DokumentStatusTagProps) {
    const erUnderProduksjon = [
        DokumentStatus.UNDER_PRODUKSJON,
        DokumentStatus.BESTILLING_FEILET,
        DokumentStatus.IKKE_BESTILT,
    ].includes(status);
    return (
        <div className="flex flex-row gap-[5px] align-center">
            <Tag variant={DokumentStatusTags[status]} size="xsmall" className="w-max p-[0.3rem] rounded-md">
                {DokumentStatusDisplayName[status] ?? "Ukjent"}
            </Tag>
            {erUnderProduksjon && <Loader size="xsmall" />}
        </div>
    );
}
