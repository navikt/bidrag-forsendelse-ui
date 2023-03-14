import { ErrorSummary } from "@navikt/ds-react";
import ErrorSummaryItem from "@navikt/ds-react/esm/form/error-summary/ErrorSummaryItem";
import { useFormContext } from "react-hook-form";

import { IForsendelseFormProps } from "../pages/forsendelse/context/DokumenterFormContext";

export default function ValidationErrorSummary() {
    const {
        formState: { errors },
    } = useFormContext<IForsendelseFormProps>();

    if ((!errors.dokumenter || errors.dokumenter.length == 0) && !errors.root?.message) {
        return null;
    }

    function getAllErrors() {
        let allErrors = [];
        if (errors.dokumenter) {
            allErrors = allErrors.concat(errors.dokumenter?.map((err) => err?.message));
        }
        if (errors.root?.message) {
            allErrors = allErrors.concat([errors.root?.message]);
        }
        return allErrors.filter((error) => error && error.trim().length > 0);
    }
    return (
        <ErrorSummary heading={"Følgende må rettes opp før forsendelse kan distribueres"}>
            {getAllErrors()?.map((err) => (
                <ErrorSummaryItem>{err}</ErrorSummaryItem>
            ))}
        </ErrorSummary>
    );
}
