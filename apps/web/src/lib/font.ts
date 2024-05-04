import { Agbalumo } from "next/font/google"
import { GeistSans } from "geist/font/sans"

// NOTE: exporting font from here because third party library will be importanted first
// due to prettier import config. this will cause the font not to load
export const fontSans = GeistSans

const agbalumo = Agbalumo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-agbalumo-serif",
})
export const fontAgbalumo = agbalumo
