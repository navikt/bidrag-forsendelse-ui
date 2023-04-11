import { LoggerService } from "@navikt/bidrag-ui-common";

import { EditDocumentBroadcastMessage } from "../components/dokument/DokumentRedigeringTypes";
import { EditorConfigStorage } from "../components/dokument/DokumentRedigeringTypes";

export default class OpenDocumentUtils {
    static åpneDokument(journalpostid: string, dokumentreferanse?: string) {
        window.open(`/aapnedokument/${journalpostid}${dokumentreferanse ? "/" + dokumentreferanse : ""}`);
    }

    static åpneDokumenter(dokumenter: string[]) {
        window.open(`/aapnedokument?${dokumenter.map((d) => `dokument=${d}`).join("&")}`);
    }

    static openDocumentEditorWithDocuments(
        dokumenter: string[],
        editedDocument?: EditDocumentBroadcastMessage,
        id?: string
    ) {
        LoggerService.info(`Åpner dokumenter ${dokumenter} på nettleser`);
        const dokumenterPath = dokumenter.map((dokument) => `dokument=${dokument}`).join("&");
        id && editedDocument && EditorConfigStorage.save(id, editedDocument?.config);
        window.open(`/rediger/?${dokumenterPath}&id=${id}`);
    }

    static openDocumentEditor(journalpostId: string, editedDocument?: EditDocumentBroadcastMessage, id?: string) {
        LoggerService.info(`Åpner dokument ${journalpostId} på nettleser`);
        id && editedDocument && EditorConfigStorage.save(id, editedDocument?.config);
        window.open(`/rediger/${journalpostId}?id=${id}`);
    }

    static openDocumentMaskingEditor(
        forsendelseId: string,
        dokumentreferanse: string,
        editedDocument?: EditDocumentBroadcastMessage,
        id?: string
    ) {
        LoggerService.info(
            `Åpner redigering av forsendelse ${forsendelseId} og dokument ${dokumentreferanse} på nettleser`
        );
        id && editedDocument && EditorConfigStorage.save(id, editedDocument?.config);
        window.open(`/rediger/masker/${forsendelseId}/${dokumentreferanse}?id=${id}`);
    }
}
