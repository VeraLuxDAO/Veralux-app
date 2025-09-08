"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { LuxieAI } from "./luxie-ai";
import { Menu, Search, Bell, PanelLeft } from "lucide-react";

interface DashboardNavProps {
  onMobileSidebarToggle?: () => void;
}

export function DashboardNav({ onMobileSidebarToggle }: DashboardNavProps) {
  const [isLuxieOpen, setIsLuxieOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex h-12 sm:h-14 md:h-16 items-center px-3 sm:px-4 md:px-6">
          {/* Mobile Sidebar Toggle Button - Only visible on screens < 1024px */}
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 hover:bg-accent lg:hidden"
            onClick={onMobileSidebarToggle}
          >
            <PanelLeft className="h-5 w-5 text-foreground" />
          </Button>

          {/* Mobile Menu Button - Only visible on screens < 1024px */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-accent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5 text-foreground" />
          </Button>

          {/* Logo */}
          <div className="flex items-center space-x-2 mr-4 sm:mr-8">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm sm:text-lg">
                V
              </span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">
              VeraLux
            </span>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Search flows, users, or topics..."
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute right-3 top-2.5">
                <span className="text-muted-foreground text-sm">⌘K</span>
              </div>
            </div>
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden ml-auto mr-2 hover:bg-accent"
          >
            <Search className="h-4 w-4 text-foreground" />
          </Button>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-accent"
            >
              <Bell className="h-4 w-4 sm:hidden text-foreground" />
              <span className="text-lg hidden sm:inline">🔔</span>
              <Badge className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 p-0 bg-primary text-primary-foreground text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>

            {/* KYNO AI - Hidden on mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 hover:bg-accent hidden sm:flex"
              onClick={() => setIsLuxieOpen(true)}
            >
              <span className="text-lg mr-1">🤖</span>
              KYNO AI
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle size="sm" />

            {/* Wallet Connection - Compact on mobile */}
            <WalletConnectButton
              variant="ghost"
              size="sm"
              showAddress={false}
              className="hidden sm:flex"
            />
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-sm p-3 sm:p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search flows, users, or topics..."
                className="w-full px-3 sm:px-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute right-3 top-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Mobile Menu Items */}
            <div className="mt-3 sm:mt-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-primary hover:bg-accent"
                onClick={() => setIsLuxieOpen(true)}
              >
                <span className="text-lg mr-2">🤖</span>
                KYNO AI
              </Button>
              <WalletConnectButton
                variant="outline"
                className="w-full"
                showAddress={true}
              />
            </div>
          </div>
        )}
      </header>

      {/* KYNO AI modal */}
      <LuxieAI isOpen={isLuxieOpen} onClose={() => setIsLuxieOpen(false)} />
    </>
  );
}
