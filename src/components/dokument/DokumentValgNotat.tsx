import useDokumentApi from "../../hooks/useDokumentApi";
import DokumentValg from "./DokumentValg";

export default function DokumentValgNotat() {
    const { data: dokumentDetaljer, isFetching } = useDokumentApi().hentNotatMalDetaljer();

    if (isFetching) {
        return null;
    }

    return <DokumentValg malDetaljer={dokumentDetaljer} />;
}
