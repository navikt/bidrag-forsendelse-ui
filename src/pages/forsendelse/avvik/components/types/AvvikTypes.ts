import { UseFormRegister } from "react-hook-form";

import { Avvikshendelse } from "../../../../../api/BidragForsendelseApi";
import { Avvik, AvvikType } from "../../../../../types/AvvikTypes";

export interface AvvikTypeCommonProps {
    activeStep: number;
    setActiveStep: (step: number) => void;
    sendAvvik: (avvik: Avvik) => Promise<void>;
    initialAvvik?: Avvik;
}

export function registerToSelectProps(formName: string, register: UseFormRegister<any>) {
    const { ref, ...otherProps } = register(formName);
    return {
        ...otherProps,
        selectRef: ref,
    };
}

export function mapToAvvikRequest(avvik: Avvik, saksnummer: string): Avvikshendelse {
    const { type: avvikType, ...otherValues } = avvik;
    const baseBody = { avvikType, saksnummer };
    switch (avvik.type) {
        case AvvikType.ENDRE_FAGOMRADE:
            return {
                ...baseBody,
                detaljer: {
                    fagomrade: avvik.fagomrade,
                },
            };
        case AvvikType.SLETT_JOURNALPOST:
            return baseBody;
        case AvvikType.OVERFOR_TIL_ANNEN_ENHET:
            return { ...baseBody, detaljer: { ...otherValues } };
        default:
            throw Error(`Send avvik - unexpected avvikType: ${avvik}`);
    }
}

export const handleSubmitPreventPropagation = (handleSubmit: (e) => void) => (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(e);
};
