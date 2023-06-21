const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "[name].[fullhash].js",
        path: path.resolve(__dirname, "./dist"),
    },
    experiments: {
        topLevelAwait: true,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", "jsx"],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
            },
            {
                test: /\.([jt]sx?)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "swc-loader",
                        options: {
                            jsc: {
                                parser: {
                                    syntax: "typescript",
                                    tsx: true,
                                    dynamicImport: true,
                                    privateMethod: false,
                                    functionBind: false,
                                    exportDefaultFrom: false,
                                    exportNamespaceFrom: false,
                                    decorators: false,
                                    decoratorsBeforeExport: false,
                                    topLevelAwait: true,
                                    importMeta: false,
                                },
                                transform: {
                                    react: {
                                        runtime: "automatic",
                                        refresh: isDevelopment,
                                    },
                                },
                                minify: {
                                    compress: false,
                                    mangle: false,
                                },
                                target: "es2022",
                                loose: false,
                                externalHelpers: false,
                                // Requires v1.2.50 or upper and requires target to be es2016 or upper.
                                keepClassNames: true,
                            },
                            minify: false,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                loader: "svg-inline-loader",
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
                react: { singleton: true, requiredVersion: deps.react },
                "react-dom": { singleton: true, requiredVersion: deps.react },
            },
        }),
    ],
};
