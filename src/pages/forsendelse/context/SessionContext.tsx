import { createContext } from "react";
import { PropsWithChildren } from "react";
import { useState } from "react";
import { useContext } from "react";

interface ISessionContext {
    forsendelseId: string;
}

interface ISessionPropsContext {
    forsendelseId: string;
    sessionId: string;
    enhet: string;
}

export const SessionContext = createContext<ISessionContext>({} as ISessionContext);

function SessionProvider({ children, ...props }: PropsWithChildren<ISessionPropsContext>) {
    const [forsendelseId, setForsendelseId] = useState(props.forsendelseId);
    const [sessionId, setSessionId] = useState(props.sessionId);
    const [enhet, setEnhet] = useState(props.enhet);

    return (
        <SessionContext.Provider
            value={{
                forsendelseId,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}
function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useForsendelse must be used within a ForsendelseProvider");
    }
    return context;
}

export { SessionProvider, useSession };
