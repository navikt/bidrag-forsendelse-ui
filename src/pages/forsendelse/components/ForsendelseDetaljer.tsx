import { BodyShort, Heading, Label } from "@navikt/ds-react";

import { useForsendelseApi } from "../../../hooks/useForsendelseApi";

export default function ForsendelseDetaljer() {
    const forsendelse = useForsendelseApi().hentForsendelse();
    return (
        <div>
            <Heading size="small">Forsendelse detaljer</Heading>
            <table width={"250px"}>
                <thead>
                    <tr>
                        <th style={{ width: "50%" }}></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <TableRow label="Enhet" value={forsendelse.enhet} />
                    <TableRow label="Opprettet dato" value={forsendelse.opprettetDato} />
                    <TableRow label="Tema" value={forsendelse.tema} />
                </tbody>
            </table>
        </div>
    );
}

type TableRowProps = {
    label: string;
    value: string;
};
function TableRow({ label, value }: TableRowProps) {
    return (
        <tr>
            <td>
                <Label size="small">{label}</Label>
            </td>
            <td>
                <BodyShort size="small">{value}</BodyShort>
            </td>
        </tr>
    );
}
