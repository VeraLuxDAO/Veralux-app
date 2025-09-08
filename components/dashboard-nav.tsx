"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuxieAI } from "./luxie-ai";

export function DashboardNav() {
  const [isLuxieOpen, setIsLuxieOpen] = useState(false);

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center px-6">
          {/* Logo */}
          <div className="flex items-center space-x-2 mr-8">
            <div className="w-8 h-8 bg-electric-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold text-card-foreground">
              VeraLux
            </span>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Search flows, users, or topics..."
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
              />
              <div className="absolute right-3 top-2.5">
                <span className="text-muted-foreground text-sm">⌘K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-8">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <span className="text-lg">🔔</span>
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-veralux-yellow text-black text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>

            {/* Luxie AI */}
            <Button
              variant="ghost"
              size="sm"
              className="text-electric-blue hover:text-electric-blue/80"
              onClick={() => setIsLuxieOpen(true)}
            >
              <span className="text-lg mr-1">🤖</span>
              Luxie
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle size="sm" />

            {/* Wallet Connection */}
            <WalletConnectButton
              variant="ghost"
              size="sm"
              showAddress={false}
            />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/user-profile-illustration.png" />
                    <AvatarFallback>AX</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Alex Chen
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      alex@veralux.app
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Wallet & Staking</DropdownMenuItem>
                <DropdownMenuItem>Privacy Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Luxie AI modal */}
      <LuxieAI isOpen={isLuxieOpen} onClose={() => setIsLuxieOpen(false)} />
    </>
  );
}
