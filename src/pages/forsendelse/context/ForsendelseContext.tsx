import { createContext } from "react";
import { PropsWithChildren } from "react";
import { useState } from "react";
import { useContext } from "react";

interface IForsendelseContext {
    forsendelseId: string;
}

interface IForsendelsePropsContext {
    forsendelseId: string;
    sessionId: string;
    enhet: string;
}

export const ForsendelseContext = createContext<IForsendelseContext>({} as IForsendelseContext);

function ForsendelseProvider({ children, ...props }: PropsWithChildren<IForsendelsePropsContext>) {
    const [forsendelseId, setForsendelseId] = useState(props.forsendelseId);
    const [sessionId, setSessionId] = useState(props.sessionId);
    const [enhet, setEnhet] = useState(props.enhet);

    return (
        <ForsendelseContext.Provider
            value={{
                forsendelseId,
            }}
        >
            {children}
        </ForsendelseContext.Provider>
    );
}
function useForsendelse() {
    const context = useContext(ForsendelseContext);
    if (context === undefined) {
        throw new Error("useForsendelse must be used within a ForsendelseProvider");
    }
    return context;
}

export { ForsendelseProvider, useForsendelse };
