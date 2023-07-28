import { Provider } from "@navikt/ds-react";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./app";

const rootElement = document.getElementById("root") as HTMLElement;
const appElement = document.createElement("div");
rootElement.appendChild(appElement);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Provider rootElement={rootElement} appElement={appElement}>
        <App />
    </Provider>
);
