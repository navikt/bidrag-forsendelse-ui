import React from "react";

import { useForsendelseApi } from "../../../hooks/useForsendelseApi";
import RolleDetaljer from "./RolleDetaljer";

export default function Mottaker() {
    const mottaker = useForsendelseApi().hentMottaker();
    return <RolleDetaljer label={"Mottaker"} rolle={mottaker.rolleType} ident={mottaker.ident} navn={mottaker.navn} />;
}
