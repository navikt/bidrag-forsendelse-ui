import dayjs from "dayjs";
import { createContext } from "react";
import { PropsWithChildren } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useMutation } from "react-query";

import { BIDRAG_FORSENDELSE_API } from "../../../api/api";
import { OppdaterForsendelseForesporsel } from "../../../api/BidragForsendelseApi";
import { DokumentStatus } from "../../../constants/DokumentStatus";
import { useForsendelseApi } from "../../../hooks/useForsendelseApi";
import { arraysDeepEqual } from "../../../types/ArrayUtils";
import { arrayMove } from "../../../types/ArrayUtils";
import { IDokument } from "../../../types/Dokument";
import { queryClient } from "../../PageWrapper";

interface IDokumenterContext {
    isSavingChanges: boolean;
    hasChanged: boolean;
    saveChanges: () => void;
    forsendelseId: string;
    dokumenter: IDokument[];
    originalDocuments: IDokument[];
    swapDocuments: (from: number, to: number) => void;
    addDocuments: (selectedDocuments: IDokument[]) => void;
    deleteDocument: (deleteDocument: IDokument) => void;
    updateDocument: (updatedDocument: IDokument) => void;
    resetDocumentChanges: () => void;
}

interface IDokumenterPropsContext {
    forsendelseId: string;
}

export const DokumenterContext = createContext<IDokumenterContext>({} as IDokumenterContext);

function DokumenterProvider({ children, ...props }: PropsWithChildren<IDokumenterPropsContext>) {
    const forsendelse = useForsendelseApi().hentForsendelse();
    const [originalDocuments, setOriginalDocuments] = useState<IDokument[]>([...forsendelse.dokumenter]);
    const [renderedDocuments, setRenderedDocuments] = useState<IDokument[]>([...forsendelse.dokumenter]);
    const [isSavingChanges, setIsSavingChanges] = useState(false);
    const [error, setError] = useState();

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
            setIsSavingChanges(false);
            queryClient.invalidateQueries("forsendelse");
        },
        onError: (error, variables, context) => {
            console.log(error, variables, context);
        },
    });
    useEffect(() => {
        if (!forsendelse.isStaleData) {
            setRenderedDocuments([...forsendelse.dokumenter]);
            setOriginalDocuments([...forsendelse.dokumenter]);
        }
    }, [forsendelse.dokumenter]);

    const hasChanged = !arraysDeepEqual(renderedDocuments, originalDocuments);

    const saveChanges = () => {
        setIsSavingChanges(true);
        oppdaterDokumenterMutation.mutate(renderedDocuments);
    };
    const addDocuments = (selectedDocuments: IDokument[]) => {
        const numberOfExisting = renderedDocuments.length;
        setRenderedDocuments((dokumenter) => [
            ...dokumenter,
            ...selectedDocuments.map((d, index) => ({
                ...d,
                index: index + numberOfExisting,
            })),
        ]);
    };

    const isSameDocument = (dok1: IDokument, dok2: IDokument) => {
        const hasSameJournalpostId = dok1.journalpostId == dok2.journalpostId;
        const hasSameDokref = dok1.dokumentreferanse == dok2.dokumentreferanse;

        return hasSameJournalpostId && hasSameDokref;
    };

    const deleteDocument = (deleteDocument: IDokument) => {
        setRenderedDocuments((dokumenter) =>
            dokumenter.map((dok) => {
                if (isSameDocument(dok, deleteDocument)) {
                    return {
                        ...deleteDocument,
                        status: DokumentStatus.SLETTET,
                    };
                }
                return dok;
            })
        );
    };
    const updateDocument = (updatedDocument: IDokument) => {
        setRenderedDocuments((dokumenter) =>
            dokumenter.map((dok) => {
                if (isSameDocument(dok, updatedDocument)) {
                    return updatedDocument;
                }
                return dok;
            })
        );
    };

    const swapDocuments = (fromIndex: number, toIndex: number) => {
        setRenderedDocuments((dokumenter) => arrayMove(dokumenter, fromIndex, toIndex));
    };

    return (
        <DokumenterContext.Provider
            value={{
                forsendelseId: props.forsendelseId,
                dokumenter: renderedDocuments,
                originalDocuments,
                hasChanged,
                isSavingChanges,
                addDocuments,
                deleteDocument,
                updateDocument,
                saveChanges,
                swapDocuments,
                resetDocumentChanges: () => setRenderedDocuments(originalDocuments),
            }}
        >
            {children}
        </DokumenterContext.Provider>
    );
}
function useDokumenter() {
    const context = useContext(DokumenterContext);
    if (context === undefined) {
        throw new Error("useDokumenter must be used within a ForsendelseProvider");
    }
    return context;
}

export { DokumenterProvider, useDokumenter };
