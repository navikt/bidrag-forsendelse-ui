import { Popover } from "@navikt/ds-react";
import { useState } from "react";
import { useRef } from "react";
import React from "react";

import { IDokument } from "../../types/Dokument";

interface LabelPopoverProps {
    dokument: IDokument;
}
export default function DokumentLabel({ dokument }: LabelPopoverProps) {
    const [open, setOpen] = useState<boolean>(false);
    const labelRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <p
                style={{ margin: "0" }}
                onMouseOver={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                ref={labelRef}
            >
                {dokument.tittel}
            </p>
            <Popover
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={labelRef.current}
                arrow={false}
                offset={15}
                placement={"bottom"}
            >
                <Popover.Content style={{ wordWrap: "break-word", flexWrap: "wrap", maxWidth: "400px" }}>
                    {dokument.tittel}
                </Popover.Content>
            </Popover>
        </>
    );
}
