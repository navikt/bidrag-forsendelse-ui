import useDokumentApi from "../../hooks/useDokumentApi";
import DokumentValg from "./DokumentValg";

export default function DokumentValForsendelse() {
    const { data: dokumentDetaljer, isFetching } = useDokumentApi().dokumentMalDetaljerForsendelse();

    if (isFetching) {
        return null;
    }

    return <DokumentValg malDetaljer={dokumentDetaljer} />;
}
