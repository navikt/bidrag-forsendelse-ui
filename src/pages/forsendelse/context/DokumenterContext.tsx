import { createContext } from "react";
import { PropsWithChildren } from "react";
import { useState } from "react";
import { useContext } from "react";

import { Dokument } from "../../../types/forsendelseInternal";

interface IDokumenterContext {
    forsendelseId: string;
    oppdaterteDokumenter: Dokument[];
}

interface IDokumenterPropsContext {
    forsendelseId: string;
    dokumenter: Dokument[];
}

export const DokumenterContext = createContext<IDokumenterContext>({} as IDokumenterContext);

function DokumenterProvider({ children, ...props }: PropsWithChildren<IDokumenterPropsContext>) {
    const [renderedDocuments, setRenderedDocuments] = useState<Dokument[]>([...props.dokumenter]);

    return (
        <DokumenterContext.Provider
            value={{
                forsendelseId: props.forsendelseId,
                oppdaterteDokumenter: renderedDocuments,
            }}
        >
            {children}
        </DokumenterContext.Provider>
    );
}
function useDokumenter() {
    const context = useContext(DokumenterContext);
    if (context === undefined) {
        throw new Error("useDokumenter must be used within a ForsendelseProvider");
    }
    return context;
}

export { DokumenterProvider, useDokumenter };
