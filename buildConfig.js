const { dependencies: deps } = require("./package.json");

function generateBidragUiStaticUrl(appName) {
    return `/static/${appName}/${getDeployEnv()}static`;
}

function getDeployEnv() {
    if (!process.env.DEPLOY_ENV || process.env.DEPLOY_ENV === "prod") {
        return "";
    }

    return process.env.DEPLOY_ENV + "/";
}

function initFedrationScript(appName, assetsUrl) {
    return `promise new Promise((resolve) => {
            // This part depends on how you plan on hosting and versioning your federated modules
            let remoteUrl = "${assetsUrl}/remoteEntry.js";

            const script = document.createElement("script");
            script.src = remoteUrl;
            script.onload = () => {
                // the injected script has loaded and is available on window
                // we can now resolve this Promise
                const proxy = {
                    get: (request) => window.${appName}.get(request),
                    init: (arg) => {
                        try {
                            return window.${appName}.init(arg);
                        } catch (e) {
                            console.warn("App ${appName} already initialized");
                        }
                    },
                };
                resolve(proxy);
            };
            
            const logError = (message)=>{
                   fetch("/log", {
                                mode: "cors",
                                cache: "no-cache",
                                body: '{"appName": "${appName}", "message":"'+message+'", "level": "WARNING"}',
                                method: "POST",
                                headers: {
                                    "Content-type": "application/json; charset=UTF-8",
                                },
                         }).then(() => {});
            }
            //<div>
            script.onerror = (error) => {
                const proxy = {
                    get: (request) => {
                        const message = "Det skjedde en feil ved lasting av mikrofrontend app ${appName}"+request+" fra asset url ${assetsUrl} og remoteUrl " + remoteUrl
                        logError(message)
                        console.error(message, error)
                        fetch(remoteUrl).catch((err)=>logError("Feilmelding fra " + remoteUrl + ": " + err.message))
                        // If the service is down it will render this content
                        return Promise.resolve(() => () => "Det skjedde en feil");
                    },
                    init: (arg) => {
                        return;
                    },
                };
                resolve(proxy);
            };
            // inject this script with the src set to the versioned remoteEntry.js
            document.head.appendChild(script);
        })`;
}
module.exports = {
    federationConfig: {
        name: "bidrag_forsendelse_ui",
        filename: "remoteEntry.js",
        exposes: {
            "./Forsendelse": "./src/app.tsx",
        },
        shared: {
            react: { singleton: true, requiredVersion: deps.react },
            "react-dom": { singleton: true, requiredVersion: deps.react },
        },
    },
    configureRemoteApp: (appName, assetsUrl) => {
        return initFedrationScript(appName, assetsUrl ?? generateBidragUiStaticUrl(appName));
    },
};
