import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";

export default function ForsendelseDocsButton() {
    return (
        <div className="agroup fixed bottom-0 right-0 p-2  flex items-end justify-end w-24 h-24">
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
    );
}
