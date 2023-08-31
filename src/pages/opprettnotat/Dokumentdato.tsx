import { dateToDDMMYYYYString } from "@navikt/bidrag-ui-common";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export default function Dokumentdato() {
    const { register, setValue } = useFormContext();
    const { inputProps, datepickerProps } = useDatepicker({
        defaultSelected: new Date(),
        onDateChange: (val: Date) => {
            if (!val) return;
            setValue("dokumentdato", dateToDDMMYYYYString(val));
        },
    });

    useEffect(() => {
        register("dokumentdato");
    }, []);

    return (
        <DatePicker {...datepickerProps} disabled={[(date) => date > new Date()]}>
            <DatePicker.Input size="small" label="Dokumentdato" {...inputProps} name="dokumentdato" />
        </DatePicker>
    );
}
