import { ErrorSummary } from "@navikt/ds-react";
import ErrorSummaryItem from "@navikt/ds-react/esm/form/error-summary/ErrorSummaryItem";

import { useError } from "../pages/forsendelse/context/ErrorContext";

export default function ValidationErrorSummary() {
    const { validationErrors } = useError();

    if (validationErrors.length == 0) {
        return null;
    }

    return (
        <ErrorSummary>
            {validationErrors.map((err) => (
                <ErrorSummaryItem>{err}</ErrorSummaryItem>
            ))}
        </ErrorSummary>
    );
}
