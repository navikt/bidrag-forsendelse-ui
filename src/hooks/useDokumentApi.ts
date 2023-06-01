import { useQuery } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../api/api";
import { HentDokumentValgRequest } from "../api/BidragForsendelseApi";
import { useSession } from "../pages/forsendelse/context/SessionContext";

export default function useDokumentApi() {
    const { forsendelseId, saksnummer, enhet } = useSession();
    function dokumentMalDetaljerForsendelse() {
        return useQuery({
            queryKey: ["dokumentMalDetaljer", forsendelseId],
            queryFn: ({ signal }) => BIDRAG_FORSENDELSE_API.api.hentDokumentValgForForsendelse(forsendelseId),
            select: (data) => data.data,
            optimisticResults: false,
        });
    }
    function dokumentMalDetaljer(request: HentDokumentValgRequest) {
        return useQuery({
            queryKey: [
                "dokumentMalDetaljer",
                request.behandlingType,
                request.vedtakType,
                request.soknadFra,
                request.erFattetBeregnet,
                enhet,
            ],
            queryFn: ({ signal }) => BIDRAG_FORSENDELSE_API.api.hentDokumentValg({ ...request, enhet }),
            select: (data) => data.data,
            optimisticResults: false,
        });
    }

    function hentNotatMalDetaljer() {
        return useQuery({
            queryKey: "notatDetaljer",
            queryFn: ({ signal }) => BIDRAG_FORSENDELSE_API.api.hentDokumentValgNotater(),
            select: (data) => data.data,
            optimisticResults: false,
        });
    }

    return {
        hentNotatMalDetaljer,
        dokumentMalDetaljerForsendelse,
        dokumentMalDetaljer,
    };
}
