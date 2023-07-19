import { Select } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";

import useTilgangskontrollApi from "../../hooks/useTilgangskontrollApi";
import { useSession } from "../../pages/forsendelse/context/SessionContext";

export default function TemaSelect() {
    const { register, getValues } = useFormContext();
    const { enhet } = useSession();

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
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </Select>
    );
}
