import { BodyShort } from "@navikt/ds-react";
import React from "react";

import { AvvikType } from "../../../../../types/AvvikTypes";
import AvvikModalButtons from "../AvvikModalButtons";
import Bekreftelse from "../Bekreftelse";
import { AvvikTypeCommonProps } from "./AvvikTypes";

function SlettForsendelse(props: AvvikTypeCommonProps) {
    const handleSubmit = () => {
        props.sendAvvik({ type: AvvikType.SLETT_JOURNALPOST });
        props.setActiveStep(2);
    };

    return (
        <>
            {props.activeStep === 1 && (
                <>
                    <BodyShort>Slette feilbestilt forsendelse. Forsendelsen vil bli fjernet fra journalen</BodyShort>
                    <AvvikModalButtons onSubmit={handleSubmit} submitButtonLabel={"Slett"} />
                </>
            )}
            {props.activeStep === 2 && (
                <Bekreftelse>
                    <BodyShort>Forsendelse er slettet.</BodyShort>
                </Bekreftelse>
            )}
        </>
    );
}

export default SlettForsendelse;
