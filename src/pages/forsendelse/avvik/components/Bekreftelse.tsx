import { Loader } from "@navikt/ds-react";
import { Alert } from "@navikt/ds-react";
import { ReactNode } from "react";

import { useAvvikStateContext } from "./AvvikshandteringModal";

interface BekreftelseProps {
    children: ReactNode;
}

function Bekreftelse(props: BekreftelseProps) {
    const { sendAvvikStatus } = useAvvikStateContext();

    if (sendAvvikStatus == "loading") {
        return (
            <div className="AvvikshandteringModal__spinner-wrapper">
                <Loader transparent={true} type="XL" aria-label="Utfører avvik" />
            </div>
        );
    } else if (sendAvvikStatus === "error") {
        return (
            <Alert variant={"error"}>En feil har oppstått ved utføring av avvik. Avviket har ikke blir lagret.</Alert>
        );
    } else {
        return <Alert variant="success">{props.children}</Alert>;
    }
}

export default Bekreftelse;
