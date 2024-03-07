import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    important: true,
    extend: {
      container: () => {
        return {
          center: true,
          padding: "1rem",
          screens: {
            "2xl": "1240px",
          },
        }
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
      },
      fontSize: {
        // Display
        "display-large": ["60px", { lineHeight: "72px" }],
        "display-medium": ["48px", { lineHeight: "56px" }],
        "display-small": ["36px", { lineHeight: "44px" }],
        // Heading
        "heading-large": ["30px", { lineHeight: "40px" }],
        "heading-medium": ["24px", { lineHeight: "36px" }],
        "heading-small": ["20px", { lineHeight: "22px" }],
        // Body
        "body-large": ["20px", { lineHeight: "30px" }],
        "body-medium": ["18px", { lineHeight: "28px" }],
        "body-small": ["16px", { lineHeight: "24px" }],
        "body-extra-small": ["14px", { lineHeight: "21px" }],

        // Meta
        "meta-large": ["14px", { lineHeight: "14px" }],
        "meta-medium": ["12px", { lineHeight: "12px" }],
        "meta-small": ["12px", { lineHeight: "15px" }],
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
