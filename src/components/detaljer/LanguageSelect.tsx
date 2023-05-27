import { Select } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";

export default function LanguageSelect() {
    const { register, getValues } = useFormContext();

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
