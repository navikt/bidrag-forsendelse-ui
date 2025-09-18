import { Loader } from "@navikt/ds-react";

import DokumentValg from "../../components/dokument/DokumentValg";
import { useDokumentMalDetaljer, useDokumentMalDetaljer2 } from "../../hooks/useDokumentApi";
import { useOpprettForsendelse } from "./OpprettForsendelseContext";
import DokumentValgMulti from "../../components/dokument/DokumentValgMulti";

export default function DokumentValgFromQuery() {
    const options = useOpprettForsendelse();
    const { data: dokumentDetaljer, isFetching } = useDokumentMalDetaljer(options);
    const { data: dokumentDetaljerV2, isFetching: isFetching2 } = useDokumentMalDetaljer2(options);

    if (isFetching || isFetching2) {
        return <Loader size={"medium"} />;
    }
    if (dokumentDetaljerV2.automatiskOpprettDokumenter.length > 0) {
        return <DokumentValgMulti malDetaljer={dokumentDetaljerV2.dokumentMalDetaljer} automatiskOpprettDokumenter={dokumentDetaljerV2.automatiskOpprettDokumenter} />
    }
    return <DokumentValg malDetaljer={dokumentDetaljer} />;
}
