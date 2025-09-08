"use client";

import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import { ReactNode, useEffect, useState } from "react";

interface WalletProviderWrapperProps {
  children: ReactNode;
}

export function WalletProviderWrapper({
  children,
}: WalletProviderWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render children, but only wrap with WalletProvider after mounting
  if (!mounted) {
    return (
      <div suppressHydrationWarning className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <WalletProvider>
      <div suppressHydrationWarning>{children}</div>
    </WalletProvider>
  );
}
