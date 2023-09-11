import { AxiosError } from "axios";
import dayjs from "dayjs";
import { createContext, useState } from "react";
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
import { parseErrorMessageFromAxiosError } from "../../../utils/ErrorUtils";
import { queryClient } from "../../PageWrapper";

export type FormIDokument = FieldArrayWithId<IForsendelseFormProps, "dokumenter">;
interface IDokumenterContext {
    isSavingChanges: boolean;
    hasChanged: boolean;
    deleteMode: boolean;
    toggleDeleteMode: () => void;
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
    const { addError, resetError } = useErrorContext();
    const forsendelse = useForsendelseApi().hentForsendelse();
    const [deleteMode, setDeleteMode] = useState(false);
    const { reset, handleSubmit, formState, setError, resetField } = useFormContext<IForsendelseFormProps>();
    const { fields, append, update, swap } = useFieldArray<IForsendelseFormProps>({
        name: "dokumenter",
    });

    const { isDirty, dirtyFields } = formState;

    const oppdaterDokumentTittelFn = useMutation<unknown, unknown, OppdaterDokumentTittelMutationProps>({
        mutationFn: ({ tittel, dokumentreferanse }) => {
            resetError();
            return BIDRAG_FORSENDELSE_API.api.oppdaterDokument(forsendelse.forsendelseId, dokumentreferanse, {
                tittel,
            });
        },

        onError: (error: AxiosError, variables, context) => {
            const errorMessage = parseErrorMessageFromAxiosError(error);
            addError({
                message: `Det skjedde en feil ved lagring av dokumentittel "${variables.tittel}": ${errorMessage}`,
                source: "dokumenter",
            });
        },
    });

    const oppdaterDokumenterMutation = useMutation({
        mutationKey: "oppdaterDokumenterMutation",
        mutationFn: (dokumenter: IDokument[]) => {
            resetError();
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
            const errorMessage = parseErrorMessageFromAxiosError(error);
            addError({ message: `Kunne ikke lagre endringer: ${errorMessage}`, source: "dokumenter" });
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
        oppdaterDokumenterMutation.mutate(formProps.dokumenter);
    };

    const deleteDocument = (deleteDocument: FormIDokument) => {
        const index = fields.indexOf(deleteDocument);
        update(index, {
            ...deleteDocument,
            gammelStatus: deleteDocument.status,
            status:
                deleteDocument.status == DokumentStatus.SLETTET ? deleteDocument.gammelStatus : DokumentStatus.SLETTET,
        });
    };
    const updateDocument = (updatedDocument: FormIDokument) => {
        const index = fields.indexOf(updatedDocument);
        update(index, updatedDocument);
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

    function swapDocuments(indexA: number, indexB: number) {
        swap(indexA, indexB);
        submitAndSaveChanges();
    }

    function updateTitle(tittel: string, dokumentreferanse: string) {
        oppdaterDokumentTittelFn.mutate({ tittel, dokumentreferanse });
        const index = fields.find((dok) => dok.dokumentreferanse == dokumentreferanse).index;
        resetField(`dokumenter.${index}.tittel`, { defaultValue: tittel });
    }

    function submitAndSaveChanges() {
        if (formState.isSubmitted || formState.errors) {
            reset(undefined, {
                keepDirty: true,
                keepDirtyValues: true,
                keepValues: true,
            });
        }
        handleSubmit(saveChanges)();
    }

    function addDocuments(selectedDocuments: IDokument[]) {
        if (selectedDocuments != null && selectedDocuments.length > 0) {
            append(selectedDocuments);
            submitAndSaveChanges();
        }
    }
    function toggleDeleteMode() {
        if (deleteMode) {
            resetForm();
        }
        setDeleteMode((prev) => !prev);
    }
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
                addDocuments,
                deleteDocument,
                validateCanSendForsendelse,
                updateDocument,
                saveChanges: handleSubmit(saveChanges),
                swapDocuments,
                resetDocumentChanges: resetForm,
                updateTitle,
                deleteMode,
                toggleDeleteMode,
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
