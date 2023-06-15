import "./PersonDetaljer.css";

import { RolleType } from "@navikt/bidrag-ui-common";
import RolleTag from "@navikt/bidrag-ui-common/esm/react_components/roller/RolleTag";
import { BodyShort } from "@navikt/ds-react";
import { CopyToClipboard } from "@navikt/ds-react-internal";
import React from "react";

interface IPersonDetaljerProps {
    rolle?: RolleType;
    navn: string;
    ident?: string;
    copy?: boolean;
    className?: string;
    spacing?: boolean;
}
export default function PersonDetaljer({
    rolle,
    navn,
    ident,
    className,
    copy = true,
    spacing = true,
}: IPersonDetaljerProps) {
    return (
        <div className={`person-detaljer ${spacing ? "margin--M pt-2 pb-2" : ""} ${className} `}>
            {rolle && <RolleTag rolleType={rolle} />}
            <BodyShort size={"medium"}>{navn}</BodyShort>
            {ident && (
                <>
                    <BodyShort size={"medium"}>{(navn ? " / " : "") + ident}</BodyShort>
                    {copy && (
                        <CopyToClipboard size="small" copyText={ident} popoverText={"Kopiert til utklippstavlen"} />
                    )}
                </>
            )}
        </div>
    );
}
