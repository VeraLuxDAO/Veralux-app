"use client";

import { useState, Suspense, useEffect } from "react";
import { MobileTopBar } from "@/components/mobile-top-bar";
import { MobileBottomBar } from "@/components/mobile-bottom-bar";
import { MobileHamburgerMenu } from "@/components/mobile-hamburger-menu";
import { MobileAITab } from "@/components/mobile-ai-tab";
import { DesktopTopBar } from "@/components/desktop-top-bar";
import { DesktopLeftSidebar } from "@/components/desktop-left-sidebar";
import { AIChat } from "@/components/ai-chat";
import { CirclesSlidingPanel } from "@/components/circles-sliding-panel";
import { RoomsSlidingPanel } from "@/components/rooms-sliding-panel";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationLayoutProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  hideDesktopSidebar?: boolean;
  hideAIChat?: boolean;
}

function NavigationLayoutContent({
  children,
  className,
  header,
  hideDesktopSidebar = false,
  hideAIChat = false,
}: NavigationLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isPrivateRoomsOpen = searchParams.get("private_rooms") !== null;
  const shouldHideSidebar = hideDesktopSidebar;
  
  // Compute shouldHideBottomBar directly - check if circle parameter exists and we're on mobile
  // Use both searchParams and window.location as fallback for reliability
  const hasCircle = searchParams.get("circle") !== null;
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const shouldHideBottomBar = isMobile && hasCircle;

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Circles panel is open when circle parameter is present (works on both mobile and desktop, on all pages)
  const isCirclesPanelOpen = searchParams.get("circle") !== null;

  const handlePrivateRoomsClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("private_rooms");
    const nextSearch = params.toString();
    const nextPath = pathname || "/";
    router.push(nextSearch ? `${nextPath}?${nextSearch}` : nextPath);
  };

  // Set data attribute on body for CSS targeting
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (hasCircle && isMobile) {
        document.body.setAttribute('data-circle-selected', 'true');
      } else {
        document.body.removeAttribute('data-circle-selected');
      }
    }
  }, [hasCircle, isMobile]);

  return (
    <div className={cn("min-h-screen", hideDesktopSidebar && "flex flex-col h-screen", className)}>
      {/* Mobile Navigation */}
      <MobileTopBar
        onMenuToggle={handleMobileMenuToggle}
        isMenuOpen={isMobileMenuOpen}
      />
      {!shouldHideBottomBar && <MobileBottomBar isMenuOpen={isMobileMenuOpen} />}
      <MobileHamburgerMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      />
      {!hideAIChat && <MobileAITab />}

      {/* Desktop Navigation */}
      <Suspense fallback={null}>
        <DesktopTopBar />
      </Suspense>
      {!shouldHideSidebar && <DesktopLeftSidebar />}

      {/* Desktop AI Chat (bottom-right popup) */}
      {!hideAIChat && (
        <div className="hidden md:block">
          <AIChat />
        </div>
      )}

      {/* Circles Sliding Panel (works on both mobile and desktop) */}
      <CirclesSlidingPanel
        isOpen={isCirclesPanelOpen}
        onClose={() => router.push("/")}
      />
      <RoomsSlidingPanel
        isOpen={isPrivateRoomsOpen}
        onClose={handlePrivateRoomsClose}
        variant="overlay"
      />

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
          // No left margin on mobile/tablet (sidebar hidden below lg breakpoint)
          shouldHideSidebar ? "lg:ml-0 xl:ml-0" : "lg:ml-[258px]",
          shouldHideSidebar ? "" : "xl:ml-[288px]", // xl: 14 + 250 + 24
          // Desktop: Right margin = 24px (equal to left gap)
          shouldHideSidebar ? "md:mr-0" : "md:mr-[24px]",
          // Gap between header and main content - FIXED
          "mt-0 md:mt-[67px]",
          // Use flexbox to fill available height when sidebar is hidden
          shouldHideSidebar && "flex flex-col",
          // Calculate height: viewport height minus top bar height (~90px with padding)
          shouldHideSidebar && "md:h-[calc(100vh-90px)]"
        )}
      >
        <div className={cn(
          "w-full",
          shouldHideSidebar ? "flex-1 flex flex-col min-h-0 overflow-hidden px-4 pt-4 sm:px-6 sm:pt-6 md:px-0 md:pt-8" : "px-4 pt-4 sm:px-6 sm:pt-6 md:px-0 md:pt-8"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
}

export function NavigationLayout(props: NavigationLayoutProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    }>
      <NavigationLayoutContent {...props} />
    </Suspense>
  );
}
