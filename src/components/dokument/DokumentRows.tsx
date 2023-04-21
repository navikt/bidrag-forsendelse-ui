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
import { useMutation } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../../api/api";
import { DokumentStatus } from "../../constants/DokumentStatus";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import { FormIDokument, useDokumenterForm } from "../../pages/forsendelse/context/DokumenterFormContext";
import { IForsendelseFormProps } from "../../pages/forsendelse/context/DokumenterFormContext";
import { useSession } from "../../pages/forsendelse/context/SessionContext";
import { IDokument } from "../../types/Dokument";
import TableDraggableBody from "../table/TableDraggableBody";
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
    ({ id, dokument, forsendelseId, index, deleteDocument, listeners, attributes, style }: IDokumentRowProps, ref) => {
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
            let styles = { ...style } as CSSProperties;

            if (dokument.status == DokumentStatus.SLETTET) {
                styles = { ...style, backgroundColor: "var(--a-red-50)" };
            } else if (dokument.lagret == false) {
                styles = { ...style, backgroundColor: "var(--a-green-50)" };
            }

            return styles;
        };

        return (
            <Table.Row
                key={index + dokumentreferanse + journalpostId}
                ref={ref}
                {...listeners}
                {...attributes}
                style={getRowStyle()}
                className={`dokument-row ${errors.dokumenter?.[index]?.message ? "error" : ""}`}
            >
                <Table.DataCell style={{ width: "1%" }} className={"cursor-all-scroll"}>
                    <DragVerticalIcon />
                </Table.DataCell>
                <Table.DataCell style={{ width: "1%" }}>{dokindex + 1}</Table.DataCell>
                <Table.DataCell scope="row" style={{ width: "30%" }}>
                    <EditableDokumentTitle dokument={dokument} index={index} />
                </Table.DataCell>
                <Table.DataCell style={{ width: "5%" }}>{dayjs(dokumentDato).format("DD.MM.YYYY")}</Table.DataCell>
                <Table.DataCell style={{ width: "3%" }}>
                    <DokumentStatusTag status={status} />
                </Table.DataCell>
                <Table.DataCell style={{ width: "1%" }}>
                    <div className={"flex flex-row gap-1 justify-end"}>
                        {dokument.status == "KONTROLLERT" && (
                            <Button
                                size={"small"}
                                variant={"tertiary"}
                                icon={<EyeIcon />}
                                onClick={() =>
                                    OpenDocumentUtils.åpneDokument(`BIF-${forsendelseId}`, dokumentreferanse)
                                }
                            />
                        )}
                        <OpenDokumentButton
                            dokumentreferanse={dokument.dokumentreferanse}
                            journalpostId={"BIF-" + forsendelseId}
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
    const { forsendelseId } = useSession();
    const enableBlurEvent = useRef(false);
    const oppdaterDokumentTittelFn = useMutation({
        mutationFn: (tittel: string) =>
            BIDRAG_FORSENDELSE_API.api.oppdaterDokument(forsendelseId, dokument.dokumentreferanse, { tittel }),
    });
    const {
        register,
        setValue,
        formState: { errors },
    } = useFormContext<IForsendelseFormProps>();
    const value = useWatch({ name: `dokumenter.${index}.tittel` });

    function updateTitle(e) {
        if (enableBlurEvent.current == false) return;
        setInEditMode(false);
        oppdaterDokumentTittelFn.mutate(value);
        enableBlurEvent.current = false;
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.code == "Escape") {
            setInEditMode(false);
            setValue(`dokumenter.${index}.tittel`, dokument.tittel);
        }
    }
    return (
        <div
            tabIndex={-1}
            style={{ width: "100%" }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setTimeout(() => (enableBlurEvent.current = true), 500);
                setInEditMode(true);
            }}
            onBlur={updateTitle}
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
