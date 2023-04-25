import { Heading, Select } from "@navikt/ds-react";

import { useOpprettForsendelseFormContext } from "./OpprettForsendelsePage";

export default function LanguageAndTemaSelect() {
    return (
        <div>
            <Heading spacing size="small">
                Andre detaljer
            </Heading>
            <div className="flex flex-row gap-4 pb-4">
                <LanguageSelect />
                <TemaSelect />
            </div>
        </div>
    );
}
function TemaSelect() {
    const { register, getValues } = useOpprettForsendelseFormContext();

    const temaOptions = [
        {
            label: "Bidrag",
            value: "BID",
        },
        {
            label: "Farskap",
            value: "FAR",
        },
    ];
    return (
        <Select size="small" label="Tema" {...register("tema")} defaultValue={getValues("tema")}>
            {temaOptions.map((opt) => (
                <option value={opt.value}>{opt.label}</option>
            ))}
        </Select>
    );
}

function LanguageSelect() {
    const { register, getValues } = useOpprettForsendelseFormContext();

    const languageOptions = [
        {
            label: "Bokmål",
            value: "NB",
        },
        {
            label: "Nynorsk",
            value: "NN",
        },
        {
            label: "Engelsk",
            value: "EN",
        },
        {
            label: "Tysk",
            value: "DE",
        },
        {
            label: "Fransk",
            value: "FR",
        },
    ];
    return (
        <Select size="small" label="Språk" {...register("språk")} defaultValue={getValues("språk")}>
            {languageOptions.map((opt) => (
                <option value={opt.value}>{opt.label}</option>
            ))}
        </Select>
    );
}
