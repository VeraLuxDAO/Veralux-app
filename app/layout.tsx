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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  other: {
    "font-geist": "https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&display=swap",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning style={{ backgroundColor: "#080E11" }}>
        {/* Background Image - Fixed positioned at top */}

        <div
          style={{ position: "relative" }}
          className="bg-transparent min-h-screen"
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
