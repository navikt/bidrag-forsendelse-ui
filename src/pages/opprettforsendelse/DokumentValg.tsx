import { Heading, Radio, RadioGroup, Table, Tabs } from "@navikt/ds-react";

import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import { useOpprettForsendelse } from "./OpprettForsendelseContext";
import { useOpprettForsendelseFormContext } from "./OpprettForsendelsePage";
interface TableRowData {
    malId: string;
    tittel: string;
    type: "UTGÅENDE" | "NOTAT";
}

export default function DokumentValg() {
    const options = useOpprettForsendelse();
    const { data: dokumentDetaljer, isFetching } = useForsendelseApi().dokumentMalDetaljer(options);
    const { register, setValue } = useOpprettForsendelseFormContext();

    if (isFetching) {
        return null;
    }
    const alleBrev: TableRowData[] = Object.keys(dokumentDetaljer).map((key) => ({
        malId: key,
        tittel: dokumentDetaljer[key].beskrivelse,
        type: dokumentDetaljer[key].type,
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
                <Tabs defaultValue="utgående">
                    <Tabs.List>
                        <Tabs.Tab value="utgående" label="Utgående" />
                        <Tabs.Tab value="notat" label="Notat" />
                    </Tabs.List>
                    <Tabs.Panel value="utgående">
                        <DokumentValgTable rows={alleBrev.filter((v) => v.type == "UTGÅENDE")} />
                    </Tabs.Panel>
                    <Tabs.Panel value="notat">
                        <DokumentValgTable rows={alleBrev.filter((v) => v.type == "NOTAT")} />
                    </Tabs.Panel>
                </Tabs>
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
