"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { useAuth } from "@/contexts/auth-context";

export function WalletConnectionManager() {
  const wallet = useWallet();
  const auth = useAuth();
  const [shouldShowWalletModal, setShouldShowWalletModal] = useState(false);

  useEffect(() => {
    const handleGoogleAuthSuccess = (event: CustomEvent) => {
      console.log(
        "Google OAuth successful, triggering wallet connection modal"
      );

      // Check if user is authenticated but wallet not connected
      if (auth.isAuthenticated && !wallet.connected) {
        setShouldShowWalletModal(true);

        // Auto-trigger wallet connection after a short delay
        setTimeout(() => {
          // This will trigger the wallet connection modal
          const connectButton = document.querySelector(
            '[data-testid="connect-button"]'
          ) as HTMLElement;
          if (connectButton) {
            connectButton.click();
          }
        }, 1000);
      }
    };

    window.addEventListener(
      "veralux:triggerWalletConnection",
      handleGoogleAuthSuccess as EventListener
    );

    return () => {
      window.removeEventListener(
        "veralux:triggerWalletConnection",
        handleGoogleAuthSuccess as EventListener
      );
    };
  }, [auth.isAuthenticated, wallet.connected]);

  // Auto-trigger wallet connection when conditions are met
  useEffect(() => {
    if (shouldShowWalletModal && auth.isAuthenticated && !wallet.connected) {
      // Try to trigger wallet connection
      const connectButton = document.querySelector(
        ".wallet-connect-button button"
      ) as HTMLElement;
      if (connectButton) {
        connectButton.click();
        setShouldShowWalletModal(false);
      }
    }
  }, [shouldShowWalletModal, auth.isAuthenticated, wallet.connected]);

  return null; // This component doesn't render anything
}
