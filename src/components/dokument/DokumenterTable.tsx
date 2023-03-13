import "./DokumenterTable.css";

import { Table } from "@navikt/ds-react";
import React from "react";

import { useDokumenter } from "../../pages/forsendelse/context/DokumenterContext";
import DokumentRows from "./DokumentRows";
import LeggTilDokumentButton from "./LeggTilDokumentKnapp";
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
    const { dokumenter, forsendelseId } = useDokumenter();
    return (
        <div>
            <div className={"flex flex-rpw mt-[10px] border-b-[1px]"}>
                <LeggTilDokumentButton />
                <div style={{ marginLeft: "auto" }}>Antall dokumenter: {dokumenter.length}</div>
            </div>
            <div className={"dokument_table "} style={{ borderColor: "var(--a-border-subtle)" }}>
                <Table size={"small"} style={{ tableLayout: "auto", display: "block" }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col" style={{ width: "1%" }}>
                                Nr.
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "20%" }}>
                                Tittel
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "5%" }}>
                                Dok. dato
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" align={"left"} style={{ width: "10%" }}>
                                Kilde
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" align={"left"} style={{ width: "2%" }}>
                                Dok.mal
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" align={"left"} style={{ width: "8%" }}>
                                Status
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "6%" }}></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <DokumentRows />
                </Table>
            </div>
        </div>
    );
}
