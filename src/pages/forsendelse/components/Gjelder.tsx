import React from "react";

import { useForsendelseApi } from "../../../hooks/useForsendelseApi";
import RolleDetaljer from "./RolleDetaljer";

export default function Gjelder() {
    const { hentGjelder } = useForsendelseApi();
    const gjelder = hentGjelder();
    return <RolleDetaljer label={"Gjelder"} rolle={gjelder.rolleType} ident={gjelder.ident} navn={gjelder.navn} />;
}
