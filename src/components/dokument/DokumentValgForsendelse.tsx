import { Loader } from "@navikt/ds-react";

import useDokumentApi from "../../hooks/useDokumentApi";
import DokumentValg from "./DokumentValg";

interface DokumentValgForsendelseProps {
    showLegend?: boolean;
}
export default function DokumentValgForsendelse({ showLegend = true }: DokumentValgForsendelseProps) {
    const { data: dokumentDetaljer, isFetching } = useDokumentApi().dokumentMalDetaljerForsendelse();

    if (isFetching) {
        return <Loader size={"medium"} />;
    }

    return <DokumentValg malDetaljer={dokumentDetaljer} showLegend={showLegend} />;
}
