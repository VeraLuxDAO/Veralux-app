"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wallet, ExternalLink, Download, X } from "lucide-react";

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

  const handleWalletClick = async (wallet: Wallet) => {
    if (wallet.installed) {
      console.log("🔗 User selected wallet:", wallet.name);
      await onWalletSelect(wallet.name);
      // Close modal after selection
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      console.log("⬇️ Wallet not installed, opening download link");
      window.open(wallet.downloadUrl, "_blank");
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300 p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-[#080E11]/95 border border-[#E5F7FD]/20 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] md:max-h-[85vh] flex flex-col overflow-hidden">
        <CardHeader className="pb-3 md:pb-4 pt-4 md:pt-6 px-4 md:px-6 flex-shrink-0">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
          
          {/* Header with icon and title */}
          <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white flex items-center justify-center flex-shrink-0">
              <Wallet className="w-4 h-4 md:w-5 md:h-5 text-[#080E11]" />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold text-white">
              Connect Wallet
            </CardTitle>
          </div>
          <p className="text-xs md:text-sm text-gray-400 ml-11 md:ml-14">
            Choose a wallet to connect to VeraLux
          </p>
        </CardHeader>

        <CardContent className="space-y-4 md:space-y-5 px-4 md:px-6 pb-4 md:pb-6 overflow-y-auto flex-1">
          {/* Popular Wallets */}
          <div>
            <h3 className="text-xs md:text-sm font-semibold text-white mb-3 md:mb-4 uppercase tracking-wide">
              Popular
            </h3>
            <div className="space-y-2 md:space-y-2.5">
              {wallets.slice(0, 4).map((wallet) => (
                <button
                  key={wallet.name}
                  className="w-full p-3 md:p-4 rounded-lg md:rounded-xl bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleWalletClick(wallet)}
                >
                  <div className="flex items-center gap-3 md:gap-4 w-full">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-white flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
                      {wallet.icon}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm md:text-base font-medium text-white">
                          {wallet.name}
                        </span>
                        {wallet.installed && (
                          <Badge
                            className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5"
                            style={{
                              backgroundColor: "rgba(250, 222, 253, 0.2)",
                              color: "rgba(250, 222, 253, 1)",
                              border: "1px solid rgba(250, 222, 253, 0.3)",
                            }}
                          >
                            Installed
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-400">
                        {wallet.description}
                      </p>
                    </div>
                    {!wallet.installed && (
                      <Download className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* More Wallets */}
          <div>
            <h3 className="text-xs md:text-sm font-semibold text-white mb-3 md:mb-4 uppercase tracking-wide">
              More
            </h3>
            <div className="space-y-2 md:space-y-2.5">
              {wallets.slice(4).map((wallet) => (
                <button
                  key={wallet.name}
                  className="w-full p-3 md:p-4 rounded-lg md:rounded-xl bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleWalletClick(wallet)}
                >
                  <div className="flex items-center gap-3 md:gap-4 w-full">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-white flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
                      {wallet.icon}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm md:text-base font-medium text-white">
                          {wallet.name}
                        </span>
                        {wallet.installed && (
                          <Badge
                            className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5"
                            style={{
                              backgroundColor: "rgba(250, 222, 253, 0.2)",
                              color: "rgba(250, 222, 253, 1)",
                              border: "1px solid rgba(250, 222, 253, 0.3)",
                            }}
                          >
                            Installed
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-400">
                        {wallet.description}
                      </p>
                    </div>
                    {!wallet.installed && (
                      <Download className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 md:pt-5 border-t border-white/10 flex-shrink-0">
            <p className="text-xs md:text-sm text-center text-white">
              New to Sui?{" "}
              <a
                href="https://docs.sui.io/learn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline transition-colors"
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
