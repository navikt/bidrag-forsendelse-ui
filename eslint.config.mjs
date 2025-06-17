import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jsonFormat from "eslint-plugin-json-format";
import prettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import reactHooks from "eslint-plugin-react-hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:mdx/recommended",
        "plugin:prettier/recommended",
        "plugin:react-hooks/recommended"
    ),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
            prettier,
            "json-format": jsonFormat,
            "simple-import-sort": simpleImportSort,
            "unused-imports": unusedImports,
            "react-hooks": reactHooks,
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: "module",

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        settings: {
            react: {
                version: "detect",
            },

            "json/sort-package-json": ["name", "version", "private", "scripts", "dependencies", "devDependencies"],
        },

        rules: {
            "sort-imports": "off",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "@typescript-eslint/no-explicit-any": "warn",
            "no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "@typescript-eslint/no-var-requires": "warn",
            "@typescript-eslint/no-empty-function": "warn",
            "@typescript-eslint/no-wrapper-object-types": "warn",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "@typescript-eslint/no-empty-object-type": "warn",
            "@typescript-eslint/no-unsafe-function-type": "warn",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],

            eqeqeq: ["error", "smart"],
        },
    },
    {
        files: ["**/*.js"],

        rules: {
            "no-undef": "off",
        },
    },
];
