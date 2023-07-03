import "./DokumenterTable.css";

import { Table } from "@navikt/ds-react";
import React from "react";

import DokumentStatusInfo from "../../docs/DokumentStatusInfo.mdx";
import { useDokumenterForm } from "../../pages/forsendelse/context/DokumenterFormContext";
import InfoKnapp from "../InfoKnapp";
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
                <Table size={"small"} style={{ tableLayout: "auto", display: "block", width: "1028px" }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col" style={{ width: "3px" }}></Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "3px" }}>
                                Nr.
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "550px" }}>
                                Tittel
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "100px" }}>
                                Dok. dato
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" align={"left"} style={{ width: "200px" }}>
                                <div className="flex flex-row gap-2">
                                    Status{" "}
                                    <InfoKnapp>
                                        <DokumentStatusInfo />
                                    </InfoKnapp>
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "50px" }}></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <DokumentRows />
                </Table>
            </div>
        </div>
    );
}
