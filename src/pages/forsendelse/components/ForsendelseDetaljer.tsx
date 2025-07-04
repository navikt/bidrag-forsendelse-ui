import "./ForsendelseDetaljer.css";

import { dateToDDMMYYYYString } from "@navikt/bidrag-ui-common";
import { BodyLong, Label } from "@navikt/ds-react";

import { mapToDistribusjonKanalBeskrivelse } from "../../../helpers/forsendelseHelpers";
import { useDistribusjonKanal } from "../../../hooks/useDokumentApi";
import { useHentForsendelseQuery } from "../../../hooks/useForsendelseApi";
export default function ForsendelseDetaljer() {
    const forsendelse = useHentForsendelseQuery();
    const distribusjonKanal = useDistribusjonKanal();

    return (
        <div>
            {/* <Heading size="small">Andre detaljer</Heading> */}
            <div className="h-px w-full bg-border-divider mt-2 mb-2" />
            <div className="flex flex-row static_data">
                <DetailsGrid
                    rows={[
                        {
                            label: "Tema",
                            value: forsendelse.tema === "FAR" ? "Foreldreskap" : "Bidrag",
                        },
                        {
                            label: "Opprettet dato",
                            value: dateToDDMMYYYYString(new Date(forsendelse.opprettetDato)),
                        },
                        {
                            label: "Opprettet av",
                            value: forsendelse.opprettetAvNavn,
                        },
                        {
                            label: "Distribusjonskanal",
                            value: mapToDistribusjonKanalBeskrivelse(distribusjonKanal.distribusjonskanal),
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
