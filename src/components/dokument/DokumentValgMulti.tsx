import { Checkbox, CheckboxGroup, Heading, Table, Textarea } from "@navikt/ds-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { DokumentMalDetaljer } from "../../api/BidragForsendelseApi";
import { DokumentFormProps } from "./DokumentValg";

interface TableRowData {
    malId: string;
    tittel: string;
    type: "UTGÅENDE" | "NOTAT";
}

interface DokumentValgProps {
    malDetaljer: Record<string, DokumentMalDetaljer>;
    showLegend?: boolean;
}
export default function DokumentValgMulti({ malDetaljer, showLegend }: DokumentValgProps) {
    const {
        formState: { errors },
        register,
    } = useFormContext<{
        dokumenter: DokumentFormProps[];
    }>();

    const alleBrev: TableRowData[] = Object.keys(malDetaljer).map((key) => ({
        malId: key,
        tittel: malDetaljer[key].beskrivelse,
        type: malDetaljer[key].type,
    }));

    register("dokumenter", {
        validate: (value: DokumentFormProps[]) =>
            value.filter((v) => v != undefined).length == 0 ? "Minst et dokument må velges" : true,
    });

    return (
        <div className="w-100">
            <CheckboxGroup
                legend={showLegend && <Heading size="small">Velg dokument</Heading>}
                error={errors?.dokumenter?.message}
            >
                <DokumentValgTable rows={alleBrev} />
            </CheckboxGroup>
        </div>
    );
}

interface IDokumentValgTableProps {
    rows: TableRowData[];
}
function DokumentValgTable({ rows }: IDokumentValgTableProps) {
    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell>Mal</Table.HeaderCell>
                    <Table.HeaderCell>Tittel</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <DokumentValgTableRows rows={rows} />
        </Table>
    );
}

interface DokumentValgTableProps {
    rows: TableRowData[];
}
function DokumentValgTableRows({ rows }: DokumentValgTableProps) {
    return (
        <Table.Body>
            {rows.map((row, index) => (
                <DokumentRow index={index} row={row} />
            ))}
        </Table.Body>
    );
}

interface DokumentRowProps {
    row: TableRowData;
    index: number;
}
function DokumentRow({ row, index }: DokumentRowProps) {
    const [title, setTitle] = useState<string>(row.tittel);
    const { register, setValue, resetField } = useFormContext<{
        dokumenter: DokumentFormProps[];
    }>();
    const methods = register(`dokumenter.${index}`);
    function updateValues(malId: string, checked: boolean) {
        if (checked) {
            setValue(`dokumenter.${index}`, {
                malId,
                tittel: title,
                type: row.type,
            });
        } else {
            resetField(`dokumenter.${index}`);
        }
    }
    function onTitleChange(title: string) {
        setTitle(title);
        setValue(`dokumenter.${index}.tittel`, title);
    }
    return (
        <Table.Row key={row.malId}>
            <Table.DataCell width={"1%"}>
                <Checkbox
                    size="small"
                    value={row.malId}
                    onBlur={(e) => {
                        methods.onBlur(e);
                        // @ts-ignore
                        const malId = e.target.value;
                        updateValues(malId, e.target.checked);
                    }}
                    onChange={(event) => {
                        methods.onChange(event);
                        updateValues(event.target.value, event.target.checked);
                    }}
                >
                    {""}
                </Checkbox>
            </Table.DataCell>
            <Table.DataCell width="1%">{row.malId}</Table.DataCell>
            <Table.DataCell width="100%">
                <EditableTitle malId={row.malId} tittel={row.tittel} onTitleChange={onTitleChange} />
            </Table.DataCell>
        </Table.Row>
    );
}

interface EditableTitleProps {
    malId: string;
    tittel: string;
    onTitleChange: (tittel: string) => void;
}
function EditableTitle({ malId, tittel, onTitleChange }: EditableTitleProps) {
    function shouldBeEditable() {
        const MALID_TITTLE_REDIGERBAR = ["BI01X02", "BI01X01", "BI01P11", "BI01S02"];
        return MALID_TITTLE_REDIGERBAR.includes(malId);
    }

    if (!shouldBeEditable()) {
        return tittel;
    }
    return (
        <Textarea
            maxRows={2}
            minRows={1}
            label="Tittel"
            defaultValue={tittel}
            size="small"
            hideLabel
            onChange={(e) => onTitleChange(e.target.value)}
        />
    );
}
