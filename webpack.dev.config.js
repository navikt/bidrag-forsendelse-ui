const { merge } = require("webpack-merge");
const webpackCommon = require("./webpack.common.config.js");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const buildConfig = require("./buildConfig");

module.exports = merge(webpackCommon, {
    mode: "development",
    devtool: "source-map",
    devServer: {
        historyApiFallback: true,
        devMiddleware: {
            writeToDisk: true,
        },
        client: {
            webSocketTransport: "ws",
        },
        webSocketServer: "ws",
        port: 8082,
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
        },
    },
    plugins: [
        new Dotenv({ path: "env/.env.local" }),
        new ReactRefreshWebpackPlugin(),
        new HtmlWebpackPlugin({
            publicPath: "/",
            template: "./src/index.html",
        }),
        new EnvironmentPlugin({
            ENABLE_MOCK: "",
        }),
        // new ModuleFederationPlugin({
        //     ...buildConfig.federationConfig,
        //     remotes: {
        //         bidrag_dokument_ui: "bidrag_dokument_ui@hhttp://localhost:8081/remoteEntry.js",
        //         // bidrag_sak_ui:
        //         //     "bidrag_sak_ui@https://bidrag-ui-static-files.intern.dev.nav.no/bidrag_sak_ui/feature/static/remoteEntry.js",
        //     },
        // }),
    ],
});
