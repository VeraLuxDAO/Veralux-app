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
import { Copy, ExternalLink, LogOut, RefreshCw } from "lucide-react";
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

  const handleSwitchWallet = async () => {
    try {
      // Some wallets need explicit disconnect before switching
      if (wallet.connected) {
        await wallet.disconnect();
      }
    } catch (error) {
      console.warn("Wallet disconnect before switch failed (continuing):", error);
    } finally {
      // Ask the wallet connection manager to open the selector
      window.dispatchEvent(new CustomEvent("veralux:openWalletSelector"));
      onClose();
    }
  };

  if (!wallet.connected || !wallet.account?.address) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[440px] wallet-account-modal wallet-transition overflow-hidden border border-white/10 bg-[#0B1317] text-white shadow-2xl shadow-black/40 p-0"
        suppressHydrationWarning
      >
        <div className="bg-gradient-to-r from-[#0E1A21] via-[#0B1317] to-[#0E1A21] px-6 pt-6 pb-4 border-b border-white/10">
          <DialogHeader className="p-0">
            <DialogTitle className="text-xl font-semibold text-white text-center">
              Wallet account
            </DialogTitle>
            <p className="text-xs text-[#9BB6CC] text-center mt-1">
              Manage your connection, address, and actions
            </p>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Wallet Info */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center shadow-inner shadow-black/30">
            <div className="relative inline-block">
              <Avatar className="h-16 w-16 mx-auto wallet-avatar wallet-transition ring-2 ring-white/10">
                <AvatarFallback className="bg-gradient-to-br from-[#2AC3FF] via-[#7C3AED] to-[#F472B6] text-white text-xl font-semibold">
                  {wallet.name?.charAt(0) || "W"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0B1317] flex items-center justify-center shadow-lg shadow-emerald-500/50">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <p className="text-base font-semibold text-white">
                {wallet.name || "Connected Wallet"}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#9BB6CC]">
                <span className="break-all">{wallet.account.address}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <Badge
                variant="secondary"
                className="bg-emerald-500/15 text-emerald-100 border border-emerald-400/30 px-2 py-1 text-[11px] font-semibold"
              >
                ✓ Connected
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={handleCopyAddress}
              className="wallet-action-button h-12 rounded-xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/10 hover:border-white/20 transition"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy address
            </Button>
            <Button
              variant="secondary"
              onClick={handleViewOnExplorer}
              className="wallet-action-button h-12 rounded-xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/10 hover:border-white/20 transition"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View explorer
            </Button>
          </div>

          {/* Switch / Disconnect */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleSwitchWallet}
              className="h-12 rounded-xl bg-[#1C2A32] text-white border border-white/10 hover:bg-[#22343E] hover:border-white/20 transition font-semibold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Switch wallet
            </Button>
            <Button
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="h-12 rounded-xl bg-red-500/90 text-white hover:bg-red-500 disabled:opacity-80 font-semibold transition flex items-center justify-center"
            >
              {isDisconnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Disconnecting...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="px-6 pb-5 pt-4 border-t border-white/10 bg-white/[0.02]">
          <p className="text-xs text-center text-[#9BB6CC] leading-relaxed">
            Your wallet stays fully under your control. Switch, view, or disconnect anytime.
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
