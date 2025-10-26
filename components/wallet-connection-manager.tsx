"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { useAuth } from "@/contexts/auth-context";
import { WalletSelectionModal } from "./wallet-selection-modal";

export function WalletConnectionManager() {
  const wallet = useWallet();
  const auth = useAuth();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    const handleGoogleAuthSuccess = (event: CustomEvent) => {
      console.log(
        "🎉 Google OAuth successful, triggering wallet connection modal"
      );

      // Check if user is authenticated but wallet not connected
      if (auth.isAuthenticated && !wallet.connected) {
        console.log(
          "✅ User authenticated, wallet not connected - showing modal"
        );
        // Show wallet selection modal after a short delay
        setTimeout(() => {
          setIsWalletModalOpen(true);
        }, 800);
      } else {
        console.log(
          "ℹ️ Auth status:",
          auth.isAuthenticated,
          "Wallet connected:",
          wallet.connected
        );
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

  // Auto-show modal when user authenticates without wallet
  useEffect(() => {
    // Only auto-show if user just logged in (within last 5 seconds) and doesn't have wallet connected
    const googleAuthData = sessionStorage.getItem("veralux_google_auth");
    if (googleAuthData) {
      try {
        const data = JSON.parse(googleAuthData);
        const timeSinceAuth = Date.now() - data.timestamp;

        // If auth happened within last 5 seconds and wallet not connected, show modal
        if (timeSinceAuth < 5000 && auth.isAuthenticated && !wallet.connected) {
          console.log("🔄 Recent auth detected, showing wallet modal");
          setIsWalletModalOpen(true);
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }
  }, [auth.isAuthenticated, wallet.connected]);

  const handleWalletSelect = async (walletName: string) => {
    console.log("🔗 Attempting to connect to wallet:", walletName);
    try {
      // Map wallet names to their window objects for direct connection
      let walletToConnect = null;

      switch (walletName) {
        case "Suiet Wallet":
          walletToConnect = (window as any).suiet;
          break;
        case "Phantom":
          walletToConnect = (window as any).phantom?.sui;
          break;
        case "Martian Sui Wallet":
          walletToConnect = (window as any).martian;
          break;
        case "OKX Wallet":
          walletToConnect = (window as any).okxwallet?.sui;
          break;
        case "Glass Wallet":
          walletToConnect = (window as any).glass;
          break;
        case "Slush Wallet":
          walletToConnect = (window as any).slush;
          break;
        default:
          console.warn("Unknown wallet:", walletName);
      }

      if (walletToConnect) {
        console.log("✅ Wallet object found, initiating connection...");
        // Use the Suiet Wallet Kit's select method with the wallet name
        // The wallet kit should handle the connection automatically
        await wallet.select(walletName);
        console.log("🎉 Wallet connected successfully!");

        // Close modal after successful connection
        setIsWalletModalOpen(false);
      } else {
        console.error("❌ Wallet not found in window object");
        throw new Error(
          `${walletName} not found. Please install the wallet extension.`
        );
      }
    } catch (error) {
      console.error("❌ Failed to connect wallet:", error);
      // Keep modal open on error so user can try again
    }
  };

  const handleCloseModal = () => {
    console.log("❌ Wallet modal closed");
    setIsWalletModalOpen(false);
  };

  return (
    <WalletSelectionModal
      isOpen={isWalletModalOpen}
      onClose={handleCloseModal}
      onWalletSelect={handleWalletSelect}
    />
  );
}
