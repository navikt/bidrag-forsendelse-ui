import { BidragCell, BidragGrid } from "@navikt/bidrag-ui-common";
import ObjectUtils from "@navikt/bidrag-ui-common/esm/utils/ObjectUtils";
import { Button, ContentContainer, ErrorSummary, Heading } from "@navikt/ds-react";
import ErrorSummaryItem from "@navikt/ds-react/esm/form/error-summary/ErrorSummaryItem";
import { useIsMutating, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FieldErrors, FormProvider, useForm, useFormContext } from "react-hook-form";

import { BIDRAG_FORSENDELSE_API } from "../../api/api";
import { JournalTema, OppdaterForsendelseForesporsel } from "../../api/BidragForsendelseApi";
import GjelderSelect from "../../components/detaljer/GjelderSelect";
import BidragErrorPanel from "../../context/BidragErrorPanel";
import { useErrorContext } from "../../context/ErrorProvider";
import { useForsendelseApi, UseForsendelseApiKeys } from "../../hooks/useForsendelseApi";
import { ENHET_FARSKAP } from "../../types/EnhetTypes";
import { mapToBehandlingInfoDto } from "../../types/Forsendelse";
import { countryCodeIso2ToIso3 } from "../../utils/AdresseUtils";
import { parseErrorMessageFromAxiosError } from "../../utils/ErrorUtils";
import { hasOnlyNullValues } from "../../utils/ObjectUtils";
import { useSession } from "../forsendelse/context/SessionContext";
import { queryClient } from "../PageWrapper";
import AvbrytOpprettForsendelseButton from "./AvbrytOpprettForsendelseButton";
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
    adresselinje1: string;
    adresselinje2?: string;
    adresselinje3?: string;
    bruksenhetsnummer?: string;
    land?: string;
    landkode?: string;
    landkode3?: string;
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
    const landkode = data.mottaker?.adresse?.landkode ?? data.mottaker?.adresse?.land;
    const hasAdresse = !ObjectUtils.isEmpty(data.mottaker?.adresse) && !hasOnlyNullValues(data.mottaker?.adresse);
    return {
        gjelderIdent: data.gjelderIdent,
        mottaker: {
            ident: data.mottaker.ident,
            navn: data.mottaker.navn,
            adresse: hasAdresse
                ? {
                      ...data.mottaker?.adresse,
                      landkode,
                      landkode3: data.mottaker?.adresse?.landkode3 ?? countryCodeIso2ToIso3(landkode),
                  }
                : undefined,
        },
        tema: data.tema as JournalTema,
        språk: data.språk,
        dokumenter: [
            {
                dokumentmalId: data.dokument.malId,
                tittel: data.dokument.tittel,
                språk: data.språk,
            },
        ],
    };
}

const OPPRETT_FORSENDELSE_MUTATION_KEY = "opprettForsendelse";
export const useOpprettForsendelseFormContext = () => useFormContext<OpprettForsendelseFormProps>();

export default function OpprettForsendelsePage() {
    const { forsendelseId, enhet } = useSession();
    if (forsendelseId) {
        return <OpprettForsendelseUnderOpprettelse />;
    }
    return <OpprettForsendelseNy />;
}
function OpprettForsendelseUnderOpprettelse() {
    const { addError } = useErrorContext();
    const { forsendelseId, navigateToForsendelse, enhet } = useSession();
    const opprettForsendelseFn = useMutation({
        mutationKey: [OPPRETT_FORSENDELSE_MUTATION_KEY],
        mutationFn: (data: OpprettForsendelseFormProps) =>
            BIDRAG_FORSENDELSE_API.api.oppdaterForsendelse(
                forsendelseId,
                mapToOpprettEllerOppdaterForsendelseRequest(data)
            ),
        onSuccess: (data) => {
            navigateToForsendelse(forsendelseId, "UTGÅENDE");
            queryClient.refetchQueries({ queryKey: UseForsendelseApiKeys.forsendelse });
        },
        onError: (error: AxiosError) => {
            const errorMessage = parseErrorMessageFromAxiosError(error);
            addError({
                message: `Kunne ikke opprette forsendelse: ${errorMessage}`,
                source: "opprettforsendelse",
            });
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
            tema: enhet == ENHET_FARSKAP ? "FAR" : "BID",
            språk: "NB",
        },
    });
    function onSubmit(data: OpprettForsendelseFormProps) {
        opprettForsendelseFn.mutate(data);
    }
    return (
        <FormProvider {...methods}>
            <OpprettForsendelsContainer tittel={forsendelse.tittel} onSubmit={onSubmit} />
        </FormProvider>
    );
}

function OpprettForsendelseNy() {
    const { saksnummer, enhet, navigateToForsendelse } = useSession();
    const { addError } = useErrorContext();
    const options = useOpprettForsendelse();
    const opprettForsendelseFn = useMutation({
        mutationKey: [OPPRETT_FORSENDELSE_MUTATION_KEY],
        mutationFn: (data: OpprettForsendelseFormProps) => {
            const request = mapToOpprettEllerOppdaterForsendelseRequest(data);
            return BIDRAG_FORSENDELSE_API.api.opprettForsendelse({
                ...request,
                gjelderIdent: data.gjelderIdent,
                enhet: enhet,
                saksnummer,
                opprettTittel: true,
                behandlingInfo: mapToBehandlingInfoDto(options),
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
        onError: (error: AxiosError) => {
            const errorMessage = parseErrorMessageFromAxiosError(error);
            addError({
                message: `Kunne ikke opprette forsendelse: ${errorMessage}`,
                source: "opprettforsendelse",
            });
        },
        onSuccess: (data) => {
            const forsendelseId = data.data.forsendelseId;
            navigateToForsendelse(forsendelseId?.toString(), data.data.forsendelseType);
        },
    });

    const methods = useForm<OpprettForsendelseFormProps>({
        defaultValues: {
            tema: enhet == ENHET_FARSKAP ? "FAR" : "BID",
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
    tittel?: string;
}
function OpprettForsendelsContainer({ onSubmit, tittel }: OpprettForsendelsContainerProps) {
    const { forsendelseId } = useSession();
    const forsendelseEksisterer = forsendelseId != null;
    const roller = useForsendelseApi().hentRoller();
    const methods = useFormContext();
    const isLoading = useIsMutating({ mutationKey: [OPPRETT_FORSENDELSE_MUTATION_KEY] }) > 0;
    return (
        <ContentContainer>
            <BidragGrid>
                <BidragCell xs={12} md={12} lg={10}>
                    <div className={"leading-xlarge tracking-wide"}>
                        <Heading size="large">{tittel ? `${tittel}` : "Opprett forsendelse"}</Heading>

                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)}>
                                <GjelderSelect roller={roller} />
                                <MottakerSelect />
                                <LanguageAndTemaSelect />
                                <div className="w-2/3">
                                    <DokumentValgOpprett />
                                </div>
                                <BidragErrorPanel />
                                <OpprettForsendelsValidationErrorSummary />
                                <div className="flex flex-row gap-2 pt-4">
                                    <Button size="small" loading={isLoading}>
                                        Opprett
                                    </Button>
                                    {forsendelseEksisterer ? (
                                        <SlettForsendelseButton />
                                    ) : (
                                        <AvbrytOpprettForsendelseButton disabled={isLoading} />
                                    )}
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </BidragCell>
            </BidragGrid>
        </ContentContainer>
    );
}

function OpprettForsendelsValidationErrorSummary() {
    const {
        formState: { errors },
    } = useFormContext<OpprettForsendelseFormProps>();

    function getAllErrors(errors: FieldErrors<OpprettForsendelseFormProps>): string[] {
        const allErrors = [];
        Object.keys(errors).forEach((key) => {
            const errorsValue = errors[key];
            if (errorsValue && !errorsValue.ref) {
                const errorMessages = getAllErrors(errorsValue);
                errorMessages.forEach((d) => allErrors.push(d));
            } else {
                const message = errors[key].message;
                if (message) {
                    allErrors.push(message);
                }
            }
        });
        return allErrors.filter((error) => error && error.trim().length > 0);
    }
    if (getAllErrors(errors).length == 0) {
        return null;
    }

    return (
        <ErrorSummary heading={"Følgende må rettes opp før forsendelse kan opprettes"} className="mt-4">
            {getAllErrors(errors)?.map((err, i) => <ErrorSummaryItem key={"err" + i}>{err}</ErrorSummaryItem>)}
        </ErrorSummary>
    );
}
