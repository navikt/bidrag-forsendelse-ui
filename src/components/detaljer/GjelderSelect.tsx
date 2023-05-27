import { IRolleDetaljer, RolleType } from "@navikt/bidrag-ui-common";
import { Heading, Select } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";

interface GjelderSelectProps {
    roller: IRolleDetaljer[];
}
export default function GjelderSelect({ roller }: GjelderSelectProps) {
    const { register, getValues } = useFormContext();
    const rollerFiltrert = roller.filter((rolle) =>
        [RolleType.BA, RolleType.BM, RolleType.BP].includes(rolle.rolleType)
    );
    const rollerIkkeBarn = rollerFiltrert.filter((rolle) => rolle.rolleType !== RolleType.BA);

    function renderBarnOptions() {
        const barn = rollerFiltrert.filter((rolle) => rolle.rolleType == RolleType.BA);
        if (barn.length == 0) return null;
        return (
            <optgroup label="Barn">
                {barn.map((rolle) => (
                    <option value={rolle.ident}>
                        {rolle.navn} / {rolle.ident}
                    </option>
                ))}
            </optgroup>
        );
    }
    return (
        <div>
            <Select
                style={{ width: "max-content" }}
                className="pb-2 pt-2"
                size="small"
                label={<Heading size="small">Gjelder</Heading>}
                {...register("gjelderIdent", { required: "Gjelder må settes" })}
                defaultValue={getValues("gjelderIdent")}
            >
                {rollerIkkeBarn.map((rolle) => (
                    <option value={rolle.ident}>
                        {rolle.navn} / {rolle.ident}
                    </option>
                ))}
                {renderBarnOptions()}
            </Select>
        </div>
    );
}
