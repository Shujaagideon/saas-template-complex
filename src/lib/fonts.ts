import { Rowdies, Roboto, Inter as FontSans, Protest_Guerrilla, Chakra_Petch } from "next/font/google";

export const rowdies = Rowdies({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rowdies",
});

export const roboto = Roboto({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const protest = Protest_Guerrilla({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-protest"
})

export const chakra = Chakra_Petch({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-chakra"
})
