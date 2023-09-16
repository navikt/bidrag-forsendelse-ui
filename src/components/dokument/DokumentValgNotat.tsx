import useDokumentApi from "../../hooks/useDokumentApi";
import DokumentValgMulti from "./DokumentValgMulti";

export default function DokumentValgNotat() {
    const { data: dokumentDetaljer, isFetching } = useDokumentApi().hentNotatMalDetaljer();

    if (isFetching) {
        return null;
    }

    return <DokumentValgMulti malDetaljer={dokumentDetaljer} />;
}
