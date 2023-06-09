import { Tag } from "@navikt/ds-react";

import { JournalpostStatus } from "../../types/Journalpost";

export const JournalpostStatusTags = {
    [JournalpostStatus.UNDER_PRODUKSJON]: "alt2",
    [JournalpostStatus.DISTRIBUERT]: "success",
    [JournalpostStatus.JOURNALFØRT]: "success",
    [JournalpostStatus.UNDER_OPPRETELSE]: "alt2",
    [JournalpostStatus.KLAR_FOR_DISTRIBUSJON]: "warning",
} as const;
export const JournalpostStatusDisplayName = {
    [JournalpostStatus.UNDER_PRODUKSJON]: "Under produksjon",
    [JournalpostStatus.DISTRIBUERT]: "Distribuert",
    [JournalpostStatus.JOURNALFØRT]: "Journalført",
    [JournalpostStatus.UNDER_OPPRETELSE]: "Under opprettelse",
    [JournalpostStatus.KLAR_FOR_DISTRIBUSJON]: "Klar for distribusjon",
} as const;

interface JournalpostStatusTagProps {
    status: JournalpostStatus | string;
}

export default function JournalpostStatusTag({ status }: JournalpostStatusTagProps) {
    return (
        <Tag variant={JournalpostStatusTags[status]} size="small" className="w-18 p-2 rounded-md">
            {JournalpostStatusDisplayName[status] ?? "Ukjent"}
        </Tag>
    );
}
