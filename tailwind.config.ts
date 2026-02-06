import type { Config } from "tailwindcss";

export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "ici-red": "#D80010",
                "amg-blue": "#009DD6",
                "ici-grey": "#313D48",
                "ici-navy": "#00105F",
                "ici-light-grey": "#7B7B7B",
            },
        },
    },
    plugins: [
        require("@tailwindcss/aspect-ratio"),
    ],
} satisfies Config;
