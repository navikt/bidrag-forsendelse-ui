import { CustomError, RedirectTo } from "@navikt/bidrag-ui-common";
import ObjectUtils from "@navikt/bidrag-ui-common/esm/utils/ObjectUtils";
import { createContext, useEffect } from "react";
import { PropsWithChildren } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

interface ISessionContext {
    forsendelseId: string;
    forsendelseIdMedPrefix: string;
    saksnummer: string;
    enhet: string;
    sessionId: string;
    navigateToForsendelse: (forsendelseId: string, type: "UTGÅENDE" | "NOTAT", erFerdigstilt?: boolean) => void;
    navigateToJournalpost: (journalpostId: string) => void;
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

    useEffect(() => {
        if (ObjectUtils.isEmpty(enhet)) {
            throw new CustomError(
                "UserError",
                "",
                "Mangler pålogget enhet på url. " +
                    "Dette blir lagt til hvis bruker ble videresendt fra Bisys. " +
                    "Hvis bruker har gjort noe endringer på URL så bør ikke enhet= fjernes fra URL da denne informasjonen blir brukt under opprettelse av forsendelse",
                ""
            );
        }
    }, []);

    const navigateToForsendelse = (forsendelseId: string, type: "UTGÅENDE" | "NOTAT" = "UTGÅENDE") => {
        const params = new URLSearchParams();
        params.append("enhet", enhet);
        params.append("sessionState", sessionId);
        if (type == "NOTAT") {
            RedirectTo.sakshistorikk(saksnummer, sessionId);
        } else {
            navigate(`/sak/${saksnummer}/forsendelse/${forsendelseId}?${params.toString()}`);
        }
    };

    const navigateToJournalpost = (journalpostId: string) => {
        const params = new URLSearchParams();
        params.append("enhet", enhet);
        params.append("sessionState", sessionId);
        window.open(`/sak/${saksnummer}/journal/JOARK-${journalpostId}?${params.toString()}`, "_self");
    };
    return (
        <SessionContext.Provider
            value={{
                forsendelseId,
                forsendelseIdMedPrefix: `BIF-${forsendelseId?.replace(/\D/g, "")}`,
                saksnummer,
                enhet,
                sessionId,
                navigateToForsendelse,
                navigateToJournalpost,
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
