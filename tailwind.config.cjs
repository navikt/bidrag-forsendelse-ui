/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,mdx}"],
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
