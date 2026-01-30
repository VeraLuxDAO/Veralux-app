"use client";

import { useState, Suspense, useEffect, useCallback } from "react";
import { MobileTopBar } from "@/components/mobile-top-bar";
import { MobileBottomBar } from "@/components/mobile-bottom-bar";
import { MobileHamburgerMenu } from "@/components/mobile-hamburger-menu";
import { MobileAITab } from "@/components/mobile-ai-tab";
import { DesktopTopBar } from "@/components/desktop-top-bar";
import { DesktopLeftSidebar } from "@/components/desktop-left-sidebar";
import { AIChat } from "@/components/ai-chat";
import { CirclesSlidingPanel } from "@/components/circles-sliding-panel";
import { RoomsSlidingPanel } from "@/components/rooms-sliding-panel";
import { MobileMenuProvider } from "@/contexts/mobile-menu-context";
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
  
  // Compute shouldHideBottomBar: hide on mobile when in circle view OR when in a private room chat
  const hasCircle = searchParams.get("circle") !== null;
  const isMessagesChat = pathname === "/messages" && searchParams.get("room") != null;
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const shouldHideBottomBar = isMobile && (hasCircle || isMessagesChat);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

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
    <MobileMenuProvider onOpenMenu={openMobileMenu}>
    <div
      className={cn(
        "min-h-screen",
        hideDesktopSidebar && "flex flex-col h-screen",
        // When in messages chat: fixed height so chat fits viewport and only messages scroll
        (shouldHideBottomBar || isMessagesChat) && "flex flex-col h-screen overflow-hidden",
        className
      )}
      style={
        (shouldHideBottomBar || isMessagesChat)
          ? { height: "100dvh", maxHeight: "100dvh", minHeight: 0 }
          : undefined
      }
    >
      {/* Mobile Navigation - keep app top bar (XYNX + hamburger) for private room section */}
      <MobileTopBar
        onMenuToggle={handleMobileMenuToggle}
        isMenuOpen={isMobileMenuOpen}
      />
      {!shouldHideBottomBar && <MobileBottomBar isMenuOpen={isMobileMenuOpen} />}
      <MobileHamburgerMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      />
      {/* Hide AI chat button on private room (messages) page */}
      {!hideAIChat && pathname !== "/messages" && <MobileAITab />}

      {/* Desktop Navigation */}
      <Suspense fallback={null}>
        <DesktopTopBar />
      </Suspense>
      {!shouldHideSidebar && <DesktopLeftSidebar />}

      {/* Desktop AI Chat (bottom-right popup); hidden on private room (messages) page */}
      {!hideAIChat && pathname !== "/messages" && (
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
          shouldHideSidebar && "md:h-[calc(100vh-90px)]",
          // When in messages chat (mobile or desktop): constrain height so messages area scrolls with mouse wheel
          (shouldHideBottomBar || isMessagesChat) && "flex-1 min-h-0 overflow-hidden flex flex-col",
          // Push content below fixed app top bar on mobile when in private room (list or chat)
        )}
      >
        <div
          className={cn(
            "w-full",
            shouldHideSidebar ? "flex-1 flex flex-col min-h-0 overflow-hidden " : "",
            isMessagesChat && "flex-1 flex flex-col min-h-0 overflow-hidden"
          )}
        >
          {children}
        </div>
      </main>
    </div>
    </MobileMenuProvider>
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
