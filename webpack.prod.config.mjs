import webpack from "webpack";
import { merge } from "webpack-merge";

import webpackCommon from "./webpack.common.config.mjs";
const { EnvironmentPlugin } = webpack;
export default merge(webpackCommon, {
    mode: "production",
    plugins: [
        // Defined as variable: default-value
        new EnvironmentPlugin({
            STATIC_FILES_URL: "",
            BIDRAG_PERSON_URL: "",
            BIDRAG_DOKUMENT_URL: "",
            BIDRAG_SAMHANDLER_URL: "",
            BIDRAG_TILGANGSKONTROLL_URL: "",
            BIDRAG_DOKUMENT_FORSENDELSE_URL: "",
            BIDRAG_DOKUMENT_ARKIV_URL: "",
            BIDRAG_SAK_URL: "",
            TELEMETRY_URL: "",
            BISYS_URL: "",
            VIS_DOKUMENTMAL_KODE: false,
            LEGACY_ENVIRONMENT: false,
            BIDRAG_KODEVERK_URL: "",
            UNLEASH_API_URL: "",
            UNLEASH_FRONTEND_TOKEN: "",
        }),
    ],
});
