import { ArrowRightLeftIcon } from "@navikt/aksel-icons";
import { FileXMarkIcon } from "@navikt/aksel-icons";
import { ForwardRefExoticComponent } from "react";

import { AvvikType } from "../../../../types/AvvikTypes";
export interface AvvikViewModel {
    IconComponent: ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    title: string;
    description?: string;
    type: AvvikType;
    stepIndicators: string[];
}

export const avvikViewModels: AvvikViewModel[] = [
    {
        title: "Overfør til annen enhet",
        IconComponent: ArrowRightLeftIcon,
        type: AvvikType.OVERFOR_TIL_ANNEN_ENHET,
        stepIndicators: ["Overfør enhet"],
    },
    {
        title: "Endre fagområde",
        IconComponent: ArrowRightLeftIcon,
        type: AvvikType.ENDRE_FAGOMRADE,
        stepIndicators: ["Endre fagområde"],
    },
    {
        title: "Slett forsendelse under produksjon",
        IconComponent: FileXMarkIcon,
        type: AvvikType.SLETT_JOURNALPOST,
        stepIndicators: ["Slett forsendelse"],
    },
    // {
    //     title: "Feilfør forsendelse",
    //     IconComponent: ArrowRightLeftIcon,
    //     type: AvvikType.FEILFORE_SAK,
    //     stepIndicators: ["Feilfør forsendelse"],
    // },
];

export function getViewmodelByType(avvikType: AvvikType) {
    return avvikViewModels.find((a) => a.type == avvikType);
}
