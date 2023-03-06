import { Hamburger } from "@navikt/ds-icons";
import { Button, Table, TextField } from "@navikt/ds-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { DokumentRespons } from "../../api/BidragForsendelseApi";
import { Dokument, dokumentstatusDisplayValue } from "../../types/forsendelseInternal";
import DokumentRader from "./DokumentRader";

interface DokumenterTableProps {
    forsendelseId: string;
    dokumenter: DokumentRespons[];
}
export default function DokumenterTable({ dokumenter, forsendelseId }: DokumenterTableProps) {
    const [isEditable, setIsEditable] = useState(false);

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
                <div style={{ marginLeft: "auto" }}>Antall dokumenter: {dokumenter.length}</div>
            </div>
            <div className={"dokument_table "} style={{ borderColor: "var(--a-border-subtle)" }}>
                <Table style={{ tableLayout: "auto", display: "block" }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col" style={{ width: "1%" }}>
                                Nr.
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "15%" }}>
                                Tittel
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "5%" }}>
                                Dok. dato
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" align={"left"} style={{ paddingRight: "100px", width: "5%" }}>
                                Status
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" style={{ width: "3%" }}></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <DokumentRader dokumenter={dokumenter} forsendelseId={forsendelseId} />
                </Table>
            </div>
        </div>
    );
}

function TableBottomRow() {}
interface DokumenterFormProps {
    dokumentreferanse: string;
    rekkefølge_indeks: number;
}

export function DokumenterEditable({ dokumenter }: DokumenterTableProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: dokumenter,
    });

    const renderTableRow = (
        { tittel, status, journalpostId, dokumentreferanse, dokumentmalId }: Dokument,
        i: number
    ) => (
        <Table.Row key={i + dokumentreferanse}>
            <Table.DataCell>
                <Hamburger />
            </Table.DataCell>
            <Table.HeaderCell scope="row">
                <TextField label="Tittel" hideLabel defaultValue={tittel} size="small" htmlSize={14} />
            </Table.HeaderCell>
            <Table.DataCell>{dokumentmalId}</Table.DataCell>
            <Table.DataCell>{dokumentstatusDisplayValue(status)}</Table.DataCell>
        </Table.Row>
    );

    return (
        <div>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                        <Table.HeaderCell scope="col">Tittel</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Dokumentmal</Table.HeaderCell>
                        <Table.HeaderCell scope="col" align={"left"} style={{ paddingRight: "100px" }}>
                            Status
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{dokumenter.map(renderTableRow)}</Table.Body>
            </Table>
            <Button size={"small"} variant={"primary"}>
                Lagre
            </Button>
        </div>
    );
}
