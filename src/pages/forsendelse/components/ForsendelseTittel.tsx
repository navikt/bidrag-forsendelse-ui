import { Heading } from "@navikt/ds-react";

import { useForsendelseApi } from "../../../hooks/useForsendelseApi";

export default function ForsendelseTittel() {
    const forsendelse = useForsendelseApi().hentForsendelse();

    return (
        <Heading spacing size={"large"} className={"w-max"}>
            {forsendelse.tittel}
        </Heading>
    );
}
