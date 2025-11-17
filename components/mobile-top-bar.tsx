"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MobileTopBarProps {
  onMenuToggle: () => void;
  isMenuOpen?: boolean;
  className?: string;
}

export function MobileTopBar({
  onMenuToggle,
  isMenuOpen = false,
  className,
}: MobileTopBarProps) {
  const auth = useAuth();
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <>
      <header
        className={cn(
          "mobile-top-bar fixed top-0 left-0 right-0 z-[100] block md:hidden translate-y-0",
          className
        )}
        style={{
          background: "transparent",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div
            onClick={handleLogoClick}
            className="flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <Image
              src="/Mark.png"
              alt="YNX"
              width={88}
              height={26}
              className="object-contain"
            />
          </div>

          {/* Right Side - Menu and Sign In */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="p-0 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer hover:bg-muted/70"
              style={{
                width: "24px",
                height: "24px",
              }}
            >
              <Menu className="w-5 h-5 transition-transform duration-200 text-white" />
            </Button>
            {!auth.isAuthenticated && (
              <Button
                variant="default"
                onClick={auth.signInWithGoogle}
                disabled={auth.isLoading}
                className="flex flex-row justify-center items-center p-2.5 gap-2.5 w-16 min-w-16 bg-white rounded-xl flex-none order-1 grow-0 text-xs font-medium text-black hover:bg-white/90 transition-all md:h-auto"
                style={{
                  height: "36px",
                  minHeight: "36px",
                  maxHeight: "36px",
                  boxShadow: "0px 2px 8px rgba(255, 255, 255, 0.5)",
                }}
              >
                {auth.isLoading ? "..." : "Sign In"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16 md:hidden" />
    </>
  );
}
