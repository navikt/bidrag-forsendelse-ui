import { Heading, Radio, RadioGroup, Table } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";

import { DokumentMalDetaljer } from "../../api/BidragForsendelseApi";

interface TableRowData {
    malId: string;
    tittel: string;
    type: "UTGÅENDE" | "NOTAT";
}

interface DokumentValgProps {
    malDetaljer: Record<string, DokumentMalDetaljer>;
}
export default function DokumentValg({ malDetaljer }: DokumentValgProps) {
    const { register, setValue } = useFormContext();

    const alleBrev: TableRowData[] = Object.keys(malDetaljer).map((key) => ({
        malId: key,
        tittel: malDetaljer[key].beskrivelse,
        type: malDetaljer[key].type,
    }));

    function updateValues(malId?: string) {
        const dokument = alleBrev.find((d) => d.malId == malId);
        if (dokument) {
            setValue("dokument.malId", malId);
            setValue("dokument.tittel", dokument.tittel);
            setValue("dokument.type", dokument.type);
        }
    }

    const methods = register("dokument.malId");
    return (
        <div className="w-9/12">
            <RadioGroup
                legend={<Heading size="small">Velg dokument</Heading>}
                {...methods}
                onBlur={(e) => {
                    methods.onBlur(e);
                    // @ts-ignore
                    const malId = e.target.value;
                    updateValues(malId);
                }}
                onChange={(malId) => {
                    methods.onChange({ target: { value: malId } });
                    updateValues(malId);
                }}
            >
                <DokumentValgTable rows={alleBrev} />
            </RadioGroup>
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
            {rows.map((row) => (
                <Table.Row key={row.malId}>
                    <Table.DataCell width={"1%"}>
                        <Radio size="small" value={row.malId}>
                            {""}
                        </Radio>
                    </Table.DataCell>
                    <Table.DataCell width="1%">{row.malId}</Table.DataCell>
                    <Table.DataCell width="100%">{row.tittel}</Table.DataCell>
                </Table.Row>
            ))}
        </Table.Body>
    );
}
