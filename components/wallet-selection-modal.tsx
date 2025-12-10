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
  iconUrl?: string;
  description: string;
  installed: boolean;
  downloadUrl: string;
}

// Wallet logos: You can download official wallet logos and place them in /public/wallets/
// For example: /public/wallets/suiet.png, /public/wallets/phantom.png, etc.
// The component will try to load local images first, then fall back to CDN URLs, then emoji
const SUPPORTED_WALLETS: Wallet[] = [
  {
    name: "Suiet Wallet",
    icon: "🌊",
    iconUrl: "/wallets/suiet.png", // Try local first, falls back to emoji if not found
    description: "The most popular Sui wallet",
    installed: false,
    downloadUrl:
      "https://chrome.google.com/webstore/detail/suiet-sui-wallet/khpkpbbccdmmkmpchlmpaofmiaglhkom",
  },
  {
    name: "Phantom",
    icon: "👻",
    iconUrl: "/wallets/phantom.png",
    description: "Multi-chain wallet with Sui support",
    installed: false,
    downloadUrl: "https://phantom.app/",
  },
  {
    name: "Martian Sui Wallet",
    icon: "🚀",
    iconUrl: "/wallets/martian.png",
    description: "Fast and secure Sui wallet",
    installed: false,
    downloadUrl:
      "https://chrome.google.com/webstore/detail/martian-sui-wallet/efbglgofoippbgcjepnhiblaibcnclgk",
  },
  {
    name: "OKX Wallet",
    icon: "⚡",
    iconUrl: "/wallets/okx.png",
    description: "Global crypto wallet",
    installed: false,
    downloadUrl: "https://www.okx.com/web3",
  },
  {
    name: "Glass Wallet",
    icon: "💎",
    iconUrl: "/wallets/glass.png",
    description: "Premium Sui wallet experience",
    installed: false,
    downloadUrl: "https://glass.xyz/",
  },
  {
    name: "Slush Wallet",
    icon: "❄️",
    iconUrl: "/wallets/slush.png",
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
    return undefined;
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300 p-3 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-[90vw] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[520px] mx-auto bg-[#080E11]/95 border border-[#E5F7FD]/20 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden">
        <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 flex-shrink-0">
          {/* Header with icon and title */}
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FADEFD] flex items-center justify-center flex-shrink-0">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
              </div>
              <div className="flex flex-col min-w-0">
                <CardTitle className="text-[14px] sm:text-[16px] font-medium text-white">
                  Connect Wallet
                </CardTitle>
                <p className="text-[11px] sm:text-[12px] text-gray-400">
                  Choose a wallet to connect to VeraLux
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10 flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#9BB6CC]" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 overflow-y-auto flex-1">
          {/* Popular Wallets */}
          <div>
            <p className="text-[11px] sm:text-[12px] font-medium text-[#9BB6CC99] mb-2 sm:mb-3">
              Popular
            </p>
            <div className="space-y-1.5 sm:space-y-2">
              {wallets.slice(0, 4).map((wallet) => (
                <button
                  key={wallet.name}
                  className="w-full p-2.5 sm:p-3 rounded-lg bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleWalletClick(wallet)}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 w-full">
                    <div className="w-8 h-8 sm:w-9 sm:h-9  flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      {wallet.iconUrl ? (
                        <img
                          src={wallet.iconUrl}
                          alt={wallet.name}
                          className="w-full h-full object-contain rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "block";
                          }}
                        />
                      ) : null}
                      <span 
                        className={`text-lg sm:text-xl md:text-2xl ${wallet.iconUrl ? "hidden" : ""}`}
                        style={{ display: wallet.iconUrl ? "none" : "block" }}
                      >
                        {wallet.icon}
                      </span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                        <span className="text-[13px] sm:text-[14px] font-medium text-white">
                          {wallet.name}
                        </span>
                        {wallet.installed && (
                          <Badge
                            className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5"
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
                      <p className="text-[11px] sm:text-[12px] text-gray-400">
                        {wallet.description}
                      </p>
                    </div>
                    {!wallet.installed && (
                      <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* More Wallets */}
          <div>
            <p className="text-[11px] sm:text-[12px] font-medium text-[#9BB6CC99] mb-2 sm:mb-3">
              More
            </p>
            <div className="space-y-1.5 sm:space-y-2">
              {wallets.slice(4).map((wallet) => (
                <button
                  key={wallet.name}
                  className="w-full p-2.5 sm:p-3 rounded-lg bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleWalletClick(wallet)}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 w-full">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      {wallet.iconUrl ? (
                        <img
                          src={wallet.iconUrl}
                          alt={wallet.name}
                          className="w-full h-full object-contain rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "block";
                          }}
                        />
                      ) : null}
                      <span 
                        className={`text-lg sm:text-xl md:text-2xl ${wallet.iconUrl ? "hidden" : ""}`}
                        style={{ display: wallet.iconUrl ? "none" : "block" }}
                      >
                        {wallet.icon}
                      </span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                        <span className="text-[13px] sm:text-[14px] font-medium text-white whitespace-nowrap">
                          {wallet.name}
                        </span>
                        {wallet.installed && (
                          <Badge
                            className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5"
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
                      <p className="text-[11px] sm:text-[12px] text-gray-400">
                        {wallet.description}
                      </p>
                    </div>
                    {!wallet.installed && (
                      <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 sm:pt-4 border-t border-white/10 flex-shrink-0">
            <p className="text-[10px] sm:text-xs md:text-sm text-center text-white">
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
