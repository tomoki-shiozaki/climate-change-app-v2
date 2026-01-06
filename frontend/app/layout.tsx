import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ErrorProvider } from "@/context/error";
import { ClientProviders } from "@/app/providers/ClientProviders";
import { AppContent } from "@/app/components/AppContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Climate Change App",
  description:
    "Climate Change App - Track and learn about climate change impacts",
  icons: [
    {
      rel: "icon",
      url: "/climate-logo.svg",
      type: "image/svg+xml",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#00aaff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorProvider>
          <ClientProviders>
            <AppContent>{children}</AppContent>
          </ClientProviders>
        </ErrorProvider>
      </body>
    </html>
  );
}
