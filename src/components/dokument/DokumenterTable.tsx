import "./DokumenterTable.css";

import { Table } from "@navikt/ds-react";
import React from "react";

import { useDokumenterForm } from "../../pages/forsendelse/context/DokumenterFormContext";
import DokumentRows from "./DokumentRows";
import LeggTilDokumentButton from "./LeggTilDokumentKnapp";
import LeggTilFraMalKnapp from "./LeggTilFraMalKnapp";
// interface DokumenterTableProps {
//     forsendelseId: string;
//     dokumenter: IDokument[];
// }

// export default function DokumenterTable({ dokumenter, forsendelseId }: DokumenterTableProps) {
//     const [isEditable, setIsEditable] = useState(false);
//
//     return (
//         <DokumenterProvider forsendelseId={forsendelseId} dokumenter={dokumenter}>
//             <DokumenterTableContent />
//         </DokumenterProvider>
//     );
// }

export default function DokumenterTable() {
    const { dokumenter, forsendelseId } = useDokumenterForm();
    return (
        <div>
            <div className={"flex flex-rpw mt-[10px] border-b-[1px]"}>
                <LeggTilDokumentButton />
                <LeggTilFraMalKnapp />
                <div style={{ marginLeft: "auto" }}>Antall dokumenter: {dokumenter.length}</div>
            </div>
            <div className={"dokument-table "} style={{ borderColor: "var(--a-border-subtle)" }}>
                <Table size={"small"} style={{ tableLayout: "auto", display: "block" }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col" style={{ width: "1%" }}></Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "1%" }}>
                                Nr.
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "30%" }}>
                                Tittel
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "5%" }}>
                                Dok. dato
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" align={"left"} style={{ width: "5%" }}>
                                Status
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "1%" }}></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <DokumentRows />
                </Table>
            </div>
        </div>
    );
}
