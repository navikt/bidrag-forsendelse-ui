import ForsendelseInfo from "../docs/ForsendelseInfo.mdx";
import useUserInfoApi from "../hooks/useUserInfoApi";
import InfoKnapp from "./InfoKnapp";

export default function ForsendelseDocsButton() {
    const saksbehandlerNavn = useUserInfoApi().hentSaksbehandlerNavn();
    return (
        <div className="absolute left-[95%] bottom-[35px] translate-x-[-50%] z-[1000] bg-white border-subtle">
            <InfoKnapp className="w-max">
                <ForsendelseInfo saksbehandlerNavn={saksbehandlerNavn} />
            </InfoKnapp>
        </div>
    );
}
