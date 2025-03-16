import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CommandMenu } from "@/components/command-menu";
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
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${inter.variable} antialiased text-foreground bg-background`}
      >
        <ConnectionProvider>
          {children}
          <CommandMenu />
          <Toaster richColors closeButton position="top-center" />
        </ConnectionProvider>
      </body>
    </html>
  );
}
