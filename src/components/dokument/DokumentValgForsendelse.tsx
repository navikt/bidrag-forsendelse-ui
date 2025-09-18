import { Loader } from "@navikt/ds-react";

import { useDokumentMalDetaljerForsendelse, useDokumentMalDetaljerForsendelseV2 } from "../../hooks/useDokumentApi";
import DokumentValg from "./DokumentValg";
import DokumentValgMulti from "./DokumentValgMulti";

interface DokumentValgForsendelseProps {
    showLegend?: boolean;
    autoselect?: boolean;
}
export default function DokumentValgForsendelse({ showLegend = true, autoselect = false }: DokumentValgForsendelseProps) {
    const { data: dokumentDetaljer, isFetching } = useDokumentMalDetaljerForsendelse();
    const { data: dokumentDetaljerV2, isFetching: isFetchingV2 } = useDokumentMalDetaljerForsendelseV2();

    if (isFetching || isFetchingV2) {
        return <Loader size={"medium"} />;
    }

    if (dokumentDetaljerV2.automatiskOpprettDokumenter.length > 0 && autoselect) {
        return <DokumentValgMulti malDetaljer={dokumentDetaljerV2.dokumentMalDetaljer} automatiskOpprettDokumenter={dokumentDetaljerV2.automatiskOpprettDokumenter} />
    }

    return <DokumentValg malDetaljer={dokumentDetaljer} showLegend={showLegend} />;
}
