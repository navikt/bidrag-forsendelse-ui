import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { BIDRAG_FORSENDELSE_API } from "../api/api";
import {
    OppdaterEttersendingsoppgaveRequest,
    OpprettEttersendingsoppgaveRequest,
    SlettEttersendingsoppgave,
    SlettEttersendingsoppgaveVedleggRequest,
} from "../api/BidragForsendelseApi";
import { useHentForsendelseQuery } from "./useForsendelseApi";

export const useHentEksisterendeOppgaverForsendelse = () => {
    const forsendelse = useHentForsendelseQuery();
    return useSuspenseQuery({
        queryKey: ["hentEksisterendeOppgaverForsendelse"],
        queryFn: async () => {
            return (
                await BIDRAG_FORSENDELSE_API.api.hentEksisterendeEttersendingsoppgaverForsendelse(
                    forsendelse.forsendelseId
                )
            ).data;
        },
    }).data;
};
export const useOpprettVarselEttersendelse = () => {
    return useMutation({
        mutationFn: async (data: OpprettEttersendingsoppgaveRequest) => {
            return BIDRAG_FORSENDELSE_API.api.opprettEttersendingsoppgave(data);
        },
    });
};
export const useOppdaterVarselEttersendelse = () => {
    return useMutation({
        mutationFn: async (data: OppdaterEttersendingsoppgaveRequest) => {
            return BIDRAG_FORSENDELSE_API.api.oppdaterEttesendingsoppgave(data);
        },
    });
};
export const useSlettVarselEttersendelseDokument = () => {
    return useMutation({
        mutationFn: async (data: SlettEttersendingsoppgaveVedleggRequest) => {
            return BIDRAG_FORSENDELSE_API.api.slettEttersendingsoppgaveVedlegg(data);
        },
    });
};
export const useSlettVarselEttersendelse = () => {
    return useMutation({
        mutationFn: async (data: SlettEttersendingsoppgave) => {
            return BIDRAG_FORSENDELSE_API.api.slettEttersendingsoppgave(data);
        },
    });
};
