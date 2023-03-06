import { SakHeader } from "../../../components/header/SakHeader";
import { useForsendelseApi } from "../../../hooks/useForsendelseApi";

export default function ForsendelseSakHeader() {
    const { hentRoller, hentForsendelse } = useForsendelseApi();
    const saksnummer = hentForsendelse().saksnummer;
    const roller = hentRoller();
    return <SakHeader saksnummer={saksnummer} roller={roller} />;
}
