import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const garamond = localFont({
  src: [
    {
      path: "./fonts/AppleGaramond-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/AppleGaramond-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/AppleGaramond-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-garamond",
});

const kanada = localFont({
  src: "./fonts/Kanada-WideItalic.otf",
  style: "italic",
  variable: "--font-kanada",
});

export const metadata: Metadata = {
  title: "dream™",
  description: "The first AI owned & operated company.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  icons: "/favicon.ico",
  openGraph: {
    title: "dream™",
    description: "The first AI owned & operated company.",
    images: "/og-image.png",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    type: "website",
    siteName: "dream™",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${garamond.variable} ${kanada.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
