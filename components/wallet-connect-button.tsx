"use client";

import { ConnectButton } from "@suiet/wallet-kit";
import { useWallet } from "@suiet/wallet-kit";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { WalletAccountModal } from "@/components/wallet-account-modal";
import { ClientOnly } from "@/components/client-only";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

interface WalletConnectButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  showAddress?: boolean;
}

function WalletConnectButtonContent({
  variant = "default",
  size = "default",
  className = "",
  showAddress = true,
}: WalletConnectButtonProps) {
  const wallet = useWallet();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  if (!wallet.connected) {
    return (
      <ConnectButton className={`wallet-connect-button ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <Wallet className="w-5 h-5" />
          <span className="font-semibold">Connect Wallet</span>
        </div>
      </ConnectButton>
    );
  }

  // Connected state - show wallet info with click to open account modal
  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${className} wallet-connected-button hover:shadow-xl transition-all duration-300 group`}
        onClick={() => setIsAccountModalOpen(true)}
      >
        <Avatar className="h-6 w-6 mr-2">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
            {wallet.name?.charAt(0) || "W"}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">
          {showAddress && wallet.account?.address
            ? `${wallet.account.address.slice(
                0,
                6
              )}...${wallet.account.address.slice(-4)}`
            : wallet.name || "Wallet"}
        </span>
        <Badge
          variant="secondary"
          className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        >
          Connected
        </Badge>
      </Button>

      <WalletAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
}

export function WalletConnectButton(props: WalletConnectButtonProps) {
  return (
    <ClientOnly
      fallback={
        <div className="wallet-connect-button inline-flex items-center justify-center rounded-md text-sm font-medium px-6 py-3 h-12">
          <Wallet className="w-5 h-5 mr-3" />
          <span className="font-semibold">Connect Wallet</span>
        </div>
      }
    >
      <WalletConnectButtonContent {...props} />
    </ClientOnly>
  );
}
