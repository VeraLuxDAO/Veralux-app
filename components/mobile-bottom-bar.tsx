"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Users, UserPlus, Bell, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

interface MobileBottomBarProps {
  isMenuOpen?: boolean;
  className?: string;
}

export function MobileBottomBar({
  isMenuOpen = false,
  className,
}: MobileBottomBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // Hide/show on scroll with smooth animations (disabled when menu is open)
  useEffect(() => {
    if (isMenuOpen) {
      setIsVisible(true);
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDifference = Math.abs(currentScrollY - lastScrollY);

          // Only trigger animation if scroll is significant enough
          if (scrollDifference > 3) {
            if (currentScrollY > lastScrollY && currentScrollY > 60) {
              // Scrolling down - hide with animation
              setIsVisible(false);
            } else if (currentScrollY < lastScrollY || currentScrollY <= 60) {
              // Scrolling up or near top - show with animation
              setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, isMenuOpen]);

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
      badge: null,
    },
    {
      icon: Users,
      label: "Circles",
      path: "/circles",
      badge: null,
    },
    {
      icon: UserPlus,
      label: "Following",
      path: "/following",
      badge: null,
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/notifications",
      badge: "3",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      path: "/messages",
      badge: "2",
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav
      className={cn(
        "mobile-bottom-bar fixed bottom-0 left-0 right-0 z-50 md:hidden",
        "bg-card/95 backdrop-blur-md border-t border-border",
        "transition-all duration-400 ease-out transform-gpu",
        "will-change-transform backface-visibility-hidden",
        isVisible
          ? "translate-y-0 opacity-100 visible"
          : "translate-y-full opacity-0 invisible",
        className
      )}
      style={{
        willChange: "transform, opacity",
        transform: isVisible
          ? "translateY(0) translateZ(0)"
          : "translateY(100%) translateZ(0)",
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center space-y-1 p-2 h-auto min-w-0 flex-1",
                "transition-all duration-300 cursor-pointer",
                "hover:scale-110 active:scale-95",
                isActive
                  ? "text-primary bg-primary/10 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5 transition-transform duration-200" />
                {item.badge && (
                  <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 bg-primary text-primary-foreground text-xs flex items-center justify-center animate-pulse">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium truncate max-w-full">
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
