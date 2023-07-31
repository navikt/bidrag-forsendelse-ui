import { CheckmarkCircleIcon, XMarkOctagonIcon } from "@navikt/aksel-icons";
import { BodyShort, Loader } from "@navikt/ds-react";
type StateType = "idle" | "saving" | "error";
type SaveStatusIndicatorProps = {
    state?: StateType;
};
export default function SaveStatusIndicator({ state = "idle" }: SaveStatusIndicatorProps) {
    function renderContent() {
        if (state == "error") {
            return (
                <div className="inline-flex text-nav-red gap-[3px]">
                    <XMarkOctagonIcon /> <BodyShort size="small">Lagring feilet</BodyShort>
                </div>
            );
        }
        if (state == "saving") {
            return (
                <div className="inline-flex gap-[3px]">
                    <Loader size="xsmall" title="Lagrer" />
                    <BodyShort size="small">Lagrer...</BodyShort>
                </div>
            );
        }
        return (
            <div className="inline-flex gap-[3px]">
                <div className="text-green-500">
                    <CheckmarkCircleIcon />
                </div>{" "}
                <BodyShort size="small">Lagret</BodyShort>
            </div>
        );
    }

    function getStyles() {
        if (state == "error") {
            return `border-border-danger pr-1 pl-1 w-[122px]`;
        }
        if (state == "saving") {
            return `border-border-info w-[70px]`;
        }
        return `transition-[width] ease-in-out border-border-success duration-300 w-[65px]`;
    }
    return <div className={`${getStyles()} self-center`}>{renderContent()}</div>;
}
