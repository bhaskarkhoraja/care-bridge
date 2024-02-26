export const colors = {
  primary: {
    50: "#EFFAFF",
    100: "#CEEFFF",
    200: "#B6E7FF",
    300: "#95DBFF",
    400: "#81D5FF",
    500: "#61CAFF",
    600: "#58B8E8",
    700: "#458FB5",
    800: "#356F8C",
    900: "#29556B",
  },
  neutral: {
    50: "#F6F6F6",
    100: "#E2E2E2",
    200: "#D4D4D4",
    300: "#C0C0C0",
    400: "#B4B4B4",
    500: "#A1A1A1",
    600: "#939393",
    700: "#727272",
    800: "#595959",
    900: "#444444",
  },
  success: {
    50: "#EEF9E8",
    100: "#CBEDB9",
    200: "#B2E597",
    300: "#8ED967",
    400: "#79D149",
    500: "#57C61C",
    600: "#4FB419",
    700: "#3E8D14",
    800: "#306D0F",
    900: "#25530C",
  },
  warning: {
    50: "#FFF8E6",
    100: "#FFE9B1",
    200: "#FFDE8B",
    300: "#FFCF55",
    400: "#FFC535",
    500: "#FFB702",
    600: "#E8A702",
    700: "#B58201",
    800: "#8C6501",
    900: "#6B4D01",
  },
  danger: {
    50: "#FFEDEB",
    100: "#FFC6C0",
    200: "#FFAAA2",
    300: "#FF8378",
    400: "#FF6B5D",
    500: "#FF4635",
    600: "#E84030",
    700: "#B53226",
    800: "#8C271D",
    900: "#6B1D16",
  },
}

const config = {
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
      colors: colors,
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
