import { createContext } from "react";
import { PropsWithChildren } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

interface ISessionContext {
    forsendelseId: string;
    saksnummer: string;
    enhet: string;
    sessionId: string;
    navigateToForsendelse: (forsendelseId: string, type: "UTGÅENDE" | "NOTAT") => void;
}

interface ISessionPropsContext {
    saksnummer?: string;
    forsendelseId?: string;
    sessionId: string;
    enhet: string;
}

export const SessionContext = createContext<ISessionContext>({} as ISessionContext);

function SessionProvider({ children, ...props }: PropsWithChildren<ISessionPropsContext>) {
    const navigate = useNavigate();
    const [forsendelseId, setForsendelseId] = useState(props.forsendelseId);
    const [saksnummer, setSaksnummer] = useState(props.saksnummer);
    const [sessionId, setSessionId] = useState(props.sessionId);
    const [enhet, setEnhet] = useState(props.enhet);

    const navigateToForsendelse = (forsendelseId: string, type: "UTGÅENDE" | "NOTAT" = "UTGÅENDE") => {
        const params = new URLSearchParams();
        params.append("enhet", enhet);
        params.append("sessionState", sessionId);
        if (type == "NOTAT") {
            window.open(`/sak/${saksnummer}/journal/BIF-${forsendelseId}?${params.toString()}`, "_self");
        } else {
            navigate(`/sak/${saksnummer}/forsendelse/${forsendelseId}?${params.toString()}`);
        }
    };
    return (
        <SessionContext.Provider
            value={{
                forsendelseId,
                saksnummer,
                enhet,
                sessionId,
                navigateToForsendelse,
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
