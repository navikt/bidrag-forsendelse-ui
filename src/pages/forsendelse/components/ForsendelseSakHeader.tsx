import SakHeader from "@navikt/bidrag-ui-common/esm/react_components/header/SakHeader";
import { Skeleton } from "@navikt/ds-react";
import React from "react";

import { useForsendelseApi } from "../../../hooks/useForsendelseApi";
import { useSession } from "../context/SessionContext";
export default function ForsendelseSakHeader() {
    return (
        <React.Suspense fallback={<SakLoadingIndicator />}>
            <ForsendelseSakHeaderContent />
        </React.Suspense>
    );
}
function SakLoadingIndicator() {
    return (
        <div className="flex flex-col gap-[2px]">
            <Skeleton variant="rectangle" width="100%" height={"30px"} />
            <Skeleton variant="rectangle" width="100%" height={"140px"} />
        </div>
    );
}

function ForsendelseSakHeaderContent() {
    const { saksnummer: saksnummerFromSession, forsendelseId } = useSession();
    const { hentRoller, hentForsendelse } = useForsendelseApi();
    const saksnummer = saksnummerFromSession ?? hentForsendelse()?.saksnummer;
    const roller = hentRoller();
    return (
        <SakHeader
            saksnummer={saksnummer}
            roller={roller}
            skjermbilde={{ navn: "Forsendelse", referanse: forsendelseId }}
        />
    );
}
