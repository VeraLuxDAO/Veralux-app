"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wallet, ExternalLink, Download, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

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
    iconUrl: "/wallets/suiet.png",
    description: "The most popular Sui wallet",
    installed: false,
    downloadUrl:
      "https://chrome.google.com/webstore/detail/suiet-sui-wallet/khpkpbbccdmmkmpchlmpaofmiaglhkom",
  },
  {
    name: "Slush Wallet",
    icon: "❄️",
    iconUrl: "/wallets/slush.png",
    description: "Community-driven Sui wallet",
    installed: false,
    downloadUrl: "https://slushwallet.com/",
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
    name: "Glass Wallet",
    icon: "💎",
    iconUrl: "/wallets/glass.png",
    description: "Premium Sui wallet experience",
    installed: false,
    downloadUrl: "https://glass.xyz/",
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
    name: "Nightly",
    icon: "🌙",
    iconUrl: "/wallets/nightly.png",
    description: "Lightweight Sui wallet",
    installed: false,
    downloadUrl: "https://nightly.app/",
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
    name: "OneKey Wallet",
    icon: "🟢",
    iconUrl: "/wallets/onekey.png",
    description: "Secure multi-chain wallet",
    installed: false,
    downloadUrl: "https://onekey.so/download",
  },
  {
    name: "Surf Wallet",
    icon: "🌊",
    iconUrl: "/wallets/surf.png",
    description: "Simple Sui wallet experience",
    installed: false,
    downloadUrl: "https://surf-wallet.com/",
  },
  {
    name: "TokenPocket Wallet",
    icon: "🪙",
    iconUrl: "/wallets/tokenpocket.png",
    description: "Multi-chain wallet with Sui support",
    installed: false,
    downloadUrl: "https://www.tokenpocket.pro/",
  },
  {
    name: "Slush Web Wallet",
    icon: "❄️",
    iconUrl: "/wallets/slush-web.png",
    description: "Slush wallet for web",
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
  const wallet = useWallet();
  const [wallets, setWallets] = useState<Wallet[]>(SUPPORTED_WALLETS);
  const [mounted, setMounted] = useState(false);

  // Lock body scroll when dialog is open and restore on close
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const prevPosition = style.position;
    const prevTop = style.top;
    const prevWidth = style.width;
    const prevOverflow = style.overflow;

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    style.overflow = "hidden";

    return () => {
      style.position = prevPosition;
      style.top = prevTop;
      style.width = prevWidth;
      style.overflow = prevOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      // Check immediately and also retry after a delay (wallets may inject late)
      checkInstalledWallets();
      const retryTimeout = setTimeout(() => {
        checkInstalledWallets();
      }, 500);
      return () => clearTimeout(retryTimeout);
    }
    return undefined;
  }, [isOpen]);

  const checkInstalledWallets = () => {
    // Try to use wallet kit's detection first
    let walletKitWallets: any[] = [];
    try {
      if ('configuredWallets' in wallet && Array.isArray((wallet as any).configuredWallets)) {
        walletKitWallets.push(...(wallet as any).configuredWallets);
      }
      if ('detectedWallets' in wallet && Array.isArray((wallet as any).detectedWallets)) {
        walletKitWallets.push(...(wallet as any).detectedWallets);
      }
    } catch (e) {
      console.warn("Could not access wallet kit wallets:", e);
    }

    const updatedWallets = SUPPORTED_WALLETS.map((walletItem) => {
      // Map display name to wallet kit identifier
      const walletNameMap: Record<string, string> = {
        "Suiet Wallet": "Suiet",
        "Phantom": "Phantom",
        "Martian Sui Wallet": "Martian",
        "OKX Wallet": "OKX",
        "Glass Wallet": "Glass",
        "Slush Wallet": "Slush",
      };
      const walletIdentifier = walletNameMap[walletItem.name];

      // Check wallet kit first
      let isInstalled = false;
      if (walletKitWallets.length > 0 && walletIdentifier) {
        const kitWallet = walletKitWallets.find((w: any) => w.name === walletIdentifier);
        isInstalled = kitWallet?.installed === true;
      }

      // Fallback to manual detection if wallet kit doesn't have info
      if (!isInstalled) {
        isInstalled = checkWalletInstalled(walletItem.name);
      }

      return {
        ...walletItem,
        installed: isInstalled,
      };
    });
    setWallets(updatedWallets);
  };

  const checkWalletInstalled = (walletName: string): boolean => {
    if (typeof window === "undefined") return false;

    const win = window as any;

    switch (walletName) {
      case "Suiet Wallet":
        // Suiet wallet uses Sui Wallet Standard (window.sui)
        // Check for window.sui first (standard), then legacy window.suiet
        if (win.sui) {
          // If window.sui exists, it's likely a Sui wallet (could be Suiet, Slush, etc.)
          // We'll be optimistic and allow connection attempts
          // The wallet kit will handle the actual connection
          return true;
        }
        // Legacy check
        return !!(win.suiet);
      
      case "Phantom":
        // Phantom uses window.phantom.sui
        return !!(win.phantom?.sui);
      
      case "Martian Sui Wallet":
        // Check for window.sui (standard) or legacy window.martian
        if (win.sui) {
          return true; // Optimistic - let wallet kit handle it
        }
        return !!(win.martian);
      
      case "OKX Wallet":
        // OKX uses window.okxwallet.sui
        return !!(win.okxwallet?.sui);
      
      case "OneKey Wallet":
        // OneKey exposes window.onekey.sui in some versions, otherwise standard window.sui
        return !!(win.onekey?.sui) || !!win.sui;
      
      case "Surf Wallet":
        // Surf may expose window.surf.sui, fallback to standard window.sui
        return !!(win.surf?.sui) || !!win.sui;
      
      case "TokenPocket Wallet":
        // TokenPocket may expose window.tokenpocket.sui, fallback to standard window.sui
        return !!(win.tokenpocket?.sui) || !!win.sui;
      
      case "Glass Wallet":
        // Check for window.sui (standard) or legacy window.glass
        if (win.sui) {
          return true; // Optimistic - let wallet kit handle it
        }
        return !!(win.glass);
      
      case "Nightly":
        // Nightly is Sui standard compliant (window.sui), legacy window.nightly?.sui
        return !!(win.nightly?.sui) || !!win.sui;
      
      case "Slush Wallet":
        // Slush wallet uses Sui Wallet Standard (window.sui)
        // Since window.sui is shared by multiple wallets, we'll be optimistic
        if (win.sui) {
          // If window.sui exists, it could be Slush or another Sui wallet
          // Allow connection attempt - wallet kit will handle it
          return true;
        }
        // Legacy check
        return !!(win.slush);
      
      case "Slush Web Wallet":
        // Web version also relies on standard window.sui
        return !!win.sui || !!win.slush;
      
      default:
        return false;
    }
  };

  const handleWalletClick = async (wallet: Wallet) => {
    // Re-check installation status before proceeding (wallets might have been installed)
    const isInstalled = checkWalletInstalled(wallet.name);
    
    // Even if not detected, allow attempting connection—wallet-kit will surface errors.
    if (isInstalled) {
      console.log("🔗 User selected wallet:", wallet.name);
    } else {
      console.log("⚠️ Wallet not detected as installed, attempting connection anyway");
    }

    try {
      await onWalletSelect(wallet.name);
      // Close modal after successful selection
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      // Error handling is done in the connection manager
      // But we can show a toast here for better UX
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet";
      toast.error(errorMessage, {
        description: "Please try again or install the wallet extension if needed.",
      });
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent
        className="w-full max-w-[90vw] sm:max-w-[432px] md:max-w-[480px] lg:max-w-[520px] border border-[rgba(255,255,255,0.08)] bg-[#090b0c61] backdrop-blur-md shadow-2xl max-h-[70vh] p-0 overflow-hidden flex flex-col"
        style={{borderRadius:'24px'}}
      >
        <DialogHeader className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 flex-shrink-0">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 sm:w-9 sm:h-9 rounded-full bg-[#FADEFD] flex items-center justify-center flex-shrink-0">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
              </div>
              <div className="flex flex-col min-w-0">
                <DialogTitle className="text-[14px] sm:text-[16px] font-medium text-white">
                  Connect Wallet
                </DialogTitle>
                <DialogDescription className="text-[11px] sm:text-[12px] text-gray-400">
                  Choose a wallet to connect to VeraLux
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 px-3 sm:px-4 pb-3 sm:pb-4 overflow-y-auto flex-1 min-h-0">
          {/* Popular Wallets */}
          <div>
            <p className="text-[11px] sm:text-[12px] font-medium text-[#9BB6CC99] mb-2 sm:mb-3">
              Popular
            </p>
            <div className="space-y-1.5 sm:space-y-2">
              {wallets.slice(0, 4).map((wallet) => (
                <button
                  key={wallet.name}
                  className="w-full p-2.5 sm:p-3 rounded-lg bg-[#9BB6CC0A] hover:bg-white/5 transition-all duration-200 cursor-pointer group"
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
                  className="w-full p-2.5 sm:p-3 rounded-lg bg-[#9BB6CC0A] hover:bg-white/5 transition-all duration-200 cursor-pointer group"
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
          <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-white/10">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
