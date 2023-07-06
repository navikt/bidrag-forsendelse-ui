import { RolleType } from "@navikt/bidrag-ui-common";
import { Button, Cell, ContentContainer, Grid, Heading } from "@navikt/ds-react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useIsMutating, useMutation } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../../api/api";
import { JournalTema, OppdaterForsendelseForesporsel } from "../../api/BidragForsendelseApi";
import GjelderSelect from "../../components/detaljer/GjelderSelect";
import BidragErrorPanel from "../../context/BidragErrorPanel";
import { useErrorContext } from "../../context/ErrorProvider";
import { useForsendelseApi, UseForsendelseApiKeys } from "../../hooks/useForsendelseApi";
import { useSession } from "../forsendelse/context/SessionContext";
import { queryClient } from "../PageWrapper";
import DokumentValgOpprett from "./DokumentValgOpprett";
import LanguageAndTemaSelect from "./LanguageAndTemaSelect";
import MottakerSelect from "./MottakerSelect";
import { useOpprettForsendelse } from "./OpprettForsendelseContext";
import SlettForsendelseButton from "./SlettForsendelseButton";

export type MottakerFormProps = {
    ident?: string;
    navn?: string;
    adresse?: MottakerAdresseFormTo;
};

export interface MottakerAdresseFormTo {
    adresselinje1?: string;
    adresselinje2?: string;
    adresselinje3?: string;
    bruksenhetsnummer?: string;
    land?: string;
    postnummer?: string;
    poststed?: string;
}
export type OpprettForsendelseFormProps = {
    gjelderIdent: string;
    mottaker: MottakerFormProps;
    dokument: {
        malId: string;
        tittel: string;
        type: "UTGÅENDE" | "NOTAT";
    };
    språk: string;
    tema: "BID" | "FAR";
    enhet: string;
};

function mapToOpprettEllerOppdaterForsendelseRequest(
    data: OpprettForsendelseFormProps
): OppdaterForsendelseForesporsel {
    return {
        gjelderIdent: data.gjelderIdent,
        mottaker: {
            ident: data.mottaker.ident,
            navn: data.mottaker.navn,
            adresse: data.mottaker?.adresse
                ? { ...data.mottaker?.adresse, landkode: data.mottaker?.adresse?.land }
                : undefined,
        },
        tema: data.tema as JournalTema,
        språk: data.språk,
        dokumenter: [
            {
                dokumentmalId: data.dokument.malId,
                tittel: data.dokument.tittel,
            },
        ],
    };
}

const OPPRETT_FORSENDELSE_MUTATION_KEY = "opprettForsendelse";
export const useOpprettForsendelseFormContext = () => useFormContext<OpprettForsendelseFormProps>();

export default function OpprettForsendelsePage() {
    const { forsendelseId } = useSession();
    if (forsendelseId) {
        return <OpprettForsendelseUnderOpprettelse />;
    }
    return <OpprettForsendelseNy />;
}
function OpprettForsendelseUnderOpprettelse() {
    const { addError } = useErrorContext();
    const { forsendelseId, navigateToForsendelse } = useSession();
    const opprettForsendelseFn = useMutation({
        mutationKey: OPPRETT_FORSENDELSE_MUTATION_KEY,
        mutationFn: (data: OpprettForsendelseFormProps) =>
            BIDRAG_FORSENDELSE_API.api.oppdaterForsendelse(
                forsendelseId,
                mapToOpprettEllerOppdaterForsendelseRequest(data)
            ),
        onSuccess: (data) => {
            navigateToForsendelse(forsendelseId, "UTGÅENDE");
            queryClient.refetchQueries(UseForsendelseApiKeys.forsendelse);
        },
        onError: () => {
            addError("Kunne ikke opprette forsendelse. Vennligst prøv på nytt");
        },
    });

    const forsendelse = useForsendelseApi().hentForsendelse();
    const defaultGjelder = forsendelse.gjelderIdent;
    const methods = useForm<OpprettForsendelseFormProps>({
        defaultValues: {
            gjelderIdent: defaultGjelder,
            mottaker: {
                ident: defaultGjelder,
            },
            tema: "BID",
            språk: "NB",
        },
    });
    function onSubmit(data: OpprettForsendelseFormProps) {
        opprettForsendelseFn.mutate(data);
    }
    return (
        <FormProvider {...methods}>
            <OpprettForsendelsContainer onSubmit={onSubmit} />
        </FormProvider>
    );
}

function OpprettForsendelseNy() {
    const { saksnummer, enhet, navigateToForsendelse } = useSession();
    const { addError } = useErrorContext();
    const options = useOpprettForsendelse();
    const opprettForsendelseFn = useMutation({
        mutationKey: OPPRETT_FORSENDELSE_MUTATION_KEY,
        mutationFn: (data: OpprettForsendelseFormProps) => {
            const request = mapToOpprettEllerOppdaterForsendelseRequest(data);
            return BIDRAG_FORSENDELSE_API.api.opprettForsendelse({
                ...request,
                gjelderIdent: data.gjelderIdent,
                enhet: enhet ?? "4806",
                saksnummer,
                behandlingInfo: {
                    soknadFra: options.soknadFra,
                    soknadId: options.soknadId,
                    vedtakId: options.vedtakId,
                    behandlingId: options.behandlingId,
                    vedtakType: options.vedtakType,
                    stonadType: options.stonadType,
                    engangsBelopType: options.engangsBelopType,
                    erFattetBeregnet: options.erFattetBeregnet,
                },
                dokumenter: [
                    {
                        dokumentmalId: data.dokument.malId,
                        tittel: data.dokument.tittel,
                        språk: data.språk,
                        bestillDokument: true,
                    },
                ],
            });
        },
        onError: () => {
            addError("Kunne ikke opprette forsendelse. Vennligst prøv på nytt");
        },
        onSuccess: (data) => {
            const forsendelseId = data.data.forsendelseId;
            navigateToForsendelse(forsendelseId?.toString(), data.data.forsendelseType);
        },
    });

    const roller = useForsendelseApi().hentRoller();
    const defaultGjelder = roller.find((rolle) => [RolleType.BM, RolleType.BP].includes(rolle.rolleType))?.ident;
    const methods = useForm<OpprettForsendelseFormProps>({
        defaultValues: {
            gjelderIdent: defaultGjelder,
            mottaker: {
                ident: defaultGjelder,
            },
            tema: "BID",
            språk: "NB",
        },
    });
    function onSubmit(data: OpprettForsendelseFormProps) {
        opprettForsendelseFn.mutate(data);
    }
    return (
        <FormProvider {...methods}>
            <OpprettForsendelsContainer onSubmit={onSubmit} />
        </FormProvider>
    );
}

interface OpprettForsendelsContainerProps {
    onSubmit: (data: OpprettForsendelseFormProps) => void;
}
function OpprettForsendelsContainer({ onSubmit }: OpprettForsendelsContainerProps) {
    const { forsendelseId, saksnummer } = useSession();
    const roller = useForsendelseApi().hentRoller();
    const methods = useFormContext();
    const isLoading = useIsMutating([OPPRETT_FORSENDELSE_MUTATION_KEY]) > 0;
    return (
        <ContentContainer>
            <Grid>
                <Cell xs={12} md={12} lg={10}>
                    <div className={"leading-xlarge tracking-wide"}>
                        <Heading spacing size="large">
                            {forsendelseId ? `Opprett forsendelse ${forsendelseId}` : "Opprett forsendelse"}
                        </Heading>
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)}>
                                <GjelderSelect roller={roller} />
                                <MottakerSelect />
                                <LanguageAndTemaSelect />
                                <div className="w-2/3">
                                    <DokumentValgOpprett />
                                </div>
                                <BidragErrorPanel />
                                <div className="flex flex-row gap-2 pt-4">
                                    <Button size="small" loading={isLoading}>
                                        Opprett
                                    </Button>
                                    <SlettForsendelseButton />
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </Cell>
            </Grid>
        </ContentContainer>
    );
}
