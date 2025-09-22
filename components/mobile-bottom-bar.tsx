"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Users, UserPlus, Bell, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

interface MobileBottomBarProps {
  className?: string;
}

export function MobileBottomBar({ className }: MobileBottomBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // Hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
        "mobile-bottom-bar fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 md:hidden",
        "bg-card/95 backdrop-blur-md border-t border-border",
        isVisible ? "translate-y-0" : "translate-y-full",
        className
      )}
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
                "transition-colors duration-200",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge && (
                  <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 bg-primary text-primary-foreground text-xs flex items-center justify-center">
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
