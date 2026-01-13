"use client";

import { useEffect, useState, useRef } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { useAuth } from "@/contexts/auth-context";
import { WalletSelectionModal } from "./wallet-selection-modal";
import { toast } from "sonner";

export function WalletConnectionManager() {
  const wallet = useWallet();
  const auth = useAuth();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [hasPromptedWallet, setHasPromptedWallet] = useState(false);
  const authRef = useRef(auth.isAuthenticated);
  const walletRef = useRef(wallet.connected);

  // Keep refs in sync with current values
  useEffect(() => {
    authRef.current = auth.isAuthenticated;
    walletRef.current = wallet.connected;
  }, [auth.isAuthenticated, wallet.connected]);

  useEffect(() => {
    const handleGoogleAuthSuccess = (event: CustomEvent) => {
      console.log(
        "🎉 Google OAuth successful, triggering wallet connection modal"
      );

      // Use a small delay to ensure state is updated, then check current state
      setTimeout(() => {
        // Check current state (not from closure)
        const isAuthenticated = authRef.current;
        const isWalletConnected = walletRef.current;

        console.log(
          "ℹ️ Current auth status:",
          isAuthenticated,
          "Wallet connected:",
          isWalletConnected
        );

        // Check if user is authenticated but wallet not connected
        if (isAuthenticated && !isWalletConnected && !hasPromptedWallet) {
          console.log(
            "✅ User authenticated, wallet not connected - showing modal"
          );
          setIsWalletModalOpen(true);
          setHasPromptedWallet(true);
        } else if (isAuthenticated && isWalletConnected) {
          console.log("✅ User authenticated and wallet already connected");
        }
      }, 500);
    };

    window.addEventListener(
      "veralux:triggerWalletConnection",
      handleGoogleAuthSuccess as EventListener
    );

    // Allow manual wallet switch/open from anywhere in the app
    const handleManualOpen = () => {
      console.log("ℹ️ Manual wallet selector requested");
      setIsWalletModalOpen(true);
      setHasPromptedWallet(true);
    };
    window.addEventListener("veralux:openWalletSelector", handleManualOpen);

    return () => {
      window.removeEventListener(
        "veralux:triggerWalletConnection",
        handleGoogleAuthSuccess as EventListener
      );
      window.removeEventListener("veralux:openWalletSelector", handleManualOpen);
    };
  }, [hasPromptedWallet]); // listener is set up once, re-run if prompt flag changes

  // Reset prompt when auth state changes
  useEffect(() => {
    if (auth.isAuthenticated) {
      setHasPromptedWallet(false);
    }
  }, [auth.isAuthenticated]);

  // Auto-show modal when user authenticates without wallet
  useEffect(() => {
    // Reset prompt tracking and close modal on logout
    if (!auth.isAuthenticated) {
      setIsWalletModalOpen(false);
      setHasPromptedWallet(false);
      // Also ensure wallet is disconnected when logging out
      if (wallet.connected) {
        wallet.disconnect?.().catch((err) =>
          console.warn("Wallet disconnect on logout failed:", err)
        );
      }
      return;
    }

    // Only auto-show if user is authenticated and wallet not connected
    if (wallet.connected) {
      return; // Don't show if wallet already connected
    }

    const googleAuthData = sessionStorage.getItem("veralux_google_auth");
    const showModal = (reason: string, delay = 600) => {
      console.log(`🔄 Showing wallet modal because: ${reason}`);
      const timeoutId = setTimeout(() => {
        // Double-check state before showing modal
        if (authRef.current && !walletRef.current) {
          console.log("✅ Showing wallet modal after authentication without wallet");
          setIsWalletModalOpen(true);
          setHasPromptedWallet(true);
        }
      }, delay);

      return () => clearTimeout(timeoutId);
    };

    if (googleAuthData) {
      try {
        const data = JSON.parse(googleAuthData);
        const timeSinceAuth = Date.now() - data.timestamp;

        // If auth happened within last 2 minutes and wallet not connected, show modal
        if (timeSinceAuth < 120000) {
          return showModal("recent Google auth detected");
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }

    // Fallback: authenticated session without wallet connection
    return showModal("authenticated without wallet connection");
  }, [auth.isAuthenticated, wallet.connected, isWalletModalOpen, hasPromptedWallet, wallet]);

  // If wallet disconnects while authenticated, allow switching wallets by re-opening modal
  useEffect(() => {
    if (auth.isAuthenticated && !wallet.connected) {
      setHasPromptedWallet(false);
      setIsWalletModalOpen(true);
    }
  }, [auth.isAuthenticated, wallet.connected]);

  const handleWalletSelect = async (walletName: string) => {
    console.log("🔗 Attempting to connect to wallet:", walletName);
    try {
      // Collect wallets the kit knows about
      const allWallets: any[] = [];
      if ("configuredWallets" in wallet && Array.isArray((wallet as any).configuredWallets)) {
        allWallets.push(...(wallet as any).configuredWallets);
      }
      if ("detectedWallets" in wallet && Array.isArray((wallet as any).detectedWallets)) {
        allWallets.push(...(wallet as any).detectedWallets);
      }

      // Try to resolve the identifier the kit expects.
      // Prefer an exact name match, then a loose match, otherwise fall back to the display name.
      let walletIdentifier = walletName;
      if (allWallets.length > 0) {
        const exact = allWallets.find((w: any) => w.name === walletName);
        const loose = allWallets.find(
          (w: any) => w.name?.toLowerCase().includes(walletName.toLowerCase()) ||
            walletName.toLowerCase().includes(w.name?.toLowerCase() || "")
        );
        if (exact) walletIdentifier = exact.name;
        else if (loose) walletIdentifier = loose.name;
      }

      // If the kit knows about the wallet, ensure it's installed
      if (allWallets.length > 0) {
        const targetWallet = allWallets.find((w: any) => w.name === walletIdentifier);
        if (targetWallet && targetWallet.installed === false) {
          console.error("❌ Wallet not installed:", walletIdentifier);
          throw new Error(`${walletName} is not installed. Please install the wallet extension.`);
        }
      }

      console.log("✅ Initiating wallet connection with identifier:", walletIdentifier);
      // Use the Suiet Wallet Kit's select method with the identifier the kit expects
      await wallet.select(walletIdentifier);
      console.log("🎉 Wallet connected successfully!");

      // Close modal after successful connection
      setIsWalletModalOpen(false);
    } catch (error) {
      console.error("❌ Failed to connect wallet:", error);
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet";
      toast.error("Connection Failed", {
        description: errorMessage,
      });
      // Keep modal open on error so user can try again
      throw error; // Re-throw to allow error handling in the modal if needed
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
