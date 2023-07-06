import { DragEndEvent, DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { EyeIcon } from "@navikt/aksel-icons";
import { DragVerticalIcon } from "@navikt/aksel-icons";
import { OpenDocumentUtils } from "@navikt/bidrag-ui-common";
import { Delete } from "@navikt/ds-icons";
import { Table } from "@navikt/ds-react";
import { Button } from "@navikt/ds-react";
import { Textarea } from "@navikt/ds-react";
import dayjs from "dayjs";
import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { CSSProperties } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { DokumentStatus } from "../../constants/DokumentStatus";
import { FormIDokument, useDokumenterForm } from "../../pages/forsendelse/context/DokumenterFormContext";
import { IForsendelseFormProps } from "../../pages/forsendelse/context/DokumenterFormContext";
import { IDokument } from "../../types/Dokument";
import TableDraggableBody from "../table/TableDraggableBody";
import DokumentLinkedTag from "./DokumentLinkedTag";
import DokumentStatusTag from "./DokumentStatusTag";
import OpenDokumentButton from "./OpenDokumentButton";
export default function DokumentRows() {
    const { dokumenter, forsendelseId, deleteDocument, swapDocuments } = useDokumenterForm();

    function onDocumentsChange(event: DragEndEvent) {
        const { active, over } = event;

        if (active?.id !== over?.id) {
            const oldIndex = dokumenter.findIndex((d) => getRowKey(d) == active?.id);
            const newIndex = dokumenter.findIndex((d) => getRowKey(d) == over?.id);

            if (oldIndex != -1 && newIndex != -1) {
                swapDocuments(oldIndex, newIndex);
            }
        }
    }

    function getRowKey(d: FormIDokument) {
        return d.dokumentreferanse + d.journalpostId;
    }

    return (
        <>
            <TableDraggableBody rowData={dokumenter} getRowKey={getRowKey} onChange={onDocumentsChange}>
                {(dokument, i, id, attributes, listeners, style, ref) => (
                    <DokumentRow
                        dokument={dokument}
                        forsendelseId={forsendelseId}
                        index={i}
                        ref={ref}
                        id={id}
                        listeners={listeners}
                        attributes={attributes}
                        style={style}
                        deleteDocument={() => deleteDocument(dokument)}
                    />
                )}
            </TableDraggableBody>
            <DokumenterTableBottomButtons />
        </>
    );
}

function DokumenterTableBottomButtons() {
    const { isSavingChanges, hasChanged, saveChanges, resetDocumentChanges, dokumenter } = useDokumenterForm();
    const isOneOrMoreDocumentsDeleted = dokumenter.some((d) => d.status == DokumentStatus.SLETTET);
    return (
        <div className={"flex flex-row mt-[10px]"}>
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
        </div>
    );
}
interface IDokumentRowProps {
    id: string;
    index: number;
    dokument: IDokument;
    forsendelseId: string;
    deleteDocument: () => void;
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap;
    style: CSSProperties;
}
const DokumentRow = React.forwardRef<HTMLTableRowElement, IDokumentRowProps>(
    (
        {
            id,
            dokument,
            forsendelseId,
            index: rowIndex,
            deleteDocument,
            listeners,
            attributes,
            style,
        }: IDokumentRowProps,
        ref
    ) => {
        const { tittel, index: dokindex, status, journalpostId, dokumentreferanse, dokumentDato } = dokument;
        const {
            register,
            formState: { errors },
        } = useFormContext<IForsendelseFormProps>();

        useEffect(() => {
            const { ref: formRef } = register(`dokumenter.${index}`);
            formRef(ref);
        }, []);

        const getRowStyle = () => {
            let styles = { ...style } as CSSProperties;

            if (dokument.status == DokumentStatus.SLETTET) {
                styles = { ...style, backgroundColor: "var(--a-red-50)" };
            } else if (dokument.lagret == false) {
                styles = { ...style, backgroundColor: "var(--a-green-50)" };
            }

            return styles;
        };

        const forsendelseIdNumeric = dokument.forsendelseId ?? forsendelseId?.replace("BIF-", "");
        const originalDokumentreferanse = dokument.lenkeTilDokumentreferanse ?? dokument.dokumentreferanse;

        const index = dokindex == -1 ? rowIndex : dokindex;
        return (
            <Table.Row
                key={rowIndex + dokumentreferanse + journalpostId}
                ref={ref}
                style={getRowStyle()}
                className={`dokument-row ${errors.dokumenter?.[rowIndex]?.message ? "error" : ""}`}
            >
                <Table.DataCell style={{ width: "3px" }} className={"cursor-all-scroll"} {...listeners} {...attributes}>
                    <DragVerticalIcon />
                </Table.DataCell>
                <Table.DataCell style={{ width: "3px" }}>{index + 1}</Table.DataCell>
                <Table.DataCell scope="row" style={{ width: "550px" }}>
                    <EditableDokumentTitle dokument={dokument} index={rowIndex} />
                </Table.DataCell>
                <Table.DataCell style={{ width: "100px" }}>{dayjs(dokumentDato).format("DD.MM.YYYY")}</Table.DataCell>
                <Table.DataCell style={{ width: "200px" }}>
                    <div className="flex flex-row gap-[5px]">
                        <DokumentStatusTag status={status} />
                        {dokument.lenkeTilDokumentreferanse && <DokumentLinkedTag />}
                    </div>
                </Table.DataCell>
                <Table.DataCell style={{ width: "50px" }}>
                    <div className={"flex flex-row gap-1 justify-end"}>
                        {dokument.status == "KONTROLLERT" && (
                            <Button
                                size={"small"}
                                variant={"tertiary"}
                                icon={<EyeIcon />}
                                onClick={() =>
                                    OpenDocumentUtils.åpneDokument(
                                        `BIF-${forsendelseIdNumeric}`,
                                        originalDokumentreferanse
                                    )
                                }
                            />
                        )}
                        <OpenDokumentButton
                            dokumentreferanse={originalDokumentreferanse}
                            journalpostId={"BIF-" + forsendelseIdNumeric}
                            status={dokument.status}
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
    const enableBlurEvent = useRef(false);
    const { updateTitle } = useDokumenterForm();

    const {
        register,
        setValue,
        formState: { errors },
    } = useFormContext<IForsendelseFormProps>();
    const value = useWatch({ name: `dokumenter.${index}.tittel` });

    function _updateTitle(e) {
        setInEditMode(false);
        updateTitle(value, dokument.dokumentreferanse);
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.code == "Escape") {
            setInEditMode(false);
            setValue(`dokumenter.${index}.tittel`, dokument.tittel);
        }
    }
    return (
        <div
            style={{ width: "100%" }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setTimeout(() => (enableBlurEvent.current = true), 500);
                setInEditMode(true);
            }}
            onBlur={_updateTitle}
            onKeyDown={onKeyDown}
        >
            {inEditMode ? (
                <Textarea
                    autoFocus
                    maxRows={2}
                    minRows={1}
                    label="Tittel"
                    defaultValue={dokument.tittel}
                    hideLabel
                    {...register(`dokumenter.${index}.tittel`, { required: "Tittel kan ikke være tom" })}
                    error={errors.dokumenter?.[index]?.tittel?.message}
                />
            ) : (
                <>{value}</>
            )}
        </div>
    );
}
