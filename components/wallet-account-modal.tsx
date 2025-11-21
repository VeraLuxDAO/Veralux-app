"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { ClientOnly } from "@/components/client-only";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, ExternalLink, LogOut } from "lucide-react";
import { toast } from "sonner";

interface WalletAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function WalletAccountModalContent({
  isOpen,
  onClose,
}: WalletAccountModalProps) {
  const wallet = useWallet();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleCopyAddress = () => {
    if (wallet.account?.address) {
      navigator.clipboard.writeText(wallet.account.address);
      toast.success("Address copied to clipboard!");
    }
  };

  const handleViewOnExplorer = () => {
    if (wallet.account?.address) {
      window.open(
        `https://suiscan.xyz/mainnet/account/${wallet.account.address}`,
        "_blank"
      );
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await wallet.disconnect();
      toast.success("Wallet disconnected successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      toast.error("Failed to disconnect wallet");
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (!wallet.connected || !wallet.account?.address) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[420px] wallet-account-modal wallet-transition"
        suppressHydrationWarning
      >
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-center text-card-foreground">
            Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-2">
          {/* Wallet Info */}
          <div className="text-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20 mx-auto wallet-avatar wallet-transition">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                  {wallet.name?.charAt(0) || "W"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xl font-bold text-card-foreground">
                {wallet.name || "Connected Wallet"}
              </p>
              <div className="wallet-address text-sm text-muted-foreground font-mono max-w-full break-all">
                {wallet.account.address}
              </div>
            </div>

            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 text-sm font-medium"
            >
              ✓ Connected
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={handleCopyAddress}
              className="wallet-action-button flex items-center justify-center space-x-2 h-14 text-sm font-medium"
            >
              <Copy className="h-5 w-5" />
              <span>Copy Address</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleViewOnExplorer}
              className="wallet-action-button flex items-center justify-center space-x-2 h-14 text-sm font-medium"
            >
              <ExternalLink className="h-5 w-5" />
              <span>View Explorer</span>
            </Button>
          </div>

          {/* Disconnect Button */}
          <Button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="wallet-disconnect-button w-full h-14 flex items-center justify-center space-x-2 text-sm font-semibold"
          >
            {isDisconnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Disconnecting...</span>
              </>
            ) : (
              <>
                <LogOut className="h-5 w-5" />
                <span>Disconnect</span>
              </>
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-border">
          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            Manage your wallet connection and account details
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function WalletAccountModal(props: WalletAccountModalProps) {
  return (
    <ClientOnly>
      <WalletAccountModalContent {...props} />
    </ClientOnly>
  );
}
