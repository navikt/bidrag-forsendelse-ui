import { OpenDocumentUtils } from "@navikt/bidrag-ui-common";
import { ExternalLink } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import React, { useState } from "react";

import { DOKUMENT_KAN_IKKE_ÅPNES_STATUS, DokumentStatus } from "../../constants/DokumentStatus";
import { queryClient } from "../../pages/PageWrapper";
import { IJournalpostStatus } from "../../types/Journalpost";
import EditDocumentButton from "./EditDocumentButton";
import useFeatureToogle from "../../hooks/useFeatureToggle";
import { useFlag } from "@unleash/proxy-client-react";

interface IOpenDokumentButtonProps {
    dokumentreferanse?: string;
    journalpostId?: string;
    status?: DokumentStatus | string | IJournalpostStatus;
    erSkjema?: boolean;
    erRedigerbar?: boolean;
}
export default function OpenDokumentButton({
    dokumentreferanse,
    status,
    journalpostId,
    erSkjema,
    erRedigerbar,
}: IOpenDokumentButtonProps) {
    if (DOKUMENT_KAN_IKKE_ÅPNES_STATUS.includes(status as DokumentStatus | IJournalpostStatus)) {
        return null;
    }
    const kanRedigeres = erRedigerbar && useFlag("forsendelse.redigering_av_dokumenter") && status == DokumentStatus.UNDER_REDIGERING;
    if (status === "MÅ_KONTROLLERES" || status === "KONTROLLERT") {
        return (
            <EditDocumentButton
                journalpostId={journalpostId}
                dokumentreferanse={dokumentreferanse}
                erSkjema={erSkjema}
                erRedigerbar={erRedigerbar}
                onEditFinished={() => queryClient.invalidateQueries({ queryKey: ["forsendelse"] })}
            />
        );
    }

    if (kanRedigeres){
        return <>
            <ÅpneDokumentWord dokumentreferanse={dokumentreferanse} journalpostId={journalpostId} />
             <EditDocumentButton
                journalpostId={journalpostId}
                dokumentreferanse={dokumentreferanse}
                erSkjema={erSkjema}
                erRedigerbar={erRedigerbar}
                onEditFinished={() => queryClient.invalidateQueries({ queryKey: ["forsendelse"] })}
            />

        </>
    }


    // if (status == "UNDER_REDIGERING") {
    //     return <MbdokUrl dokumentreferanse={dokumentreferanse} journalpostId={journalpostId} />;
    // }
    return <ÅpneDokumentWord dokumentreferanse={dokumentreferanse} journalpostId={journalpostId} />;
}

function ÅpneDokumentWord({
    dokumentreferanse,
    journalpostId,
}: IOpenDokumentButtonProps){
        const [isOpeningIframe, setIsOpeningIframe] = useState(false);

      function openDocumentIframe() {
        setIsOpeningIframe(true);
        document.getElementById(id).click();
        setTimeout(() => {
            setIsOpeningIframe(false);
        }, 4000);
    }
        const id = `doklink_${journalpostId}_${dokumentreferanse}`;

     return ( <>
            <Button
                as="span"
                size={"small"}
                variant={"tertiary"}
                icon={<ExternalLink />}
                loading={isOpeningIframe}
                disabled={isOpeningIframe}
                title={isOpeningIframe ? "Åpner dokument" : "Åpne dokument"}
                onClick={openDocumentIframe}
            />
            <OpenDokumentIframe
                id={id}
                path={OpenDocumentUtils.getÅpneDokumentLenke(journalpostId, dokumentreferanse, false, true)}
            />
        </>)
}

// function MbdokUrl({ dokumentreferanse, journalpostId }: IOpenDokumentButtonProps) {
//     const response = useHentDokumentUrl(journalpostId, dokumentreferanse);
//
//     return (
//         <a
//             className="hover:cursor-pointer m-auto hover:text-blue-900"
//             style={{ scale: 1.8 }}
//             href={response.data.dokumentUrl}
//         >
//             <ExternalLink />
//         </a>
//     );
// }

interface OpenDokumentIframeProps {
    id: string;
    path: string;
}
function OpenDokumentIframe({ path, id }: OpenDokumentIframeProps) {
    return (
        <>
            <iframe name="bidragui" style={{ display: "none" }}></iframe>
            <a id={id} style={{ display: "none" }} href={path} target="bidragui"></a>
        </>
    );
}
