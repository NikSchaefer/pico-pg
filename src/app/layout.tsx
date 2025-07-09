import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConnectionProvider } from "./context";

const inter = Inter({
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PicoPG - Lightweight Postgres Client",
  description: "A simple, lightweight Postgres client for local development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased text-foreground bg-background`}
      >
        <ConnectionProvider>{children}</ConnectionProvider>
      </body>
    </html>
  );
}
