"use client";

import { useState, Suspense } from "react";
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
  header?: React.ReactNode;
}

export function NavigationLayout({
  children,
  className,
  header,
}: NavigationLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={cn("min-h-screen", className)}>
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
      <Suspense fallback={null}>
        <DesktopTopBar />
      </Suspense>
      <DesktopLeftSidebar />

      {/* Desktop AI Chat (bottom-right popup) */}
      <div className="hidden md:block">
        <AIChat />
      </div>

      {/* Page Header Section (Between Top Nav and Main Content) */}
      {header && (
        <div
          className={cn(
            "relative transition-all duration-300",
            // Mobile spacing
            "pt-0 md:pt-[135px]"
            // No left/right margins - spans full width
          )}
        >
          {header}
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300",
          // Mobile spacing
          // No extra bottom padding so content can slide fully under the mobile
          // bottom bar, making the glass/blur effect clearly visible.
          "pb-0 md:pb-0",
          // Responsive left margins: 14px edge + Sidebar width + 24px gap
          "md:ml-[238px]", // md: 14 + 200 + 24
          "lg:ml-[258px]", // lg: 14 + 220 + 24
          "xl:ml-[288px]", // xl: 14 + 250 + 24
          // Desktop: Right margin = 24px (equal to left gap)
          "md:mr-[24px]",
          // Gap between header and main content - FIXED
          "mt-0 md:mt-[131px]"
        )}
      >
        <div className="w-full px-4 py-4 sm:px-6 sm:py-6 md:px-0 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
