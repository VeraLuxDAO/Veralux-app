import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { WalletProviderWrapper } from "@/components/wallet-provider-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { WalletConnectionManager } from "@/components/wallet-connection-manager";

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Background Image - Fixed positioned at top */}

        <div
          style={{ position: "relative", zIndex: 10 }}
          className="bg-background"
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            <AuthProvider>
              <WalletProviderWrapper>
                <WalletConnectionManager />

                {children}
              </WalletProviderWrapper>
            </AuthProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
