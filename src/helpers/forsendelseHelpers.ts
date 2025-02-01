import { AxiosResponse } from "axios";

import { EttersendingsoppgaveDto, ForsendelseResponsTo } from "../api/BidragForsendelseApi";
import { VarselDokumentType } from "../pages/forsendelse/context/DokumenterFormContext";

export function mapVarselEttersendelse(ettersendingsoppgave: EttersendingsoppgaveDto) {
    return (
        ettersendingsoppgave && {
            tittel: ettersendingsoppgave.tittel,
            journalpostId: ettersendingsoppgave.ettersendelseForJournalpostId,
            innsendingsfristDager: ettersendingsoppgave.innsendingsfristDager,
            vedleggsliste: ettersendingsoppgave.vedleggsliste?.map((d) => ({
                ...d,
                varselDokumentId: d.id,
                type: (d.skjemaId ? "SKJEMA" : "FRITEKST") as VarselDokumentType,
            })),
        }
    );
}

export function mapForsendelseResponse(ettersendingsoppgave: EttersendingsoppgaveDto) {
    return (prev: AxiosResponse<ForsendelseResponsTo>) => {
        return {
            ...prev,
            data: {
                ...prev.data,
                ettersendingsoppgave: ettersendingsoppgave,
            },
        };
    };
}
