import { Button } from "@navikt/ds-react";
import React, { useContext, useState } from "react";

import useDokumentApi from "../../../hooks/useDokumentApi";
import { useForsendelseApi } from "../../../hooks/useForsendelseApi";
import { AvvikType } from "../../../types/AvvikTypes";
import { IForsendelse } from "../../../types/Forsendelse";
import { useSession } from "../context/SessionContext";
import AvvikshandteringModal from "./components/AvvikshandteringModal";

interface AvvikProviderProps {
    onCancel: () => void;
    saksnummer: string;
    paloggetEnhet: string;
    forsendelseId: string;
    avvikListe: AvvikType[];
    forsendelse: IForsendelse;
}
export const useAvvikModalContext = () => useContext(AvvikModalContext);
const AvvikModalContext = React.createContext<AvvikProviderProps>({} as AvvikProviderProps);

function AvvikshandteringButton() {
    const { forsendelseId, saksnummer, enhet } = useSession();
    const { data: avvikListe } = useDokumentApi().hentAvvikListe(forsendelseId, saksnummer, enhet);
    const forsendelse = useForsendelseApi().hentForsendelse();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (avvikListe.length === 0) {
        return null;
    }

    return (
        <>
            <Button size="small" variant="secondary" type={"button"} onClick={openModal} id={"openAvvikButton"}>
                Avvikshåndtering
            </Button>
            {isModalOpen && (
                <React.Suspense fallback={<></>}>
                    <AvvikModalContext.Provider
                        value={{
                            onCancel: closeModal,
                            forsendelseId,
                            saksnummer,
                            paloggetEnhet: enhet,
                            forsendelse,
                            avvikListe,
                        }}
                    >
                        <AvvikshandteringModal />
                    </AvvikModalContext.Provider>
                </React.Suspense>
            )}
        </>
    );
}

export default AvvikshandteringButton;
