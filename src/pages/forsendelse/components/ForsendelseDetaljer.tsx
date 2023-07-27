import "./ForsendelseDetaljer.css";

import { dateToDDMMYYYYString } from "@navikt/bidrag-ui-common";
import { BodyLong, Label } from "@navikt/ds-react";

import { useForsendelseApi } from "../../../hooks/useForsendelseApi";
export default function ForsendelseDetaljer() {
    const forsendelse = useForsendelseApi().hentForsendelse();
    return (
        <div>
            {/* <Heading size="small">Andre detaljer</Heading> */}
            <div className="h-px w-full bg-border-divider" />
            <div className="flex flex-row static_data">
                <DetailsGrid
                    rows={[
                        {
                            label: "Enhet",
                            value: forsendelse.enhet,
                        },
                        {
                            label: "Tema",
                            value: forsendelse.tema == "FAR" ? "Foreldreskap" : "Bidrag",
                        },
                        {
                            label: "Opprettet dato",
                            value: dateToDDMMYYYYString(new Date(forsendelse.opprettetDato)),
                        },
                        {
                            label: "Opprettet av",
                            value: forsendelse.opprettetAvIdent,
                        },
                    ]}
                />
            </div>
        </div>
    );
}

interface DetailsColumnProps {
    rows: {
        label: string;
        value: string;
    }[];
}
function DetailsGrid({ rows }: DetailsColumnProps) {
    return (
        <dl className="forsendelse_description_list">
            {rows.map((row) => (
                <BodyLong key={row.value + row.label}>
                    <dt>
                        <Label>{row.label}</Label>
                    </dt>
                    <dd>{row.value}</dd>
                </BodyLong>
            ))}
        </dl>
    );
}
