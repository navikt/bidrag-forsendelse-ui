import { BidragCell, BidragGrid, dateToDDMMYYYYString, LoggerService } from "@navikt/bidrag-ui-common";
import { Button, ContentContainer, ErrorSummary, Heading } from "@navikt/ds-react";
import ErrorSummaryItem from "@navikt/ds-react/esm/form/error-summary/ErrorSummaryItem";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FieldErrors, FormProvider, useForm, useFormContext } from "react-hook-form";

import { BIDRAG_FORSENDELSE_API } from "../../api/api";
import { ForsendelseTypeTo, JournalTema } from "../../api/BidragForsendelseApi";
import GjelderSelect from "../../components/detaljer/GjelderSelect";
import TemaSelect from "../../components/detaljer/TemaSelect";
import { DokumentFormProps } from "../../components/dokument/DokumentValg";
import DokumentValgNotat from "../../components/dokument/DokumentValgNotat";
import BidragErrorPanel from "../../context/BidragErrorPanel";
import { useErrorContext } from "../../context/ErrorProvider";
import { useForsendelseApi } from "../../hooks/useForsendelseApi";
import { ENHET_FARSKAP } from "../../types/EnhetTypes";
import { mapToBehandlingInfoDto } from "../../types/Forsendelse";
import { parseErrorMessageFromAxiosError } from "../../utils/ErrorUtils";
import { useSession } from "../forsendelse/context/SessionContext";
import AvbrytOpprettForsendelseButton from "../opprettforsendelse/AvbrytOpprettForsendelseButton";
import { useOpprettForsendelse } from "../opprettforsendelse/OpprettForsendelseContext";
import Dokumentdato from "./Dokumentdato";

export type OpprettForsendelseFormProps = {
    gjelderIdent: string;
    mottakerIdent: string;
    dokumentdato: string;
    dokumenter: DokumentFormProps[];
    språk: string;
    tema: "BID" | "FAR";
    enhet: string;
};

export default function OpprettNotatPage() {
    const { saksnummer, enhet, navigateToForsendelse } = useSession();
    const { addError } = useErrorContext();
    const options = useOpprettForsendelse();
    async function opprettNotat(data: OpprettForsendelseFormProps, dokument: DokumentFormProps) {
        const result = await BIDRAG_FORSENDELSE_API.api.opprettForsendelse({
            gjelderIdent: data.gjelderIdent,
            mottaker: {
                ident: data.gjelderIdent,
            },
            saksnummer,
            opprettTittel: true,
            enhet: enhet,
            tema: data.tema as JournalTema,
            språk: data.språk,
            behandlingInfo: mapToBehandlingInfoDto(options),
            dokumenter: [
                {
                    dokumentmalId: dokument.malId,
                    tittel: dokument.tittel,
                    språk: data.språk,
                    bestillDokument: true,
                    dokumentDato: data.dokumentdato ? `${data.dokumentdato}-00-00-00` : null,
                },
            ],
        });

        LoggerService.info("Opprettet notat med forsendelseId " + result.data.forsendelseId);
    }
    const opprettForsendelseFn = useMutation({
        mutationFn: async (data: OpprettForsendelseFormProps) => {
            for (const dokument of data.dokumenter.filter((dokument) => dokument != undefined)) {
                await opprettNotat(data, dokument);
            }
            return null;
        },
        onSuccess: () => {
            navigateToForsendelse(null, ForsendelseTypeTo.NOTAT);
        },
        onError: (error: AxiosError) => {
            const errorMessage = parseErrorMessageFromAxiosError(error);
            addError({ message: `Kunne ikke opprettet notat: ${errorMessage}`, source: "opprettnotat" });
        },
    });

    const roller = useForsendelseApi().hentRoller();
    const methods = useForm<OpprettForsendelseFormProps>({
        defaultValues: {
            dokumentdato: dateToDDMMYYYYString(new Date()),
            tema: enhet == ENHET_FARSKAP ? "FAR" : "BID",
            språk: "NB",
        },
    });
    function onSubmit(data: OpprettForsendelseFormProps) {
        opprettForsendelseFn.mutate(data);
    }
    const isLoading = opprettForsendelseFn.isPending || opprettForsendelseFn.isSuccess;
    return (
        <ContentContainer>
            <BidragGrid>
                <BidragCell xs={12} md={12} lg={10}>
                    <div className={"leading-xlarge tracking-wide"}>
                        <Heading spacing size="large">
                            Opprett notat
                        </Heading>
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)}>
                                <GjelderSelect roller={roller} />
                                <div className="flex flex-row gap-4 pb-4">
                                    <TemaSelect />
                                    <Dokumentdato />
                                </div>
                                <div className="w-2/3">
                                    <DokumentValgNotat />
                                </div>
                                <BidragErrorPanel />
                                <OpprettNotatValidationErrorSummary />
                                <div className="flex flex-row gap-2 pt-4">
                                    <Button size="small" loading={isLoading}>
                                        Opprett
                                    </Button>
                                    <AvbrytOpprettForsendelseButton disabled={isLoading} />
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </BidragCell>
            </BidragGrid>
        </ContentContainer>
    );
}

function OpprettNotatValidationErrorSummary() {
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
        <ErrorSummary heading={"Følgende må rettes opp før notat kan opprettes"} className="mt-4">
            {getAllErrors(errors)?.map((err, i) => <ErrorSummaryItem key={"err" + i}>{err}</ErrorSummaryItem>)}
        </ErrorSummary>
    );
}
