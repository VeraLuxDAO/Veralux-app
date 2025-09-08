"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useWalletUtils } from "@/hooks/use-wallet-utils";
import { Transaction } from "@mysten/sui/transactions";
import { useState, useCallback } from "react";
import { SUPPORTED_WALLETS, EXPLORER_URLS } from "@/lib/constants";
import {
  Copy,
  ExternalLink,
  Wallet,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function WalletDemo() {
  const {
    wallet,
    isLoading,
    error,
    signMessage,
    executeTransaction,
    isConnected,
    address,
    walletName,
    mounted,
  } = useWalletUtils();
  const [signResult, setSignResult] = useState<string | null>(null);
  const [txResult, setTxResult] = useState<string | null>(null);

  const copyAddress = useCallback(async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      // You could add a toast notification here
    }
  }, [address]);

  const openExplorer = useCallback(() => {
    if (address) {
      window.open(`${EXPLORER_URLS.SUI}${address}`, "_blank");
    }
  }, [address]);

  const handleSignMessage = useCallback(async () => {
    try {
      setSignResult(null);
      const result = await signMessage("Hello from VeraLux!");
      setSignResult(`✅ Message signed successfully!`);
    } catch (err) {
      console.error("Sign message failed:", err);
      setSignResult(
        `❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }, [signMessage]);

  const handleExecuteTransaction = useCallback(async () => {
    try {
      setTxResult(null);
      const tx = new Transaction();
      // Example: Transfer 0.001 SUI to yourself (this will fail but shows the structure)
      tx.transferObjects(
        [tx.splitCoins(tx.gas, [tx.pure.u64(1000000)])],
        tx.pure.address(address || "")
      );

      const result = await executeTransaction(tx);
      setTxResult(`✅ Transaction executed successfully!`);
    } catch (err) {
      console.error("Transaction failed:", err);
      setTxResult(
        `❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }, [executeTransaction, address]);

  if (!mounted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>Wallet Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>Wallet Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your Sui wallet to start using VeraLux features
            </p>
            <p className="text-xs text-muted-foreground">
              Click "Connect Wallet" above to see the wallet selection modal.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="w-5 h-5" />
          <span>Wallet Demo</span>
          <Badge variant="secondary" className="ml-auto">
            Connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wallet Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {walletName?.charAt(0) || "W"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-card-foreground">{walletName}</p>
              <p className="text-sm text-muted-foreground">Sui Wallet</p>
            </div>
          </div>

          {address && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-card-foreground">
                Address
              </p>
              <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                <code className="text-xs flex-1 font-mono break-all">
                  {address}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openExplorer}
                  className="h-6 w-6 p-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-start space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-card-foreground">
            Try Wallet Features
          </h4>

          <Button
            onClick={handleSignMessage}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            {isLoading ? "Signing..." : "Sign Message"}
          </Button>

          <Button
            onClick={handleExecuteTransaction}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            {isLoading ? "Executing..." : "Execute Transaction"}
          </Button>
        </div>

        {/* Results */}
        {(signResult || txResult) && (
          <div className="space-y-2">
            {signResult && (
              <div className="flex items-start space-x-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  {signResult}
                </p>
              </div>
            )}
            {txResult && (
              <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {txResult}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Supported Wallets */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            Supported wallets:
          </p>
          <div className="flex flex-wrap gap-1">
            {SUPPORTED_WALLETS.map((name) => (
              <Badge key={name} variant="outline" className="text-xs">
                {name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
