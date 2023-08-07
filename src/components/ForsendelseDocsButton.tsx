import ForsendelseInfo from "../docs/ForsendelseInfo.mdx";
import useUserInfoApi from "../hooks/useUserInfoApi";
import InfoKnapp from "./InfoKnapp";

export default function ForsendelseDocsButton() {
    const saksbehandlerNavn = useUserInfoApi().hentSaksbehandlerNavn();
    return (
        <div className="agroup fixed bottom-0 right-0 p-2  flex items-end justify-end w-24 h-24">
            <InfoKnapp
                className="w-max"
                roundedIcon={false}
                buttonText="Brukerveiledning"
                buttonClassName="border rounded-xl border-solid"
                title="Forsendelse brukerveiledning"
            >
                <ForsendelseInfo saksbehandlerNavn={saksbehandlerNavn} />
            </InfoKnapp>
        </div>
    );
}
