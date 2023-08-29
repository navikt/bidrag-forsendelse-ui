import "./DokumenterTable.css";

import { OpenDocumentUtils } from "@navikt/bidrag-ui-common";
import { Button, Switch, Table } from "@navikt/ds-react";
import React from "react";

import { DokumentStatus } from "../../constants/DokumentStatus";
import { useErrorContext } from "../../context/ErrorProvider";
import DokumentStatusInfo from "../../docs/DokumentStatusInfo.mdx";
import DokumentTittelInfo from "../../docs/DokumentTittel.mdx";
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
    const { dokumenter, toggleDeleteMode, deleteMode } = useDokumenterForm();
    return (
        <div className={"w-max"}>
            <div className={"flex flex-row mt-[10px] border-b-[1px] w-full flex-wrap max-w-[95vw]"}>
                <LeggTilDokumentButton />
                <LeggTilFraMalKnapp />
            </div>

            <div className={"flex flex-row mt-[10px] border-b-[1px] w-full flex-wrap max-w-[95vw]"}>
                <div>Antall dokumenter: {dokumenter.length}</div>
                <div style={{ marginLeft: "auto" }}>
                    <Switch
                        value={deleteMode}
                        size="small"
                        onChange={(e) => {
                            console.log(e);
                            toggleDeleteMode();
                        }}
                    >
                        Slett flere
                    </Switch>
                </div>
            </div>
            <div className={"dokument-table "} style={{ borderColor: "var(--a-border-subtle)" }}>
                <div className="w-full max-w-[95vw] overflow-auto">
                    <Table size={"small"} style={{ tableLayout: "auto", display: "block", width: "1028px" }}>
                        <DokumenterTableHeader />
                        <DokumentRows />
                    </Table>
                </div>
                <DokumenterTableBottomButtons />
            </div>
        </div>
    );
}

function DokumenterTableHeader() {
    return (
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell scope="col" style={{ width: "3px" }}></Table.HeaderCell>
                <Table.HeaderCell scope="col" style={{ width: "3px" }}>
                    Nr.
                </Table.HeaderCell>
                <Table.HeaderCell scope="col" style={{ width: "550px" }}>
                    <div className="flex flex-row gap-1 items-center">
                        Tittel{" "}
                        <InfoKnapp>
                            <DokumentTittelInfo />
                        </InfoKnapp>
                    </div>
                </Table.HeaderCell>
                <Table.HeaderCell scope="col" style={{ width: "100px" }}>
                    Dok. dato
                </Table.HeaderCell>
                <Table.HeaderCell scope="col" align={"left"} style={{ width: "200px" }}>
                    <div className="flex flex-row gap-1 items-center">
                        Status{" "}
                        <InfoKnapp>
                            <DokumentStatusInfo />
                        </InfoKnapp>
                    </div>
                </Table.HeaderCell>
                <Table.HeaderCell scope="col" style={{ width: "50px" }}></Table.HeaderCell>
            </Table.Row>
        </Table.Header>
    );
}

function DokumenterTableBottomButtons() {
    const { isSavingChanges, hasChanged, saveChanges, resetDocumentChanges, dokumenter, forsendelseId } =
        useDokumenterForm();
    const { errorSource, resetError } = useErrorContext();
    const isOneOrMoreDocumentsDeleted = dokumenter.some((d) => d.status == DokumentStatus.SLETTET);
    const isAllDocumentsFinished = dokumenter.every(
        (d) => d.status == DokumentStatus.FERDIGSTILT || d.status == DokumentStatus.KONTROLLERT
    );
    const { addWarning } = useErrorContext();
    function resetErrorAndChanges() {
        resetDocumentChanges();
        resetError();
    }
    return (
        <span className={"flex flex-row mt-[10px] w-full"}>
            {hasChanged && isOneOrMoreDocumentsDeleted && (
                <>
                    <Button loading={isSavingChanges} onClick={saveChanges} variant={"danger"} size={"small"}>
                        Bekreft sletting
                    </Button>
                    <Button onClick={resetDocumentChanges} variant={"tertiary"} size={"small"}>
                        Angre
                    </Button>
                </>
            )}
            {errorSource == "dokumenter" && (
                <Button onClick={resetErrorAndChanges} variant={"tertiary"} size={"small"}>
                    Angre siste endringer
                </Button>
            )}
            <Button
                size="small"
                variant="tertiary"
                className="ml-auto justify-end"
                onClick={() => {
                    if (!isAllDocumentsFinished) {
                        addWarning("Alle dokumenter må kontrolleres/ferdigstilles før de kan åpnes samtidig");
                    } else {
                        OpenDocumentUtils.åpneDokument("BIF-" + forsendelseId, null, false);
                    }
                }}
            >
                Åpne alle
            </Button>
        </span>
    );
}
