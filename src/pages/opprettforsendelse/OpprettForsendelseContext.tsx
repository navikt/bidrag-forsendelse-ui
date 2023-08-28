import { Alert } from "@navikt/ds-react";
import { createContext, useState } from "react";
import { PropsWithChildren } from "react";
import { useContext } from "react";

import { EngangsbelopType, SoknadFra, StonadType, VedtakType } from "../../api/BidragForsendelseApi";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";

export interface IOpprettForsendelseProviderProps {
    vedtakType: VedtakType;
    soknadType: string;
    erFattetBeregnet?: boolean;
    erVedtakIkkeTilbakekreving?: boolean;
    engangsBelopType: EngangsbelopType;
    stonadType: StonadType;
    behandlingType: string;
    soknadFra: SoknadFra;
    soknadId?: string;
    vedtakId?: string;
    behandlingId?: string;
    enhet?: string;
    barnObjNr?: string[];
}

export interface IOpprettForsendelsePropsContext {
    soknadType: string;
    behandlingType: string;
    engangsBelopType: EngangsbelopType;
    stonadType: StonadType;
    vedtakType: VedtakType;
    erFattetBeregnet?: boolean;
    erVedtakIkkeTilbakekreving?: boolean;
    soknadFra: SoknadFra;
    enhet?: string;
    soknadId?: string;
    vedtakId?: string;
    behandlingId?: string;
    barn?: string[];
}

export const OpprettForsendelseContext = createContext<IOpprettForsendelsePropsContext>(
    {} as IOpprettForsendelsePropsContext
);

function OpprettForsendelseProvider({
    children,
    behandlingType,
    ...otherProps
}: PropsWithChildren<IOpprettForsendelseProviderProps>) {
    const [errors, setErrors] = useState<string[]>([]);
    const roller = useForsendelseApi().hentRoller();

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

    function isSameRole(urlObjNr: string, rolleObjNr: string) {
        return urlObjNr == rolleObjNr || isEqualByIntIgnoreError(urlObjNr, rolleObjNr);
    }

    function isEqualByIntIgnoreError(valueA: string, valueB: string) {
        try {
            return parseInt(valueA) == parseInt(valueB);
        } catch (e) {
            return false;
        }
    }
    if (errors.length > 0) {
        return <Alert variant="error">{errors.join(", ")}</Alert>;
    }
    return (
        <OpprettForsendelseContext.Provider
            value={{
                ...otherProps,
                barn: otherProps.barnObjNr?.map(
                    (objNr) => roller.find((rolle) => isSameRole(rolle.objektnummer, objNr))?.ident
                ),
                behandlingType: behandlingType ?? otherProps.stonadType ?? otherProps.engangsBelopType,
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
