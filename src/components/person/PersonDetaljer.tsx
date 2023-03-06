import "./PersonDetaljer.css";

import { PeopleInCircle } from "@navikt/ds-icons";
import { BodyShort, Label } from "@navikt/ds-react";
import { CopyToClipboard } from "@navikt/ds-react-internal";
import React from "react";

import { RolleType } from "../../types/types";
interface IPersonDetaljerProps {
    rolle?: RolleType;
    navn: string;
    ident?: string;
    className?: string;
}
export default function PersonDetaljer({ rolle, navn, ident, className }: IPersonDetaljerProps) {
    return (
        <div className={`person-detaljer margin--M ${className} pt-2 pb-2`}>
            <PeopleInCircle className={"person-circle"} />
            {rolle && <div>{rolle} / </div>}
            <Label size={"medium"}>{navn}</Label>
            {ident && (
                <>
                    <BodyShort size={"medium"}>{(navn ? " / " : "") + ident}</BodyShort>
                    <CopyToClipboard copyText={ident} popoverText={"Kopiert til utklippstavlen"} />
                </>
            )}
        </div>
    );
}
