import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { DraggableProvidedDraggableProps } from "@hello-pangea/dnd";
import { DragDropContext } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import { Draggable } from "@hello-pangea/dnd";
import { DropResult } from "@hello-pangea/dnd";
import { ResponderProvided } from "@hello-pangea/dnd";
import { Table } from "@navikt/ds-react";
import { Button } from "@navikt/ds-react";
import dayjs from "dayjs";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import { Dokument } from "../../types/forsendelseInternal";
import { dokumentstatusDisplayValue } from "../../types/forsendelseInternal";
import DeleteDokumentButton from "./DeleteDokumentButton";
import LeggTilDokumentKnapp from "./LeggTilDokumentKnapp";
import OpenDokumentButton from "./OpenDokumentButton";

interface IDokumentRaderProps {
    dokumenter: Dokument[];
    forsendelseId: string;
}
export default function DokumentRader({ dokumenter, forsendelseId }: IDokumentRaderProps) {
    const [renderedDocuments, setRenderedDocuments] = useState<Dokument[]>([...dokumenter]);
    const [hasChanged, setHasChanged] = useState<boolean>(false);

    useEffect(() => {
        setHasChanged(false);
        setRenderedDocuments(dokumenter);
    }, [dokumenter]);
    function onDocumentsChange(result: DropResult, provided: ResponderProvided) {
        if (result.reason == "DROP") {
            setRenderedDocuments((r) => arrayMove(r, result.source.index, result.destination.index));
            setHasChanged(true);
        }
    }

    function arrayMove(array: any[], oldIndex: number, newIndex: number) {
        const updatedArray = [...array];
        const [element] = updatedArray.splice(oldIndex, 1);

        // insert the element at the new position
        updatedArray.splice(newIndex, 0, element);
        return updatedArray;
    }

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        // change background colour if dragging
        background: isDragging ? "var(--a-gray-100)" : "initial",

        // styles we need to apply on draggables
        ...draggableStyle,
    });

    return (
        <>
            {" "}
            <DragDropContext onDragEnd={onDocumentsChange}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <Table.Body
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ display: "block", overflowY: "auto", maxHeight: "40vh" }}
                        >
                            {renderedDocuments.map((dokument, i) => (
                                <Draggable
                                    key={dokument.dokumentreferanse}
                                    draggableId={dokument.dokumentreferanse}
                                    index={i}
                                >
                                    {(provided, snapshot) => (
                                        <DokumentRow
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                            dokument={dokument}
                                            forsendelseId={forsendelseId}
                                            index={i}
                                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                        />
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Table.Body>
                    )}
                </Droppable>
            </DragDropContext>
            <div>
                <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
                    {hasChanged && (
                        <>
                            <Button variant={"secondary"} size={"small"}>
                                Bekreft
                            </Button>
                            <Button variant={"tertiary"} size={"small"}>
                                Angre
                            </Button>
                        </>
                    )}
                    <div className={"ml-auto"}>
                        <LeggTilDokumentKnapp />
                    </div>
                </div>
            </div>
        </>
    );
}

interface IDokumentRowProps extends DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps {
    index: number;
    dokument: Dokument;
    forsendelseId: string;
}
const DokumentRow = React.forwardRef<HTMLTableRowElement, IDokumentRowProps>(
    ({ dokument, forsendelseId, index, ...otherProps }: IDokumentRowProps, ref) => {
        const { tittel, status, journalpostId, dokumentreferanse, dokumentmalId, dokumentDato } = dokument;
        return (
            <Table.Row key={index + dokumentreferanse} ref={ref} {...otherProps}>
                <Table.DataCell style={{ width: "1%" }}>{index + 1}</Table.DataCell>
                <Table.HeaderCell scope="row" style={{ width: "15%" }}>
                    {tittel}
                </Table.HeaderCell>
                <Table.DataCell style={{ width: "5%" }}>{dayjs(dokumentDato).format("DD.MM.YYYY")}</Table.DataCell>
                <Table.DataCell style={{ width: "5%" }}>{dokumentstatusDisplayValue(status)}</Table.DataCell>
                <Table.DataCell style={{ width: "3%" }}>
                    <div className={"flex flex-row gap-1"}>
                        <OpenDokumentButton dokument={dokument} forsendelseId={forsendelseId} />
                        <DeleteDokumentButton dokument={dokument} forsendelseId={forsendelseId} />
                    </div>
                </Table.DataCell>
            </Table.Row>
        );
    }
);
