import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { DraggableProvidedDraggableProps } from "@hello-pangea/dnd";
import { DropResult } from "@hello-pangea/dnd";
import { ResponderProvided } from "@hello-pangea/dnd";
import { MenuHamburgerIcon } from "@navikt/aksel-icons";
import { Delete } from "@navikt/ds-icons";
import { Edit } from "@navikt/ds-icons";
import { Table } from "@navikt/ds-react";
import { Button } from "@navikt/ds-react";
import { Textarea } from "@navikt/ds-react";
import dayjs from "dayjs";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { CSSProperties } from "react";
import { useFormContext } from "react-hook-form";

import { DokumentStatus } from "../../constants/DokumentStatus";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import { useDokumenterForm } from "../../pages/forsendelse/context/DokumenterFormContext";
import { IForsendelseFormProps } from "../../pages/forsendelse/context/DokumenterFormContext";
import { IDokument } from "../../types/Dokument";
import TableDraggableBody from "../table/TableDraggableBody";
import DokumentStatusTag from "./DokumentStatusTag";
import OpenDokumentButton from "./OpenDokumentButton";
export default function DokumentRows() {
    const { dokumenter, forsendelseId, deleteDocument, swapDocuments } = useDokumenterForm();

    function onDocumentsChange(result: DropResult, provided: ResponderProvided) {
        if (result.reason == "DROP") {
            swapDocuments(result.source.index, result.destination.index);
        }
    }

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        // change background colour if dragging
        background: isDragging ? "var(--a-gray-100)" : "unset",

        // styles we need to apply on draggables
        ...draggableStyle,
    });

    return (
        <>
            <TableDraggableBody
                rowData={dokumenter}
                getRowKey={(d) => d.dokumentreferanse + d.journalpostId}
                onChange={onDocumentsChange}
            >
                {(provided, snapshot, dokument, i) => (
                    <DokumentRow
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        dokument={dokument}
                        forsendelseId={forsendelseId}
                        index={i}
                        deleteDocument={() => deleteDocument(dokument)}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    />
                )}
            </TableDraggableBody>
            <DokumenterTableBottomButtons />
        </>
    );
}

function DokumenterTableBottomButtons() {
    const { isSavingChanges, hasChanged, saveChanges, resetDocumentChanges } = useDokumenterForm();
    return (
        <div className={"flex flex-row mt-[10px]"}>
            {hasChanged && (
                <>
                    <Button loading={isSavingChanges} onClick={saveChanges} variant={"secondary"} size={"small"}>
                        Bekreft
                    </Button>
                    <Button onClick={resetDocumentChanges} variant={"tertiary"} size={"small"}>
                        Angre
                    </Button>
                </>
            )}
        </div>
    );
}
interface IDokumentRowProps extends DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps {
    index: number;
    dokument: IDokument;
    forsendelseId: string;
    deleteDocument: () => void;
}
const DokumentRow = React.forwardRef<HTMLTableRowElement, IDokumentRowProps>(
    ({ dokument, forsendelseId, index, deleteDocument, ...otherProps }: IDokumentRowProps, ref) => {
        const { tittel, index: dokindex, status, journalpostId, dokumentreferanse, dokumentDato } = dokument;
        const forsendelse = useForsendelseApi().hentForsendelse();
        const {
            register,
            formState: { errors },
        } = useFormContext<IForsendelseFormProps>();

        useEffect(() => {
            const { ref: formRef } = register(`dokumenter.${index}`);
            formRef(ref);
        }, []);
        function getKildeDisplayValue() {
            if ([DokumentStatus.UNDER_REDIGERING, DokumentStatus.FERDIGSTILT].includes(dokument.status)) {
                return "Fra mal";
            }
            if (dokument.fraSaksnummer == forsendelse.saksnummer) {
                return "Fra samme sak";
            }
            return "Fra sak " + dokument.fraSaksnummer;
        }
        const getRowStyle = () => {
            let styles = { ...otherProps.style } as CSSProperties;

            if (dokument.status == DokumentStatus.SLETTET) {
                styles = { ...otherProps.style, backgroundColor: "var(--a-surface-danger-subtle)" };
            } else if (dokument.lagret == false) {
                styles = { ...otherProps.style, backgroundColor: "var(--a-surface-success-subtle)" };
            }

            return styles;
        };

        return (
            <Table.Row
                key={index + dokumentreferanse + journalpostId}
                ref={ref}
                {...otherProps}
                style={getRowStyle()}
                className={`dokument-row ${errors.dokumenter?.[index]?.message ? "error" : ""}`}
            >
                <Table.DataCell style={{ width: "1%" }} className={"cursor-all-scroll"}>
                    <MenuHamburgerIcon />
                </Table.DataCell>
                <Table.DataCell style={{ width: "1%" }}>{dokindex + 1}</Table.DataCell>
                <Table.HeaderCell scope="row" style={{ width: "20%" }}>
                    <EditableDokumentTitle dokument={dokument} index={index} />
                </Table.HeaderCell>
                <Table.DataCell style={{ width: "5%" }}>{dayjs(dokumentDato).format("DD.MM.YYYY")}</Table.DataCell>
                <Table.DataCell style={{ width: "8%" }}>
                    <DokumentStatusTag status={status} />
                </Table.DataCell>
                <Table.DataCell style={{ width: "3%" }}>
                    <div className={"flex flex-row gap-1"}>
                        <OpenDokumentButton
                            dokumentreferanse={dokument.dokumentreferanse}
                            journalpostId={dokument.journalpostId}
                            status={dokument.status}
                            forsendelseId={forsendelseId}
                        />
                        <Button size={"small"} variant={"tertiary"} icon={<Delete />} onClick={deleteDocument} />
                    </div>
                </Table.DataCell>
            </Table.Row>
        );
    }
);

interface IEditableDokumentTitleProps {
    dokument: IDokument;
    index: number;
}
function EditableDokumentTitle({ dokument, index }: IEditableDokumentTitleProps) {
    const [inEditMode, setInEditMode] = useState(false);
    const { hasChanged } = useDokumenterForm();
    const {
        register,
        formState: { errors },
    } = useFormContext<IForsendelseFormProps>();
    useEffect(() => {
        hasChanged == false && setInEditMode(false);
    }, [hasChanged]);

    if (inEditMode) {
        return (
            <Textarea
                maxRows={2}
                minRows={1}
                label="Tittel"
                defaultValue={dokument.tittel}
                hideLabel
                {...register(`dokumenter.${index}.tittel`, { required: "Tittel kan ikke være tom" })}
                error={errors.dokumenter?.[index]?.tittel?.message}
            />
        );
    }
    return (
        <div>
            {dokument.tittel}
            <Button onClick={() => setInEditMode(true)} size={"small"} variant={"tertiary"} icon={<Edit />} />
        </div>
    );
}
