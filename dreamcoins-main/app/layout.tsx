import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Press_Start_2P } from 'next/font/google';
import "./globals.css";
import Providers from "@/providers/providers";
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/layout/Header';
import { DreamModeProvider } from "@/contexts/DreamModeContext";
import { Suspense } from "react";

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "dreamcoins",
  description: "A token launcher built on Zora's WOW protocol",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "dreamcoins",
    description: "A token launcher built on Zora's WOW protocol",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    images: "/og-image.png",
    siteName: "dreamcoins",
    type: "website",
  },
};

export const maxDuration = 120; // 2 minutes

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} font-mono antialiased`}
      >
          <Providers>
            <>
              <Suspense fallback={<div />}>
                <Header />
              </Suspense>
              {children}
            </>
          </Providers>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

