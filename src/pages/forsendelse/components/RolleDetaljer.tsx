import "./Rolledetaljer.css";

import { PersonNavnIdent, RolleType } from "@navikt/bidrag-ui-common";
import { Heading } from "@navikt/ds-react";
import React from "react";

import PersonDetaljer from "../../../components/person/PersonDetaljer";

interface IRolleDetaljerProps {
    rolle: RolleType;
    ident: string;
    navn: string;
    label: string;
}
export default function RolleDetaljer({ rolle, ident, navn, label }: IRolleDetaljerProps) {
    return (
        <div className={"rolledetaljer"}>
            <Heading level="3" size={"small"}>
                {label}
            </Heading>
            <div className={"ml-2"}>
                <PersonNavnIdent rolle={rolle} navn={navn} ident={ident} />
            </div>
        </div>
    );
}
