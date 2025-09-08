import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { WalletProviderWrapper } from "@/components/wallet-provider-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { AIChat } from "@/components/ai-chat";

export const metadata: Metadata = {
  title: "VeraLux - Web3 Identity & Reputation Platform",
  description:
    "The integrated dApp for authentic digital identity, reputation, and community engagement in Web3",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable} overflow-hidden`}
      suppressHydrationWarning
    >
      <body className={GeistSans.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <WalletProviderWrapper>{children}</WalletProviderWrapper>
          <AIChat />
        </ThemeProvider>
      </body>
    </html>
  );
}
