import environment from "../environment";

export function getSessionStateFromParam() {
    const sessionState = getParamFromUrl("sessionState");
    return sessionState ? `sessionState=${getParamFromUrl("sessionState")}` : "";
}

export const RedirectTo = {
    oppgaveListe: () => {
        window.location.href = `${environment.url.bisys}Oppgaveliste.do?${getSessionStateFromParam()}`;
    },
    behandleSak: (saksnr: string, openInNewTab?: boolean) => {
        const url = `${environment.url.bisys}Sak.do?saksnr=${saksnr}&${getSessionStateFromParam()}`;
        if (openInNewTab) {
            window.open(url, "_blank").focus();
        } else {
            window.location.href = url;
        }
    },

    sakshistorikk: (saksnr: string) => {
        const bisysurl = environment.url.bisys;
        window.location.href = `${bisysurl}Sakshistorikk.do?saksnr=${saksnr}&${getSessionStateFromParam()}`;
    },
    joarkJournalpostId: (journalpostId: string, joarkJournalpostId: string) => {
        const currentUrl = window.location.href.replace(journalpostId, joarkJournalpostId);
        window.location.href = currentUrl;
    },
};

function getParamFromUrl(paramKey: string) {
    const queryParams = window.location.search;
    const urlParams = new URLSearchParams(queryParams);
    return urlParams.get(paramKey);
}
