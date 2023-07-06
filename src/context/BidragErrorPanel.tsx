import { XMarkIcon } from "@navikt/aksel-icons";
import { Alert, Button, Heading } from "@navikt/ds-react";

import { useErrorContext } from "./ErrorProvider";
export default function BidragErrorPanel() {
    const { errorMessage, resetError } = useErrorContext();

    if (!errorMessage) return null;
    return (
        <Alert variant="error" size="small" className="w-2/3 relative mt-3">
            <div>
                <Heading size="small">Det skjedde en feil</Heading>
                {errorMessage}
            </div>
            <Button
                size="small"
                icon={<XMarkIcon />}
                variant="tertiary-neutral"
                onClick={resetError}
                className="absolute top-0 right-0"
            ></Button>
        </Alert>
    );
}
