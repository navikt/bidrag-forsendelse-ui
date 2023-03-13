import { Droppable } from "@hello-pangea/dnd";
import { Draggable } from "@hello-pangea/dnd";
import { DragDropContext } from "@hello-pangea/dnd";
import { DropResult } from "@hello-pangea/dnd";
import { ResponderProvided } from "@hello-pangea/dnd";
import { DraggableProvided } from "@hello-pangea/dnd";
import { DraggableStateSnapshot } from "@hello-pangea/dnd";
import { Table } from "@navikt/ds-react";
import React from "react";
import { ReactNode } from "react";

export type TableDraggableBodyChildrenFn<T> = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
    dokument: T,
    index: number
) => ReactNode | null;
interface ITableDraggableBodyProps<T> {
    onChange: (result: DropResult, provided: ResponderProvided) => void;
    rowData: T[];
    getRowKey: (data: T) => string;
    children: TableDraggableBodyChildrenFn<T>;
}
export default function TableDraggableBody<T>({ children, onChange, rowData, getRowKey }: ITableDraggableBodyProps<T>) {
    return (
        <DragDropContext onDragEnd={onChange}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <Table.Body {...provided.droppableProps} ref={provided.innerRef} style={{ overflowY: "auto" }}>
                        {rowData.map((data, i) => (
                            <Draggable key={getRowKey(data)} draggableId={getRowKey(data)} index={i}>
                                {(provided, snapshot) => children(provided, snapshot, data, i)}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Table.Body>
                )}
            </Droppable>
        </DragDropContext>
    );
}
