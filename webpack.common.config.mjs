import { fileURLToPath } from "node:url";

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { EsbuildPlugin } from "esbuild-loader";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import webpack from "webpack";

import deps from "./package.json" with { type: "json" };
const { ModuleFederationPlugin } = webpack.container;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default {
    entry: "./src/index.tsx",
    output: {
        filename: "[name].[fullhash].js",
        path: path.resolve(__dirname, "./dist"),
    },
    experiments: {
        topLevelAwait: true,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx", ".mjs"],
    },
    optimization: {
        minimizer: [
            new EsbuildPlugin({
                target: "es2022",
                minify: false,
                format: "esm",
                sourcemap: true,
                minifyIdentifiers: false,
                minifyWhitespace: true,
                minifySyntax: true,
                globalName: "bidrag_forsendelse_ui",
                css: true,
                keepNames: true,
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
            },
            {
                test: /\.mdx?$/,
                use: [
                    {
                        loader: "@mdx-js/loader",
                        /** @type {import('@mdx-js/loader').Options} */
                        options: {
                            providerImportSource: "@mdx-js/react",
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|mov)$/i,
                type: "asset/inline",
            },
            {
                test: /\.([jt]sx?)?$/,
                exclude: /node_modules/,
                loader: "esbuild-loader",
                options: {
                    target: "es2022",
                },
            },
            {
                test: /\.svg$/,
                loader: "svg-inline-loader",
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: "process/browser",
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].[fullhash].css",
            ignoreOrder: true,
        }),
        new ModuleFederationPlugin({
            name: "bidrag_forsendelse_ui",
            filename: "remoteEntry.js",
            exposes: {
                "./Forsendelse": "./src/app.tsx",
            },
            shared: {
                react: { singleton: true, requiredVersion: deps.dependencies.react },
                "react-dom": { singleton: true, requiredVersion: deps.dependencies["react-dom"] },
            },
        }),
    ],
};
