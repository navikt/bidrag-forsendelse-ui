import { createContext } from "react";
import { PropsWithChildren } from "react";
import { useState } from "react";
import { useContext } from "react";

interface ISessionContext {
    forsendelseId: string;
    saksnummer: string;
    enhet: string;
    sessionId: string;
}

interface ISessionPropsContext {
    saksnummer?: string;
    forsendelseId?: string;
    sessionId: string;
    enhet: string;
}

export const SessionContext = createContext<ISessionContext>({} as ISessionContext);

function SessionProvider({ children, ...props }: PropsWithChildren<ISessionPropsContext>) {
    const [forsendelseId, setForsendelseId] = useState(props.forsendelseId);
    const [saksnummer, setSaksnummer] = useState(props.saksnummer);
    const [sessionId, setSessionId] = useState(props.sessionId);
    const [enhet, setEnhet] = useState(props.enhet);

    return (
        <SessionContext.Provider
            value={{
                forsendelseId,
                saksnummer,
                enhet,
                sessionId,
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
