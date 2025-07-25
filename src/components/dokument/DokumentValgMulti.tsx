import { removeNonPrintableCharachters } from "@navikt/bidrag-ui-common";
import { Checkbox, CheckboxGroup, Heading, Table, Textarea } from "@navikt/ds-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { DokumentMalDetaljer } from "../../api/BidragForsendelseApi";
import environment from "../../environment";
import { DokumentFormProps, DokumentValgTableHeader } from "./DokumentValg";

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
        tittel: malDetaljer[key].tittel,
        type: malDetaljer[key].type,
    }));

    register("dokumenter", {
        validate: (value: DokumentFormProps[]) => {
            const valgteDokumenter = value.filter((v) => v !== undefined);
            const harValgtDokument = valgteDokumenter.length > 0;
            if (!harValgtDokument) return "Minst et dokument må velges";
            const harAlleDokumenterTittel = valgteDokumenter.every(
                (dok) => dok.tittel != null && dok.tittel.trim().length > 0
            );
            if (!harAlleDokumenterTittel) return "Tittel på notat kan ikke være tom";
            return true;
        },
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
            <DokumentValgTableHeader />
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
        const titlePrintable = removeNonPrintableCharachters(title);
        setTitle(titlePrintable);
        setValue(`dokumenter.${index}.tittel`, titlePrintable);
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
            {environment.feature.visDokumentmalKode && <Table.DataCell width="1%">{row.malId}</Table.DataCell>}
            <Table.DataCell width="100%">
                <EditableTitle index={index} malId={row.malId} tittel={row.tittel} onTitleChange={onTitleChange} />
            </Table.DataCell>
        </Table.Row>
    );
}

interface EditableTitleProps {
    index: number;
    malId: string;
    tittel: string;
    onTitleChange: (tittel: string) => void;
}
function EditableTitle({ malId, tittel, onTitleChange, index }: EditableTitleProps) {
    const isChecked = useWatch({ name: `dokumenter.${index}` });
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
            disabled={!isChecked}
            hideLabel
            onChange={(e) => onTitleChange(e.target.value)}
        />
    );
}
