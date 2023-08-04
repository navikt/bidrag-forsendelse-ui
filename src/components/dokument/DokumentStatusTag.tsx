import { Tag } from "@navikt/ds-react";
import React from "react";

import { DokumentStatus } from "../../constants/DokumentStatus";
import { DokumentStatusTags } from "../../constants/DokumentStatus";
import { DokumentStatusDisplayName } from "../../constants/DokumentStatus";

interface DokumentStatusTagProps {
    status: DokumentStatus;
}
export default function DokumentStatusTag({ status }: DokumentStatusTagProps) {
    return (
        <Tag variant={DokumentStatusTags[status]} size="xsmall" className="w-max p-[0.3rem] rounded-md">
            {DokumentStatusDisplayName[status] ?? "Ukjent"}
        </Tag>
    );
}
