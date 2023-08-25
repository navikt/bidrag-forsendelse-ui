import { RedirectTo } from "@navikt/bidrag-ui-common";
import { Button } from "@navikt/ds-react";

import environment from "../../environment";
import { useSession } from "../forsendelse/context/SessionContext";
type AvbrytOpprettForsendelseButton = {
    disabled?: boolean;
};
export default function AvbrytOpprettForsendelseButton({ disabled }: AvbrytOpprettForsendelseButton) {
    const { saksnummer } = useSession();
    return (
        <Button
            size="small"
            variant="tertiary"
            type="button"
            onClick={() => RedirectTo.sakshistorikk(saksnummer, environment.url.bisys)}
            disabled={disabled}
        >
            Avbryt
        </Button>
    );
}
