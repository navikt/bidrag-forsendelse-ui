import useDokumentApi from "../../hooks/useDokumentApi";
import { useOpprettForsendelse } from "../../pages/opprettforsendelse/OpprettForsendelseContext";
import DokumentValgMulti from "./DokumentValgMulti";

export default function DokumentValgNotat() {
    const options = useOpprettForsendelse();
    const { data: dokumentDetaljer, isFetching } = useDokumentApi().hentNotatMalDetaljer(options);

    if (isFetching) {
        return null;
    }

    return <DokumentValgMulti malDetaljer={dokumentDetaljer} />;
}
