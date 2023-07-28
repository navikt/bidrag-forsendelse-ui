import { Button } from "@navikt/ds-react";
import React from "react";
import { useState } from "react";

import { useDokumenterForm } from "../context/DokumenterFormContext";
import BestillDistribusjonModal from "../distribuer/BestillDistribusjonModal";
import ManuellUtsendingModal from "../distribuer/ManuellUtsendingModal";

export default function SendButton() {
    const { validateCanSendForsendelse } = useDokumenterForm();

    const [isDistribuerModalOpen, setIsDistribuerModalOpen] = useState(false);
    const [isDistribuerManueltModalOpen, setIsDistribuerManueltModalOpen] = useState(false);
    function sendForsendelse() {
        if (validateCanSendForsendelse()) {
            setIsDistribuerModalOpen(true);
        }
    }

    function sendForsendelseManuelt() {
        if (validateCanSendForsendelse()) {
            setIsDistribuerManueltModalOpen(true);
        }
    }
    return (
        <>
            <div className={"flex flex-row gap-2"}>
                <Button size="small" variant={"primary"} onClick={sendForsendelse}>
                    Send
                </Button>
                <Button size="small" variant={"secondary"} onClick={sendForsendelseManuelt}>
                    Send lokalt
                </Button>
            </div>
            <React.Suspense fallback={""}>
                {isDistribuerModalOpen && <BestillDistribusjonModal onCancel={() => setIsDistribuerModalOpen(false)} />}
                {isDistribuerManueltModalOpen && (
                    <ManuellUtsendingModal onCancel={() => setIsDistribuerManueltModalOpen(false)} />
                )}
            </React.Suspense>
        </>
    );
}
