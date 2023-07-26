import { AxiosError } from "axios";
import dayjs from "dayjs";
import { createContext } from "react";
import { PropsWithChildren } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { FieldArrayWithId } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useMutation } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../../../api/api";
import { OppdaterForsendelseForesporsel } from "../../../api/BidragForsendelseApi";
import { DokumentStatus } from "../../../constants/DokumentStatus";
import { useErrorContext } from "../../../context/ErrorProvider";
import { useForsendelseApi } from "../../../hooks/useForsendelseApi";
import { IDokument } from "../../../types/Dokument";
import { queryClient } from "../../PageWrapper";

export type FormIDokument = FieldArrayWithId<IForsendelseFormProps, "dokumenter">;
interface IDokumenterContext {
    isSavingChanges: boolean;
    hasChanged: boolean;
    saveChanges: () => void;
    validateCanSendForsendelse: () => boolean;
    forsendelseId: string;
    dokumenter: FormIDokument[];
    swapDocuments: (from: number, to: number) => void;
    addDocuments: (selectedDocuments: IDokument[]) => void;
    deleteDocument: (deleteDocument: FormIDokument) => void;
    updateDocument: (updatedDocument: FormIDokument) => void;
    resetDocumentChanges: () => void;
    updateTitle: (tittel: string, dokumentreferanse: string) => void;
}

interface IDokumenterPropsContext {
    forsendelseId: string;
}

export interface IForsendelseFormProps {
    dokumenter: IDokument[];
}

export type OppdaterDokumentTittelMutationProps = { tittel: string; dokumentreferanse: string };
export const DokumenterFormContext = createContext<IDokumenterContext>({} as IDokumenterContext);

function DokumenterFormProvider({ children, ...props }: PropsWithChildren<IDokumenterPropsContext>) {
    const forsendelse = useForsendelseApi().hentForsendelse();
    const methods = useForm<IForsendelseFormProps>({
        defaultValues: {
            dokumenter: forsendelse.dokumenter,
        },
    });

    return (
        <FormProvider {...methods}>
            <DokumenterProvider {...props}>{children}</DokumenterProvider>
        </FormProvider>
    );
}

function DokumenterProvider({ children, ...props }: PropsWithChildren<IDokumenterPropsContext>) {
    const { addError } = useErrorContext();
    const forsendelse = useForsendelseApi().hentForsendelse();
    const { reset, handleSubmit, formState, setError } = useFormContext<IForsendelseFormProps>();
    const { fields, append, update, swap } = useFieldArray<IForsendelseFormProps>({
        name: "dokumenter",
    });

    const { isDirty, dirtyFields } = formState;

    const oppdaterDokumentTittelFn = useMutation<unknown, unknown, OppdaterDokumentTittelMutationProps>({
        mutationFn: ({ tittel, dokumentreferanse }) =>
            BIDRAG_FORSENDELSE_API.api.oppdaterDokument(forsendelse.forsendelseId, dokumentreferanse, { tittel }),
        onError: (error, variables, context) => {
            console.log(error, variables, context);
            addError(`Det skjedde en feil ved lagring av dokumentittel "${variables.tittel}"`);
        },
    });

    const oppdaterDokumenterMutation = useMutation({
        mutationFn: (dokumenter: IDokument[]) => {
            const request: OppdaterForsendelseForesporsel = {
                dokumenter: dokumenter.map((dokument) => ({
                    dokumentreferanse: dokument.dokumentreferanse,
                    dokumentmalId: dokument.dokumentmalId,
                    dokumentDato: dayjs(dokument.dokumentDato).format("YYYY-MM-DDTHH:mm:ss"),
                    fjernTilknytning: dokument.status == DokumentStatus.SLETTET,
                    tittel: dokument.tittel,
                    journalpostId: dokument.journalpostId,
                })),
            };
            return BIDRAG_FORSENDELSE_API.api.oppdaterForsendelse(props.forsendelseId, request);
        },
        onSuccess: () => {
            queryClient.invalidateQueries("forsendelse");
        },
        onError: (error: AxiosError, variables, context) => {
            const errorMessage = error.response?.headers?.["warning"];
            addError(`Kunne ikke lagre endringer: ${errorMessage}`);
        },
    });
    useEffect(() => {
        if (!forsendelse.isStaleData) {
            resetForm();
        }
    }, [forsendelse.dokumenter]);

    const resetForm = () => {
        reset({
            dokumenter: forsendelse.dokumenter,
        });
    };
    const saveChanges = (formProps: IForsendelseFormProps) => {
        console.log(formProps);
        oppdaterDokumenterMutation.mutate(formProps.dokumenter);
    };

    const deleteDocument = (deleteDocument: FormIDokument) => {
        const index = fields.indexOf(deleteDocument);
        update(index, {
            ...deleteDocument,
            status: DokumentStatus.SLETTET,
        });
    };
    const updateDocument = (updatedDocument: FormIDokument) => {
        const index = fields.indexOf(updatedDocument);
        update(index, {
            ...updatedDocument,
            status: DokumentStatus.SLETTET,
        });
    };

    function validateCanSendForsendelse() {
        if (isDirty) {
            setError("root", { message: "Endringene må lagres før distribusjon av forsendelse kan bestilles" });
            return false;
        }
        let isValid = true;
        let index = 0;
        for (const dok of fields) {
            const hasValidState = [DokumentStatus.FERDIGSTILT, DokumentStatus.KONTROLLERT].includes(dok.status);
            if (!hasValidState) {
                isValid = false;
                const errorMessage =
                    dok.status == DokumentStatus.MÅ_KONTROLLERES
                        ? `Dokument "${dok.tittel}" må kontrolleres`
                        : `Dokument "${dok.tittel}" må ferdigstilles`;
                setError(`dokumenter.${index}`, { message: errorMessage });
            }
            index++;
        }
        return isValid;
    }

    useEffect(() => {
        const isSwapped = dirtyFields.dokumenter?.some((d) => d.index == true);
        if (isSwapped) handleSubmit(saveChanges)();
    }, [dirtyFields]);

    const hasChanged =
        isDirty &&
        dirtyFields.dokumenter?.filter((dok) => {
            return !(dok.tittel && Object.keys(dok).length == 1);
        }).length > 0;
    return (
        <DokumenterFormContext.Provider
            value={{
                forsendelseId: props.forsendelseId,
                dokumenter: fields,
                hasChanged: hasChanged,
                isSavingChanges: oppdaterDokumenterMutation.isLoading,
                addDocuments: append,
                deleteDocument,
                validateCanSendForsendelse,
                updateDocument,
                saveChanges: handleSubmit(saveChanges),
                swapDocuments: swap,
                resetDocumentChanges: resetForm,
                updateTitle: (tittel, dokumentreferanse) =>
                    oppdaterDokumentTittelFn.mutate({ tittel, dokumentreferanse }),
            }}
        >
            {children}
        </DokumenterFormContext.Provider>
    );
}
function useDokumenterForm() {
    const context = useContext(DokumenterFormContext);
    if (context === undefined) {
        throw new Error("useDokumenter must be used within a ForsendelseProvider");
    }
    return context;
}

export { DokumenterFormProvider, useDokumenterForm };
