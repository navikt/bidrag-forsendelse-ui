import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";

export default function ForsendelseDocsButton() {
    return (
        <div>
            <div className="agroup fixed bottom-0 right-0 p-2  flex items-end justify-end w-max h-24 flex flex-row gap-[5px]">
                <Button
                    title={"Brevmaler varsler"}
                    variant="tertiary"
                    className={`border rounded-xl border-solid w-max`}
                    size="xsmall"
                    icon={<ExternalLinkIcon />}
                    onClick={() =>
                        window.open(
                            "https://navno.sharepoint.com/sites/fag-og-ytelser-familie-barnebidrag-og-forskudd/SitePages/Brevmaler-varsler.aspx",
                            "_blank"
                        )
                    }
                >
                    Brevmaler varsel
                </Button>
                <Button
                    title={"Brevmaler vedtak"}
                    variant="tertiary"
                    className={`border rounded-xl border-solid w-max`}
                    size="xsmall"
                    icon={<ExternalLinkIcon />}
                    onClick={() =>
                        window.open(
                            "https://navno.sharepoint.com/sites/fag-og-ytelser-familie-barnebidrag-og-forskudd/SitePages/Brevmaler-vedtak.aspx",
                            "_blank"
                        )
                    }
                >
                    Brevmaler vedtak
                </Button>
                <Button
                    title={"Brukerveiledning"}
                    variant="tertiary"
                    className={`border rounded-xl border-solid`}
                    size="xsmall"
                    icon={<ExternalLinkIcon />}
                    onClick={() => window.open("/forsendelse/brukerveiledning", "_blank")}
                >
                    Brukerveiledning
                </Button>
            </div>
        </div>
    );
}
