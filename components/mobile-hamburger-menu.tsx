"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Headphones,
  Gamepad2,
  Wrench,
  ShoppingCart,
  LogOut,
  LogIn,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

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
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
              <Image
                src="/Mark.png"
                alt="YNX"
                width={87}
                height={26}
                className="object-contain"
              />
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
          <div className="px-4 pb-4 pt-2">
            {auth.isAuthenticated ? (
              <button
                onClick={() => {
                  auth.signOut();
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-white/5 px-4 py-3 text-sm transition-all duration-200 hover:bg-white/10"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 500,
                  color: "rgba(229, 247, 253, 0.9)",
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
    </>
  );
}
