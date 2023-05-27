import { Alert } from "@navikt/ds-react";
import { createContext, useState } from "react";
import { PropsWithChildren } from "react";
import { useContext } from "react";

import { SOKNAD_FRA, VEDTAK_KILDE, VEDTAK_TYPE } from "../../hooks/useForsendelseApi";

interface IOpprettForsendelseContext {
    vedtakType: VEDTAK_TYPE;
    vedtakKilde: VEDTAK_KILDE;
    engangsBelopType: string;
    stonadType: string;
    behandlingType: string;
    soknadFra: SOKNAD_FRA;
    enhet?: string;
}

interface IOpprettForsendelsePropsContext {
    behandlingType: string;
    vedtakType: VEDTAK_TYPE;
    vedtakKilde: VEDTAK_KILDE;
    soknadFra: SOKNAD_FRA;
    enhet?: string;
}

export const OpprettForsendelseContext = createContext<IOpprettForsendelsePropsContext>(
    {} as IOpprettForsendelsePropsContext
);

function OpprettForsendelseProvider({
    children,
    stonadType,
    behandlingType,
    engangsBelopType,
    ...otherProps
}: PropsWithChildren<IOpprettForsendelseContext>) {
    const [errors, setErrors] = useState<string[]>([]);

    // useEffect(() => {
    //     const tempErrors = [];
    //     if (ObjectUtils.isEmpty(otherProps.vedtakType)) {
    //         tempErrors.push("Behandlingtype må settes");
    //     }
    //     if (ObjectUtils.isEmpty(otherProps.soknadFra)) {
    //         tempErrors.push("Søknadfra må settes");
    //     }
    //     if (ObjectUtils.isEmpty(otherProps.stonadType)) {
    //         tempErrors.push("Søknadtype må settes");
    //     }
    //     setErrors(tempErrors);
    // }, []);

    if (errors.length > 0) {
        return <Alert variant="error">{errors.join(", ")}</Alert>;
    }
    return (
        <OpprettForsendelseContext.Provider
            value={{
                ...otherProps,
                behandlingType: behandlingType ?? stonadType ?? engangsBelopType,
            }}
        >
            {children}
        </OpprettForsendelseContext.Provider>
    );
}
function useOpprettForsendelse() {
    const context = useContext(OpprettForsendelseContext);
    if (context === undefined) {
        throw new Error("useOpprettForsendelse must be used within a OpprettForsendelseProvider");
    }
    return context;
}

export { OpprettForsendelseProvider, useOpprettForsendelse };
