import ObjectUtils from "@navikt/bidrag-ui-common/esm/utils/ObjectUtils";
import { Alert } from "@navikt/ds-react";
import { createContext, useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import { useContext } from "react";

import { BEHANDLING_TYPE, SOKNAD_FRA, SOKNAD_TYPE } from "../../hooks/useForsendelseApi";

interface IOpprettForsendelseContext {
    behandlingType: BEHANDLING_TYPE;
    soknadType: SOKNAD_TYPE;
    soknadFra: SOKNAD_FRA;
    klage?: boolean;
    erVedtakFattet?: boolean;
    manuelBeregning?: boolean;
}

interface IOpprettForsendelsePropsContext {
    behandlingType: BEHANDLING_TYPE;
    soknadType: SOKNAD_TYPE;
    soknadFra: SOKNAD_FRA;
    klage?: boolean;
    erVedtakFattet?: boolean;
    manuelBeregning?: boolean;
}

export const OpprettForsendelseContext = createContext<IOpprettForsendelseContext>({} as IOpprettForsendelseContext);

function OpprettForsendelseProvider({ children, ...otherProps }: PropsWithChildren<IOpprettForsendelseContext>) {
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const tempErrors = [];
        if (ObjectUtils.isEmpty(otherProps.behandlingType)) {
            tempErrors.push("Behandlingtype må settes");
        }
        if (ObjectUtils.isEmpty(otherProps.soknadFra)) {
            tempErrors.push("Søknadfra må settes");
        }
        if (ObjectUtils.isEmpty(otherProps.soknadType)) {
            tempErrors.push("Søknadtype må settes");
        }
        setErrors(tempErrors);
    }, []);

    if (errors.length > 0) {
        return <Alert variant="error">{errors.join(", ")}</Alert>;
    }
    return <OpprettForsendelseContext.Provider value={otherProps}>{children}</OpprettForsendelseContext.Provider>;
}
function useOpprettForsendelse() {
    const context = useContext(OpprettForsendelseContext);
    if (context === undefined) {
        throw new Error("useOpprettForsendelse must be used within a OpprettForsendelseProvider");
    }
    return context;
}

export { OpprettForsendelseProvider, useOpprettForsendelse };
