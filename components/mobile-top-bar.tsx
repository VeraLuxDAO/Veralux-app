"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LighthouseLogo } from "@/components/lighthouse-logo";
import { Search, Menu, TrendingUp, Hash, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

interface MobileTopBarProps {
  onMenuToggle: () => void;
  className?: string;
}

export function MobileTopBar({ onMenuToggle, className }: MobileTopBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const auth = useAuth();
  const router = useRouter();

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

  const handleLogoClick = () => {
    router.push("/");
  };

  const trendingItems = [
    { icon: TrendingUp, label: "#DeFiSummer", count: "12.4K" },
    { icon: Hash, label: "#NFTGaming", count: "8.7K" },
    { icon: Users, label: "#Web3Community", count: "6.2K" },
    { icon: Zap, label: "#BuildInPublic", count: "4.1K" },
  ];

  return (
    <>
      <header
        className={cn(
          "mobile-top-bar fixed top-0 left-0 right-0 z-50 transition-transform duration-300 md:hidden",
          "bg-card/95 backdrop-blur-md border-b border-border",
          isVisible ? "translate-y-0" : "-translate-y-full",
          className
        )}
      >
        <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3">
          {/* Logo */}
          <LighthouseLogo
            size="md"
            onClick={handleLogoClick}
            className="flex-shrink-0"
          />

          {/* Search Bar */}
          <div className="flex-1 mx-2 sm:mx-4 relative">
            <div className="relative">
              <Input
                placeholder="Search flows, users..."
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-muted/50 border-border rounded-full text-xs sm:text-sm"
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowSearchDropdown(false), 200)
                }
              />
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </div>

            {/* Trending Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-3 z-50">
                <h4 className="text-sm font-medium text-card-foreground mb-2">
                  Trending
                </h4>
                <div className="space-y-2">
                  {trendingItems.map((item, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <item.icon className="h-4 w-4 text-primary" />
                        <span className="text-sm text-card-foreground">
                          {item.label}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center">
            {/* Menu Button Only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16 md:hidden" />
    </>
  );
}
