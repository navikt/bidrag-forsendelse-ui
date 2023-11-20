const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const { EsbuildPlugin } = require("esbuild-loader");

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
    optimization: {
        minimizer: [
            new EsbuildPlugin({
                target: "ESnext",
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
                    target: "ESnext",
                },
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
