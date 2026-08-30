import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";

import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://baharia.example"),
  title: {
    default: "Baharia",
    template: "%s — Baharia",
  },
  description:
    "Baharia is a boutique coastal retreat shaped by landscape, light, and considered hospitality.",
  applicationName: "Baharia",
  generator: "Next.js",
  keywords: [
    "Baharia",
    "boutique hotel",
    "luxury resort",
    "coastal retreat",
    "hospitality",
  ],
  authors: [
    {
      name: "Baharia",
    },
  ],
  creator: "Bilal Ahmad",
  publisher: "OmniSyntax",
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#F4EDE4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}