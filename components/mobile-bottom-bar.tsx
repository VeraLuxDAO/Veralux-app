"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Users, Search, Bell, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { CirclesModal } from "@/components/circles-modal";

interface MobileBottomBarProps {
  isMenuOpen?: boolean;
  className?: string;
}

export function MobileBottomBar({
  isMenuOpen = false,
  className,
}: MobileBottomBarProps) {
  const [isCirclesModalOpen, setIsCirclesModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
      {/* Backdrop blur layer - positioned independently to avoid transform context issues */}
      <div
        className="fixed inset-x-0 bottom-4 z-[99] flex justify-center md:hidden pointer-events-none"
      >
        <div
          className="w-[calc(100%-32px)] max-w-[480px] h-[88px] rounded-[48px] pointer-events-none"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "rgba(8,14,17,0.3)",
          }}
        />
      </div>
      
      <nav
        className={cn(
          // Outer container just positions the pill-style nav
          "mobile-bottom-bar fixed inset-x-0 bottom-4 z-[100] flex justify-center md:hidden pointer-events-none",
          className
        )}
      >
        {/* Pill-style bottom nav, matching Figma sample, responsive */}
        <div
          className={cn(
            "pointer-events-auto box-border flex items-center justify-between",
            // Base: comfortable padding & gap on typical mobile widths
            "px-8 py-3 gap-6 h-[88px] w-[calc(100%-32px)] max-w-[480px]",
            // Tighten padding and gaps as the viewport shrinks
            "max-[420px]:px-6 max-[420px]:gap-5",
            "max-[380px]:px-5 max-[380px]:gap-4",
            "max-[350px]:px-4 max-[350px]:gap-3",
            "max-[330px]:px-3 max-[330px]:gap-2",
            "border border-[rgba(255,255,255,0.08)] rounded-[48px] bg-transparent"
          )}
        >
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.path, item.action || undefined)}
              className={cn(
                // Layout: flex column, centered, fixed size 56x53 on wider mobiles
                "flex flex-col items-center justify-center gap-1 p-0 w-14 h-[53px] flex-none order-0 grow-0",
                // Below 440px, let buttons flex so all 5 fit responsively
                "max-[440px]:w-auto max-[440px]:flex-1 max-[440px]:grow",
                "transition-all duration-300 cursor-pointer",
                isActive
                  ? "text-white"
                  : "text-[#9BB6CC99] hover:text-white"
              )}
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
