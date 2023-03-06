import "./Rolledetaljer.css";

import { Heading } from "@navikt/ds-react";
import React from "react";

import PersonDetaljer from "../../../components/person/PersonDetaljer";
import { RolleType } from "../../../constants/RolleType";

interface IRolleDetaljerProps {
    rolle: RolleType;
    ident: string;
    navn: string;
    label: string;
}
export default function RolleDetaljer({ rolle, ident, navn, label }: IRolleDetaljerProps) {
    return (
        <div className={"rolledetaljer"}>
            <Heading level="3" size={"medium"}>
                {label}
            </Heading>
            <div className={"ml-2"}>
                <PersonDetaljer rolle={rolle} navn={navn} ident={ident} />
            </div>
        </div>
    );
}
