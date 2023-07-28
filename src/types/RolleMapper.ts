import { RolleType } from "@navikt/bidrag-ui-common";

export function mapRolleToDisplayValue(rolleType: RolleType): string {
    switch (rolleType) {
        case RolleType.BA:
            return "Barn";
        case RolleType.BM:
            return "Bidragsmottaker";
        case RolleType.BP:
            return "Bidragspliktig";
        case RolleType.RM:
            return "Reel mottaker";
    }
    return rolleType;
}
