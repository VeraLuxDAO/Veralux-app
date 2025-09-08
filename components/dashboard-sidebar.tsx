"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback, memo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface DashboardSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const DashboardSidebar = memo(function DashboardSidebar({
  isMobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      {/* Desktop Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-20 right-4 z-50 bg-card/95 backdrop-blur-sm border border-border hover:bg-accent hidden sm:flex glass-effect focus-ring"
        onClick={handleToggle}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isOpen ? (
          <ChevronRight className="h-4 w-4 text-foreground" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-foreground" />
        )}
      </Button>

      {/* Mobile Overlay - Only visible on screens < 600px */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`w-64 border-l border-border bg-card/95 backdrop-blur-sm h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] transition-transform duration-300 z-50 glass-effect ${
          // Mobile: hidden by default, show only when isMobileOpen is true
          // Desktop: show by default, hide when isOpen is false
          isMobileOpen
            ? "translate-x-0"
            : isOpen
            ? "translate-x-0 sm:translate-x-0"
            : "translate-x-full sm:translate-x-full"
        } fixed sm:relative top-14 sm:top-0 dashboard-sidebar ${
          isMobileOpen ? "mobile-open" : ""
        }`}
      >
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto h-full">
          {/* Mobile Close Button */}
          <div className="flex justify-end mb-4 sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent focus-ring"
              onClick={onMobileClose}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4 text-foreground" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className={`w-full justify-start text-sm ${
                  pathname === "/dashboard"
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-foreground hover:text-primary hover:bg-accent"
                }`}
              >
                <span className="mr-2 text-base">🏠</span>
                Dashboard
              </Button>
            </Link>

            <Link href="/profile">
              <Button
                variant="ghost"
                className={`w-full justify-start text-sm ${
                  pathname === "/profile"
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-foreground hover:text-primary hover:bg-accent"
                }`}
              >
                <span className="mr-2 text-base">👤</span>
                My Profile
              </Button>
            </Link>

            <Separator className="my-4" />

            {/* Modules */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Modules
              </h3>

              <Link href="/social">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm ${
                    pathname === "/social"
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "text-foreground hover:text-primary hover:bg-accent"
                  }`}
                >
                  <span className="mr-2 text-base">💬</span>
                  Social Hub
                  <Badge className="ml-auto bg-primary/20 text-primary border-primary/30 text-xs">
                    5
                  </Badge>
                </Button>
              </Link>

              <Link href="/gaming">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm ${
                    pathname === "/gaming"
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "text-foreground hover:text-primary hover:bg-accent"
                  }`}
                >
                  <span className="mr-2 text-base">🎮</span>
                  Gaming Hub
                  <Badge className="ml-auto bg-primary/20 text-primary border-primary/30 text-xs">
                    New
                  </Badge>
                </Button>
              </Link>

              <Link href="/marketplace">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm ${
                    pathname === "/marketplace"
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "text-foreground hover:text-primary hover:bg-accent"
                  }`}
                >
                  <span className="mr-2 text-base">🛒</span>
                  Marketplace
                </Button>
              </Link>

              <Link href="/dev">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm ${
                    pathname === "/dev"
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "text-foreground hover:text-primary hover:bg-accent"
                  }`}
                >
                  <span className="mr-2 text-base">⚡</span>
                  Dev Hub
                </Button>
              </Link>
            </div>

            <Separator className="my-4" />

            {/* Communities */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                My Communities
              </h3>

              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-foreground hover:text-primary hover:bg-accent"
              >
                <span className="mr-2 text-base">🔒</span>
                DeFi Builders
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-foreground hover:text-primary hover:bg-accent"
              >
                <span className="mr-2 text-base">🎯</span>
                Gaming Guild Alpha
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-foreground hover:text-primary hover:bg-accent"
              >
                <span className="mr-2 text-base">💎</span>
                NFT Collectors
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Settings */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-foreground hover:text-primary hover:bg-accent"
              >
                <span className="mr-2 text-base">⚙️</span>
                Settings
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-foreground hover:text-primary hover:bg-accent"
              >
                <span className="mr-2 text-base">💰</span>
                Wallet & Staking
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-foreground hover:text-primary hover:bg-accent"
              >
                <span className="mr-2 text-base">📊</span>
                Analytics
              </Button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
});
