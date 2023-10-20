import { DragEndEvent, DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { EyeIcon } from "@navikt/aksel-icons";
import { DragVerticalIcon } from "@navikt/aksel-icons";
import { dateToDDMMYYYYString, OpenDocumentUtils, removeNonPrintableCharachters } from "@navikt/bidrag-ui-common";
import { Delete } from "@navikt/ds-icons";
import { BodyShort, Checkbox, Heading, Modal, Table } from "@navikt/ds-react";
import { Button } from "@navikt/ds-react";
import { Textarea } from "@navikt/ds-react";
import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { CSSProperties } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { DokumentArkivSystemDto } from "../../api/BidragForsendelseApi";
import { DokumentStatus } from "../../constants/DokumentStatus";
import { FormIDokument, useDokumenterForm } from "../../pages/forsendelse/context/DokumenterFormContext";
import { IForsendelseFormProps } from "../../pages/forsendelse/context/DokumenterFormContext";
import { IDokument } from "../../types/Dokument";
import { cleanupAfterClosedModal } from "../../utils/ModalUtils";
import TableDraggableBody from "../table/TableDraggableBody";
import DokumentLinkedTag from "./DokumentLinkedTag";
import DokumentStatusTag from "./DokumentStatusTag";
import OpenDokumentButton from "./OpenDokumentButton";
import SlettForsendelseModal from "./SlettForsendelseModal";
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
                        key={id + i}
                        listeners={listeners}
                        attributes={attributes}
                        style={style}
                    />
                )}
            </TableDraggableBody>
        </>
    );
}

interface IDokumentRowProps {
    id: string;
    index: number;
    dokument: FormIDokument;
    forsendelseId: string;
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap;
    style: CSSProperties;
}
const DokumentRow = React.forwardRef<HTMLTableRowElement, IDokumentRowProps>(
    ({ id, dokument, forsendelseId, index: rowIndex, listeners, attributes, style }: IDokumentRowProps, ref) => {
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
                styles = { ...style };
            } else if (dokument.lagret == false) {
                styles = { ...style, backgroundColor: "var(--a-green-50)" };
            }

            return styles;
        };

        const erLenkeTilDokumentIAnnenForsendelse = dokument.arkivsystem == DokumentArkivSystemDto.FORSENDELSE;

        const forsendelseIdNumeric = erLenkeTilDokumentIAnnenForsendelse
            ? dokument.originalJournalpostId
            : forsendelseId?.replace("BIF-", "");
        const originalDokumentreferanse = erLenkeTilDokumentIAnnenForsendelse
            ? dokument.originalDokumentreferanse
            : dokument.dokumentreferanse;

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
                <EditableDokumentTitleRow dokument={dokument} index={rowIndex} />
                <Table.DataCell style={{ width: "100px" }}>
                    {dateToDDMMYYYYString(dokumentDato ? new Date(dokumentDato) : new Date())}
                </Table.DataCell>
                <Table.DataCell style={{ width: "200px" }}>
                    <div className="flex flex-row gap-[5px]">
                        <DokumentStatusTag status={status} />
                        {erLenkeTilDokumentIAnnenForsendelse && <DokumentLinkedTag />}
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
                            erSkjema={dokument.erSkjema}
                        />
                        <DeleteDocumentButton dokument={dokument} />
                    </div>
                </Table.DataCell>
            </Table.Row>
        );
    }
);

function DeleteDocumentButton({ dokument }: { dokument: FormIDokument }) {
    const { deleteDocument, saveChanges, deleteMode, dokumenter } = useDokumenterForm();
    const [modalOpen, setModalOpen] = useState(false);
    const closeModal = () => {
        setModalOpen(false);
        cleanupAfterClosedModal();
    };
    const openModal = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setModalOpen(true);
    };

    function deleteDocumentFromForsendelse() {
        deleteDocument(dokument);
        saveChanges();
    }

    if (deleteMode) {
        const isChecked = dokument.status == DokumentStatus.SLETTET;
        return (
            <Checkbox
                checked={isChecked}
                onChange={() => {
                    deleteDocument(dokument);
                }}
            >
                <div></div>
            </Checkbox>
        );
    }
    const hasOnlyOneDocument = dokumenter.length == 1;
    return (
        <>
            <Button size={"small"} variant={"tertiary"} icon={<Delete />} onClick={openModal} />
            {modalOpen && !hasOnlyOneDocument && (
                <Modal
                    open={modalOpen}
                    shouldCloseOnEsc
                    shouldCloseOnOverlayClick
                    onClose={closeModal}
                    className={`min-w-[430px] max-w-[700px]`}
                >
                    <Modal.Content>
                        <Heading spacing size={"medium"}>
                            Ønsker du å slette dokumentet?
                        </Heading>
                        <BodyShort>
                            Du er i ferd med å slette dokument med tittel
                            <ul>
                                <li>{dokument.tittel}</li>
                            </ul>
                            Det vil ikke være mulig å angre slettingen
                        </BodyShort>
                        <div>
                            <div className={"mt-2 flex flex-row gap-2 items-end bottom-2"}>
                                <Button size="small" variant="danger" onClick={deleteDocumentFromForsendelse}>
                                    Slett
                                </Button>
                                <Button size="small" variant={"tertiary"} onClick={closeModal}>
                                    Avbryt
                                </Button>
                            </div>
                        </div>
                    </Modal.Content>
                </Modal>
            )}
            {modalOpen && hasOnlyOneDocument && <SlettForsendelseModal closeModal={closeModal} />}
        </>
    );
}
interface IEditableDokumentTitleRowProps {
    dokument: IDokument;
    index: number;
}
function EditableDokumentTitleRow({ dokument, index }: IEditableDokumentTitleRowProps) {
    const [inEditMode, setInEditMode] = useState(false);
    const enableBlurEvent = useRef(false);
    const { updateTitle } = useDokumenterForm();

    const {
        register,
        setValue,
        formState: { errors },
    } = useFormContext<IForsendelseFormProps>();
    const value = useWatch({ name: `dokumenter.${index}.tittel` });

    function _updateTitle() {
        setInEditMode(false);
        updateTitle(removeNonPrintableCharachters(value), dokument.dokumentreferanse);
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.code == "Escape") {
            setInEditMode(false);
            setValue(`dokumenter.${index}.tittel`, dokument.tittel);
        }

        if (e.code == "Enter" && !e.shiftKey) {
            _updateTitle();
        }
    }
    return (
        <Table.DataCell
            scope="row"
            style={{ width: "550px", height: "100%" }}
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
        </Table.DataCell>
    );
}
