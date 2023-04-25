import SakHeader from "@navikt/bidrag-ui-common/esm/react_components";
import React from "react";

import { useForsendelseApi } from "../../../hooks/useForsendelseApi";
import { useSession } from "../context/SessionContext";
export default function ForsendelseSakHeader() {
    const { saksnummer: saksnummerFromSession } = useSession();
    const { hentRoller, hentForsendelse } = useForsendelseApi();
    const saksnummer = saksnummerFromSession ?? hentForsendelse().saksnummer;
    const roller = hentRoller();
    return <SakHeader saksnummer={saksnummer} roller={roller} />;
}
