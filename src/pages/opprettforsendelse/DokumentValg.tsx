import { Heading, Radio, RadioGroup, Table, Tabs } from "@navikt/ds-react";

import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import { useOpprettForsendelseFormContext } from "./OpprettForsendelsePage";

export default function DokumentValg() {
    const { data: dokumentDetaljer, isFetching } = useForsendelseApi().dokumentMalDetaljer();
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
                        <Table size="small" width={"200px"}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell></Table.HeaderCell>
                                    <Table.HeaderCell>Mal</Table.HeaderCell>
                                    <Table.HeaderCell>Tittel</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <DokumentValgTable rows={alleBrev.filter((v) => v.type == "UTGÅENDE")} />
                        </Table>
                    </Tabs.Panel>
                    <Tabs.Panel value="notat">
                        <Table size="small">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell></Table.HeaderCell>
                                    <Table.HeaderCell>Mal</Table.HeaderCell>
                                    <Table.HeaderCell>Tittel</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <DokumentValgTable rows={alleBrev.filter((v) => v.type == "NOTAT")} />
                        </Table>
                    </Tabs.Panel>
                </Tabs>
            </RadioGroup>
        </div>
    );
}

interface TableRowData {
    malId: string;
    tittel: string;
    type: "UTGÅENDE" | "NOTAT";
}

interface DokumentValgTableProps {
    rows: TableRowData[];
}
function DokumentValgTable({ rows }: DokumentValgTableProps) {
    const { register, setValue, getValues } = useOpprettForsendelseFormContext();
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
