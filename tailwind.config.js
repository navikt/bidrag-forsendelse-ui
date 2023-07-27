/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,mdx}"],
    presets: [require("@navikt/ds-tailwind")],
    safelist: ["border-border-danger", "border-solid", "border-2"],
    theme: {
        extend: {
            gridTemplateColumns: {
                "auto-2": "repeat(2, auto)",
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: false,
    },
};
