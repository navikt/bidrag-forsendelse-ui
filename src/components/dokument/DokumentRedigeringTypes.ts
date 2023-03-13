import { SessionStorage } from "@navikt/bidrag-ui-common";

import { IDokument } from "../../types/Dokument";

export function dokumenterToString(journalpostId: string, dokumenter?: IDokument[]) {
    return dokumenter?.map((dokument) => dokumentToString(journalpostId, dokument));
}

export function dokumentToString(journalpostId: string, dokument: IDokument) {
    return `${journalpostId}:${dokument.dokumentreferanse}`;
}

export interface EditDocumentBroadcastMessage {
    document: string;
    config?: EditDocumentConfig;
}

export interface EditDocumentConfig {
    removedPages: number[];
}

export class EditorConfigStorage {
    private static getKey = (id: string) => `editor_config_${id}`;
    static save(id: string, config: EditDocumentConfig) {
        SessionStorage.set(this.getKey(id), JSON.stringify(config));
    }

    static get(id: string): EditDocumentConfig | null {
        const configString = SessionStorage.get(this.getKey(id));
        return configString ? JSON.parse(configString) : null;
    }
}
