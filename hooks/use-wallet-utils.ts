"use client";

import { useWallet } from "@suiet/wallet-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";

export function useWalletUtils() {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Clear error when wallet connection changes
  useEffect(() => {
    if (wallet.connected) {
      setError(null);
    }
  }, [wallet.connected]);

  const signMessage = async (message: string) => {
    if (!wallet.connected) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await wallet.signPersonalMessage({
        message: new TextEncoder().encode(message),
      });
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign message";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const executeTransaction = async (transaction: Transaction) => {
    if (!wallet.connected) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await wallet.signAndExecuteTransaction({
        transaction,
      });
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to execute transaction";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getShortAddress = (address?: string) => {
    if (!address) return "No address";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAddress = (address?: string) => {
    if (!address) return "No address";
    return address;
  };

  return {
    wallet,
    isLoading,
    error,
    signMessage,
    executeTransaction,
    getShortAddress,
    formatAddress,
    isConnected: wallet.connected,
    address: wallet.account?.address,
    walletName: wallet.name,
    mounted,
  };
}
