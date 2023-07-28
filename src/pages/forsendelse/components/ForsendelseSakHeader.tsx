import SakHeader from "@navikt/bidrag-ui-common/esm/react_components/header/SakHeader";
import React from "react";

import { useForsendelseApi } from "../../../hooks/useForsendelseApi";
import { useSession } from "../context/SessionContext";
export default function ForsendelseSakHeader() {
    const { saksnummer: saksnummerFromSession, forsendelseId } = useSession();
    const { hentRoller, hentForsendelse } = useForsendelseApi();
    const saksnummer = saksnummerFromSession ?? hentForsendelse().saksnummer;
    const roller = hentRoller();
    return (
        <SakHeader
            saksnummer={saksnummer}
            roller={roller}
            skjermbilde={{ navn: "Forsendelse", referanse: forsendelseId }}
        />
    );
}
