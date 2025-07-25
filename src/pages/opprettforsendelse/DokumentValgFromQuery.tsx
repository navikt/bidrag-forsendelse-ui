import { Loader } from "@navikt/ds-react";

import DokumentValg from "../../components/dokument/DokumentValg";
import { useDokumentMalDetaljer } from "../../hooks/useDokumentApi";
import { useOpprettForsendelse } from "./OpprettForsendelseContext";

export default function DokumentValgFromQuery() {
    const options = useOpprettForsendelse();
    const { data: dokumentDetaljer, isFetching } = useDokumentMalDetaljer(options);

    if (isFetching) {
        return <Loader size={"medium"} />;
    }

    return <DokumentValg malDetaljer={dokumentDetaljer} />;
}
