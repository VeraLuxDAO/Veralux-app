"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Users, Search, Bell, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CirclesModal } from "@/components/circles-modal";

interface MobileBottomBarProps {
  isMenuOpen?: boolean;
  className?: string;
}

function MobileBottomBarContent({
  isMenuOpen = false,
  className,
}: MobileBottomBarProps) {
  const [isCirclesModalOpen, setIsCirclesModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Scroll detection for hide/show bottom bar
  useEffect(() => {
    const getScrollPosition = () => {
      // Check if main content is scrollable
      const mainContent = document.querySelector("main");
      if (mainContent && mainContent.scrollHeight > mainContent.clientHeight) {
        return mainContent.scrollTop;
      }
      // Fallback to window scroll
      return window.scrollY || document.documentElement.scrollTop;
    };

    const handleScroll = () => {
      const currentScrollY = getScrollPosition();
      
      // Show bar when at top of page
      if (currentScrollY <= 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Determine scroll direction
      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrollingUp = currentScrollY < lastScrollY.current;
      
      // Only update if scroll difference is significant (to avoid flickering)
      const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);
      
      if (scrollDifference > 5) {
        if (scrollingDown && isVisible) {
          setIsVisible(false);
        } else if (scrollingUp && !isVisible) {
          setIsVisible(true);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    // Add scroll listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Also listen to main content scroll if it exists
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll, { passive: true });
    }

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (mainContent) {
        mainContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isVisible]);

  const navItems = [
    // 1. Home
    {
      icon: Home,
      label: "Home",
      path: "/",
      badge: null,
      action: null,
    },
    // 2. Search
    {
      icon: Search,
      label: "Search",
      path: "/search",
      badge: null,
      action: null,
    },
    // 3. Notifications
    {
      icon: Bell,
      label: "Notifications",
      path: "/notifications",
      badge: "3",
      action: null,
    },
    // 4. Circles (opens Circles modal)
    {
      icon: Users,
      label: "Circles",
      path: "/circles",
      badge: null,
      action: () => setIsCirclesModalOpen(true),
    },
    // 5. Rooms (previously Messages)
    {
      icon: MessageCircle,
      label: "Rooms",
      path: "/messages",
      badge: "2",
      action: null,
    },
  ];

  const handleNavigation = (path: string, action?: () => void) => {
    if (action) {
      action();
    } else {
      router.push(path);
    }
  };

  return (
    <>
      {/* Backdrop blur layer - positioned behind the nav bar, above Circles component */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-4 z-[111] flex justify-center md:hidden pointer-events-none",
          "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isVisible 
            ? "translate-y-0 opacity-100 scale-100" 
            : "translate-y-[120px] opacity-0 scale-95",
          className
        )}
        style={{
          transitionTimingFunction: isVisible 
            ? "cubic-bezier(0.34, 1.56, 0.64, 1)" // Spring-like bounce when appearing
            : "cubic-bezier(0.4, 0, 0.2, 1)", // Smooth when disappearing
        }}
      >
        <div
          className={cn(
            "box-border transition-all duration-500",
            // Base: comfortable padding & gap on typical mobile widths
            "h-[88px] w-[calc(100%-32px)] max-w-[480px]",
            "rounded-[48px]"
          )}
          style={{
            backdropFilter: isVisible ? "blur(20px)" : "blur(0px)",
            WebkitBackdropFilter: isVisible ? "blur(20px)" : "blur(0px)",
            background: isVisible ? "rgba(8, 14, 17, 0.4)" : "rgba(8, 14, 17, 0)",
            transition: "backdrop-filter 500ms cubic-bezier(0.4, 0, 0.2, 1), background 500ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>

      <nav
        className={cn(
          // Outer container just positions the pill-style nav, above Circles component
          "mobile-bottom-bar fixed inset-x-0 bottom-4 z-[112] flex justify-center md:hidden",
          "transition-all duration-500",
          isVisible 
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto" 
            : "translate-y-[120px] opacity-0 scale-95 pointer-events-none",
          className
        )}
        style={{
          transitionTimingFunction: isVisible 
            ? "cubic-bezier(0.34, 1.56, 0.64, 1)" // Spring-like bounce when appearing
            : "cubic-bezier(0.4, 0, 0.2, 1)", // Smooth when disappearing
          transitionDelay: isVisible ? "50ms" : "0ms", // Slight delay when appearing for staggered effect
        }}
      >
        {/* Pill-style bottom nav, matching Figma sample, responsive */}
        <div
          className={cn(
            "mobile-bottom-nav-blur pointer-events-auto box-border flex items-center justify-between",
            // Base: comfortable padding & gap on typical mobile widths
            "px-8 py-3 gap-6 h-[88px] w-[calc(100%-32px)] max-w-[480px]",
            // Tighten padding and gaps as the viewport shrinks
            "max-[420px]:px-6 max-[420px]:gap-5",
            "max-[380px]:px-5 max-[380px]:gap-4",
            "max-[350px]:px-4 max-[350px]:gap-3",
            "max-[330px]:px-3 max-[330px]:gap-2",
            "border border-[rgba(255,255,255,0.08)] rounded-[48px]"
          )}
          style={{
            background: "transparent",
          }}
        >
        {navItems.map((item, index) => {
          // Check if Circles button should be active (modal open OR on circle/chat page)
          const isCirclesActive = item.path === "/circles" && (
            isCirclesModalOpen || 
            (pathname === "/" && searchParams.get("circle") !== null) ||
            pathname.startsWith("/chat/")
          );
          // Home should only be active when on home page AND no circle is selected
          const isHomeActive = item.path === "/" && 
            pathname === "/" && 
            searchParams.get("circle") === null &&
            !isCirclesModalOpen;
          const isActive = isHomeActive || (item.path !== "/" && (pathname === item.path || isCirclesActive));

          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.path, item.action || undefined)}
              className={cn(
                // Layout: flex column, centered; flex-1 so buttons redistribute on any width
                "flex flex-col items-center justify-center gap-1 p-0 h-[53px] flex-1 order-0 grow min-w-[48px] max-w-[72px]",
                "transition-all duration-300 cursor-pointer",
                isActive
                  ? "text-white"
                  : "text-[#9BB6CC99] hover:text-white"
              )}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible 
                  ? "translateY(0) scale(1)" 
                  : "translateY(10px) scale(0.95)",
                transition: isVisible
                  ? `opacity 400ms cubic-bezier(0.4, 0, 0.2, 1) ${150 + index * 25}ms, transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1) ${150 + index * 25}ms`
                  : `opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
              }}
            >
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-full transition-all duration-300 w-9 h-9",
                  isActive ? "bg-[rgba(255,255,255,0.08)]" : ""
                )}
              >
                <item.icon className="h-5 w-5 max-[410px]:h-4 max-[410px]:w-4 transition-transform duration-200" />
                {item.badge && (
                  <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 bg-primary text-primary-foreground text-xs flex items-center justify-center animate-pulse">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] max-[380px]:text-[9px] font-medium max-w-full whitespace-nowrap max-[390px]:truncate">
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Circles Modal */}
      <CirclesModal
        isOpen={isCirclesModalOpen}
        onClose={() => setIsCirclesModalOpen(false)}
      />
    </nav>
    </>
  );
}

export function MobileBottomBar(props: MobileBottomBarProps) {
  return (
    <Suspense fallback={null}>
      <MobileBottomBarContent {...props} />
    </Suspense>
  );
}
