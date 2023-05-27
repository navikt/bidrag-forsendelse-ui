import { Select } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";

import useTilgangskontrollApi from "../../hooks/useTilgangskontrollApi";

export default function TemaSelect() {
    const { register, getValues } = useFormContext();

    const { data: harTilgangTilTemaFar } = useTilgangskontrollApi().harTilgangTilTemaFar();

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
    if (!harTilgangTilTemaFar) {
        return null;
    }
    return (
        <Select size="small" label="Tema" {...register("tema")} defaultValue={getValues("tema")}>
            {temaOptions.map((opt) => (
                <option value={opt.value}>{opt.label}</option>
            ))}
        </Select>
    );
}
