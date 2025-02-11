import { SecuritySessionUtils } from "@navikt/bidrag-ui-common";
import { useQuery } from "@tanstack/react-query";
import { useFlag, useUnleashClient } from "@unleash/proxy-client-react";
import { useEffect } from "react";

export default function useFeatureToogle() {
    const isMockEnabled = process.env.ENABLE_MOCK === "true";
    const enableEttersendingsoppgave = useFlag("forsendelse.ettersendingsoppgave");
    const utvikler = useFlag("bidrag.utvikler");
    const client = useUnleashClient();
    const { data: userId } = useQuery({
        queryKey: ["user"],
        queryFn: async () => SecuritySessionUtils.hentSaksbehandlerId(),
        initialData: () => (isMockEnabled ? "" : undefined),
        staleTime: isMockEnabled ? 0 : Infinity,
    });

    useEffect(() => {
        client.updateContext({
            userId,
        });
    }, [userId]);

    useEffect(() => {
        console.debug("enableEttersendingsoppgave", enableEttersendingsoppgave, "utvikler", utvikler);
    }, [enableEttersendingsoppgave, utvikler]);
    return {
        isEttersendingsoppgaveEnabled: enableEttersendingsoppgave,
        isDeveloper: utvikler,
    };
}
