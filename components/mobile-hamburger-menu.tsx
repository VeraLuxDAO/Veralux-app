"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Headphones,
  Gamepad2,
  Wrench,
  ShoppingCart,
  LogOut,
  LogIn,
  X,
  Copy,
  Check,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWallet } from "@suiet/wallet-kit";
import { WalletAccountModal } from "@/components/wallet-account-modal";

interface MobileHamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function MobileHamburgerMenu({
  isOpen,
  onClose,
  className,
}: MobileHamburgerMenuProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const auth = useAuth();
  const wallet = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const userInitial = auth.user?.name?.charAt(0) || "U";
  const walletAddress =
    wallet.connected && wallet.account?.address ? wallet.account.address : "";

  const truncatedAddress = useMemo(() => {
    if (!walletAddress) return "";
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  // Handle animation state
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 700);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCopyAddress = async () => {
    if (!walletAddress || typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error("Failed to copy address", error);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const modules = [
    {
      icon: Headphones,
      label: "Connect",
      path: "/",
    },
    {
      icon: Gamepad2,
      label: "Play",
      path: "/gaming",
    },
    {
      icon: Wrench,
      label: "Build",
      path: "/dev",
    },
    {
      icon: ShoppingCart,
      label: "Trade",
      path: "/marketplace",
    },
  ];

  return (
    <>
      {/* Progressive Overlay - covers entire viewport above all bars */}
      <div
        className={cn(
          "fixed inset-0 z-[120] md:hidden transform-gpu transition-all duration-700 ease-out",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        style={{
          background: `rgba(0, 0, 0, ${isOpen ? 0.25 : 0})`,
          backdropFilter: `blur(${isOpen ? 4 : 0}px)`,
          opacity: isOpen ? 1 : 0,
          willChange: "opacity, backdrop-filter",
        }}
        onClick={onClose}
      />

      {/* Menu Panel - Full-height drawer above top & bottom bars */}
      <div
        className={cn(
          "mobile-hamburger-menu fixed w-[300px] max-w-[90vw] z-[130] md:hidden",
          "shadow-2xl",
          "transition-all duration-500 ease-out transform-gpu",
          "will-change-transform backface-visibility-hidden",
          className
        )}
        style={{
          top: "0px",
          bottom: "0px",
          left: "0px",
          background: "#080E1166",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          willChange: "transform",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header - Logo + Close */}
          <div
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <svg width="88" height="26" viewBox="0 0 88 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_mobile_menu)">
                  <path d="M20.1587 18.1199V0.000244141H26.0001V26.0002H19.3569L5.84154 7.84639V26.0002H0.00012207V0.000244141H6.72721L20.1587 18.1199Z" fill="#9BB6CC"/>
                  <g filter="url(#filter0_mobile_menu)">
                    <path d="M6.72059 0.0131836L12.9104 8.36321C12.9682 8.44121 13.0849 8.44133 13.1429 8.36345L19.3586 0.0131836H25.9739L18.0838 10.6249C17.041 12.0273 17.0401 13.9471 18.0814 15.3506L25.9739 25.9869H19.3636L13.1314 17.6159C13.0734 17.5378 12.9565 17.5381 12.8988 17.6163L6.72058 25.9869H0.0264443L7.95126 15.4099C9.00374 14.0053 9.00668 12.0755 7.95851 10.6676L0.0263672 0.0131836H6.72059Z" fill="#E5F7FD"/>
                  </g>
                  <g filter="url(#filter1_mobile_menu)">
                    <path d="M6.71405 0.0131836L12.9103 8.36327C12.9682 8.44124 13.0849 8.44129 13.1428 8.36338L19.3521 0.0131836H25.9674L17.4561 11.4614C16.4414 12.8261 15.8935 14.4813 15.8935 16.1819V25.9869H10.1133V16.1847C10.1133 14.4823 9.56427 12.8256 8.54781 11.4601L0.0263672 0.0131836H6.71405Z" fill="#E5F7FD"/>
                  </g>
                </g>
                <path d="M34 4.85278H38.108L42.045 9.98603C42.0952 10.0514 42.1938 10.0514 42.2439 9.98603L46.181 4.85278H50.2932L45.4332 11.4388C44.4788 12.7321 43.9639 14.2972 43.9639 15.9046V21.1475H40.3251V15.9033C40.3251 14.2967 39.8107 12.7324 38.8572 11.4394L34 4.85278Z" fill="#9BB6CC"/>
                <path d="M65.0115 16.252V4.85278H68.6721V21.1475H64.5091L56.0395 9.7701V21.1475H52.3789V4.85278H56.4876L65.0115 16.252Z" fill="#9BB6CC"/>
                <path d="M87.0507 21.1475L82.6573 15.272C81.6615 13.9403 81.6586 12.1126 82.65 10.7777L87.0507 4.85278H82.9379L78.9073 10.2569L74.8663 4.85278H70.7576L75.1688 10.7784C76.1616 12.1121 76.1607 13.9395 75.1667 15.2722L70.8077 21.1168H74.9707L78.9133 15.8086L82.8877 21.1475H87.0507Z" fill="#9BB6CC"/>
                <defs>
                  <filter id="filter0_mobile_menu" x="-229.974" y="-42.9868" width="485.948" height="872.974" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="36"/>
                    <feGaussianBlur stdDeviation="39.5"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_mobile_menu"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="144"/>
                    <feGaussianBlur stdDeviation="72"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"/>
                    <feBlend mode="normal" in2="effect1_dropShadow_mobile_menu" result="effect2_dropShadow_mobile_menu"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="323"/>
                    <feGaussianBlur stdDeviation="97"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
                    <feBlend mode="normal" in2="effect2_dropShadow_mobile_menu" result="effect3_dropShadow_mobile_menu"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="574"/>
                    <feGaussianBlur stdDeviation="115"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"/>
                    <feBlend mode="normal" in2="effect3_dropShadow_mobile_menu" result="effect4_dropShadow_mobile_menu"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_mobile_menu" result="shape"/>
                  </filter>
                  <filter id="filter1_mobile_menu" x="-229.974" y="-42.9868" width="485.941" height="872.974" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="36"/>
                    <feGaussianBlur stdDeviation="39.5"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_mobile_menu"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="144"/>
                    <feGaussianBlur stdDeviation="72"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"/>
                    <feBlend mode="normal" in2="effect1_dropShadow_mobile_menu" result="effect2_dropShadow_mobile_menu"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="323"/>
                    <feGaussianBlur stdDeviation="97"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
                    <feBlend mode="normal" in2="effect2_dropShadow_mobile_menu" result="effect3_dropShadow_mobile_menu"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="574"/>
                    <feGaussianBlur stdDeviation="115"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"/>
                    <feBlend mode="normal" in2="effect3_dropShadow_mobile_menu" result="effect4_dropShadow_mobile_menu"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_mobile_menu" result="shape"/>
                  </filter>
                  <clipPath id="clip0_mobile_menu">
                    <rect width="26" height="26" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
            {auth.isAuthenticated && auth.user && (
              <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 border border-white/10">
                    <AvatarImage src={auth.user.picture} />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white leading-tight truncate">
                      {auth.user.name || "Unnamed user"}
                    </p>
                    <p className="text-[11px] text-[#9BB6CC]">Online</p>
                  </div>
                  {walletAddress && (
                    <button
                      onClick={handleCopyAddress}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      aria-label="Copy wallet address"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-veralux-green" />
                      ) : (
                        <Copy className="h-4 w-4 text-white" />
                      )}
                    </button>
                  )}
                </div>
                {walletAddress && (
                  <p className="mt-2 text-xs font-mono text-[#9BB6CC] truncate">
                    {truncatedAddress}
                  </p>
                )}
              </div>
            )}

            {/* Modules Label */}
            <div className="mb-3">
              <span
                className="text-[10px] tracking-[0.16em] uppercase"
                style={{
                  color: "rgba(229, 247, 253, 0.4)",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 500,
                }}
              >
                Modules
              </span>
            </div>

            {/* Modules List */}
            <div className="space-y-2">
              {modules.map((module) => {
                const isActive = pathname === module.path;

                return (
                  <button
                    key={module.path}
                    onClick={() => handleNavigation(module.path)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[999px] px-4 py-3 text-sm transition-all duration-200",
                      "hover:bg-white/[0.04]",
                      isActive ? "bg-[#FFFFFF14]" : "bg-transparent"
                    )}
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 500,
                      color: isActive ? "#FFFFFF" : "#9BB6CC99",
                    }}
                  >
                    <module.icon className="h-4 w-4" />
                    <span>{module.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Push bottom button to the bottom */}
            <div className="mt-auto" />
          </div>

          {/* Bottom Auth Button */}
          <div className="px-4 pb-4 pt-2 space-y-2">
            {auth.isAuthenticated && wallet.connected && (
              <button
                onClick={() => {
                  setIsAccountModalOpen(true);
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/10 px-4 py-3 text-sm transition-all duration-200 hover:opacity-90 bg-transparent"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 500,
                  color: "#EDE0F4",
                }}
              >
                <Wallet className="h-4 w-4" />
                <span>Manage Wallet</span>
              </button>
            )}
            {auth.isAuthenticated ? (
              <button
                onClick={() => {
                  auth.signOut();
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/10 px-4 py-3 text-sm transition-all duration-200 hover:opacity-90 bg-transparent"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 500,
                  color: "#EF5054",
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  auth.signInWithGoogle();
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-white px-4 py-3 text-sm text-black transition-all duration-200 hover:bg-white/90 shadow-[0px_2px_8px_rgba(255,255,255,0.5)]"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 500,
                }}
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Account Modal */}
      <WalletAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
}
