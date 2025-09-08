"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wallet, ExternalLink, Download } from "lucide-react";

interface Wallet {
  name: string;
  icon: string;
  description: string;
  installed: boolean;
  downloadUrl: string;
}

const SUPPORTED_WALLETS: Wallet[] = [
  {
    name: "Suiet Wallet",
    icon: "🌊",
    description: "The most popular Sui wallet",
    installed: false,
    downloadUrl:
      "https://chrome.google.com/webstore/detail/suiet-sui-wallet/khpkpbbccdmmkmpchlmpaofmiaglhkom",
  },
  {
    name: "Phantom",
    icon: "👻",
    description: "Multi-chain wallet with Sui support",
    installed: false,
    downloadUrl: "https://phantom.app/",
  },
  {
    name: "Martian Sui Wallet",
    icon: "🚀",
    description: "Fast and secure Sui wallet",
    installed: false,
    downloadUrl:
      "https://chrome.google.com/webstore/detail/martian-sui-wallet/efbglgofoippbgcjepnhiblaibcnclgk",
  },
  {
    name: "OKX Wallet",
    icon: "⚡",
    description: "Global crypto wallet",
    installed: false,
    downloadUrl: "https://www.okx.com/web3",
  },
  {
    name: "Glass Wallet",
    icon: "💎",
    description: "Premium Sui wallet experience",
    installed: false,
    downloadUrl: "https://glass.xyz/",
  },
  {
    name: "Slush Wallet",
    icon: "❄️",
    description: "Community-driven Sui wallet",
    installed: false,
    downloadUrl: "https://slushwallet.com/",
  },
];

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletSelect: (walletName: string) => void;
}

export function WalletSelectionModal({
  isOpen,
  onClose,
  onWalletSelect,
}: WalletSelectionModalProps) {
  const [wallets, setWallets] = useState<Wallet[]>(SUPPORTED_WALLETS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      checkInstalledWallets();
    }
  }, [isOpen]);

  const checkInstalledWallets = () => {
    const updatedWallets = SUPPORTED_WALLETS.map((wallet) => ({
      ...wallet,
      installed: checkWalletInstalled(wallet.name),
    }));
    setWallets(updatedWallets);
  };

  const checkWalletInstalled = (walletName: string): boolean => {
    if (typeof window === "undefined") return false;

    switch (walletName) {
      case "Suiet Wallet":
        return !!(window as any).suiet;
      case "Phantom":
        return !!(window as any).phantom?.sui;
      case "Martian Sui Wallet":
        return !!(window as any).martian;
      case "OKX Wallet":
        return !!(window as any).okxwallet?.sui;
      case "Glass Wallet":
        return !!(window as any).glass;
      case "Slush Wallet":
        return !!(window as any).slush;
      default:
        return false;
    }
  };

  const handleWalletClick = (wallet: Wallet) => {
    if (wallet.installed) {
      onWalletSelect(wallet.name);
      onClose();
    } else {
      window.open(wallet.downloadUrl, "_blank");
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 bg-card border-border shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-semibold text-card-foreground">
            Connect Wallet
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose a wallet to connect to VeraLux
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Popular Wallets */}
          <div>
            <h3 className="text-sm font-medium text-card-foreground mb-3">
              Popular
            </h3>
            <div className="space-y-2">
              {wallets.slice(0, 4).map((wallet) => (
                <Button
                  key={wallet.name}
                  variant="ghost"
                  className="w-full justify-start h-auto p-4 hover:bg-muted/50"
                  onClick={() => handleWalletClick(wallet)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg">
                      {wallet.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-card-foreground">
                          {wallet.name}
                        </span>
                        {wallet.installed && (
                          <Badge variant="secondary" className="text-xs">
                            Installed
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {wallet.description}
                      </p>
                    </div>
                    {!wallet.installed && (
                      <Download className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* More Wallets */}
          <div>
            <h3 className="text-sm font-medium text-card-foreground mb-3">
              More
            </h3>
            <div className="space-y-2">
              {wallets.slice(4).map((wallet) => (
                <Button
                  key={wallet.name}
                  variant="ghost"
                  className="w-full justify-start h-auto p-4 hover:bg-muted/50"
                  onClick={() => handleWalletClick(wallet)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg">
                      {wallet.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-card-foreground">
                          {wallet.name}
                        </span>
                        {wallet.installed && (
                          <Badge variant="secondary" className="text-xs">
                            Installed
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {wallet.description}
                      </p>
                    </div>
                    {!wallet.installed && (
                      <Download className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              New to Sui?{" "}
              <a
                href="https://docs.sui.io/learn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-electric-blue hover:underline"
              >
                Learn more here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
