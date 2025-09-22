"use client";

import { useState } from "react";
import { MobileTopBar } from "@/components/mobile-top-bar";
import { MobileBottomBar } from "@/components/mobile-bottom-bar";
import { MobileHamburgerMenu } from "@/components/mobile-hamburger-menu";
import { MobileAITab } from "@/components/mobile-ai-tab";
import { DesktopTopBar } from "@/components/desktop-top-bar";
import { DesktopLeftSidebar } from "@/components/desktop-left-sidebar";
import { AIChat } from "@/components/ai-chat";
import { cn } from "@/lib/utils";

interface NavigationLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function NavigationLayout({
  children,
  className,
}: NavigationLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Mobile Navigation */}
      <MobileTopBar
        onMenuToggle={handleMobileMenuToggle}
        isMenuOpen={isMobileMenuOpen}
      />
      <MobileBottomBar isMenuOpen={isMobileMenuOpen} />
      <MobileHamburgerMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      />
      <MobileAITab />

      {/* Desktop Navigation */}
      <DesktopTopBar />
      <DesktopLeftSidebar />

      {/* Desktop AI Chat (bottom-right popup) */}
      <div className="hidden md:block">
        <AIChat />
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300",
          // Mobile spacing
          "pt-0 pb-20 md:pb-0",
          // Desktop spacing
          "md:pt-20 md:pl-64"
        )}
      >
        <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
