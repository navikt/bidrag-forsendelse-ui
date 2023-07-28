import ObjectUtils from "@navikt/bidrag-ui-common/esm/utils/ObjectUtils";

import { BehandlingInfoDto, BehandlingInfoResponseDto, MottakerTo } from "../api/BidragForsendelseApi";
import { IOpprettForsendelsePropsContext } from "../pages/opprettforsendelse/OpprettForsendelseContext";
import { hasOnlyNullValues } from "../utils/ObjectUtils";
import { IDokument } from "./Dokument";

export interface IForsendelse {
    isStaleData?: boolean;
    forsendelseId: string;
    gjelderIdent?: string;
    mottaker?: MottakerTo;
    dokumenter: IDokument[];
    behandlingInfo?: BehandlingInfoResponseDto;
    saksnummer?: string;
    enhet?: string;
    tema?: string;
    opprettetAvIdent?: string;
    opprettetAvNavn?: string;
    tittel?: string;

    forsendelseType?: "UTGÅENDE" | "NOTAT";

    status?:
        | "UNDER_PRODUKSJON"
        | "FERDIGSTILT"
        | "SLETTET"
        | "DISTRIBUERT"
        | "DISTRIBUERT_LOKALT"
        | "UNDER_OPPRETTELSE";
    opprettetDato?: string;
}

export function mapToBehandlingInfoDto(options: IOpprettForsendelsePropsContext): BehandlingInfoDto {
    const behandlingInfo = {
        soknadFra: options.soknadFra,
        soknadId: options.soknadId,
        vedtakId: options.vedtakId,
        behandlingId: options.behandlingId,
        vedtakType: options.vedtakType,
        behandlingType: options.behandlingType,
        stonadType: options.stonadType,
        engangsBelopType: options.engangsBelopType,
        erFattetBeregnet: options.erFattetBeregnet,
        erVedtakIkkeTilbakekreving: options.erVedtakIkkeTilbakekreving,
    };
    const isBehandlingInfoEmpty = ObjectUtils.isEmpty(behandlingInfo) || hasOnlyNullValues(behandlingInfo);
    return isBehandlingInfoEmpty ? null : behandlingInfo;
}
