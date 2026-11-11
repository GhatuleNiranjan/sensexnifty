import type { Metadata } from "next";
import { Playfair_Display, Inter, Source_Serif_4 } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '900']
});

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  weight: ['400', '500', '600']
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: '--font-source-serif',
  weight: ['400', '600']
});

export const metadata: Metadata = {
  title: "SensexNifty | News Behind The Numbers",
  description: "Independent Financial Journalism. Facts First. Context Always.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} ${sourceSerif.variable} font-body bg-background text-primaryText`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}