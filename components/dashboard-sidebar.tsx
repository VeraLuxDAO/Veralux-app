"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-20 right-4 z-50 bg-card border border-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "→" : "←"}
      </Button>

      <aside
        className={`w-64 border-l border-border bg-card h-[calc(100vh-4rem)] transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6">
          {/* Navigation */}
          <nav className="space-y-2">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  pathname === "/dashboard"
                    ? "bg-electric-blue/10 text-electric-blue"
                    : "text-card-foreground hover:text-electric-blue hover:bg-muted"
                }`}
              >
                <span className="mr-2">🏠</span>
                Dashboard
              </Button>
            </Link>

            <Link href="/profile">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  pathname === "/profile"
                    ? "bg-electric-blue/10 text-electric-blue"
                    : "text-card-foreground hover:text-electric-blue hover:bg-muted"
                }`}
              >
                <span className="mr-2">👤</span>
                My Profile
              </Button>
            </Link>

            <Separator className="my-4" />

            {/* Modules */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Modules</h3>

              <Link href="/social">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    pathname === "/social"
                      ? "bg-electric-blue/10 text-electric-blue"
                      : "text-card-foreground hover:text-electric-blue hover:bg-muted"
                  }`}
                >
                  <span className="mr-2">💬</span>
                  Social Hub
                  <Badge className="ml-auto bg-veralux-green/20 text-veralux-green border-veralux-green/30 text-xs">
                    5
                  </Badge>
                </Button>
              </Link>

              <Link href="/gaming">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    pathname === "/gaming"
                      ? "bg-electric-blue/10 text-electric-blue"
                      : "text-card-foreground hover:text-veralux-yellow hover:bg-muted"
                  }`}
                >
                  <span className="mr-2">🎮</span>
                  Gaming Hub
                  <Badge className="ml-auto bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/30 text-xs">
                    New
                  </Badge>
                </Button>
              </Link>

              <Link href="/marketplace">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    pathname === "/marketplace"
                      ? "bg-electric-blue/10 text-electric-blue"
                      : "text-card-foreground hover:text-veralux-green hover:bg-muted"
                  }`}
                >
                  <span className="mr-2">🛒</span>
                  Marketplace
                </Button>
              </Link>

              <Link href="/dev">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    pathname === "/dev"
                      ? "bg-electric-blue/10 text-electric-blue"
                      : "text-card-foreground hover:text-electric-blue hover:bg-muted"
                  }`}
                >
                  <span className="mr-2">⚡</span>
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
                className="w-full justify-start text-card-foreground hover:text-electric-blue hover:bg-muted"
              >
                <span className="mr-2">🔒</span>
                DeFi Builders
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-card-foreground hover:text-electric-blue hover:bg-muted"
              >
                <span className="mr-2">🎯</span>
                Gaming Guild Alpha
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-card-foreground hover:text-electric-blue hover:bg-muted"
              >
                <span className="mr-2">💎</span>
                NFT Collectors
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Settings */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-card-foreground hover:text-electric-blue hover:bg-muted"
              >
                <span className="mr-2">⚙️</span>
                Settings
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-card-foreground hover:text-electric-blue hover:bg-muted"
              >
                <span className="mr-2">💰</span>
                Wallet & Staking
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-card-foreground hover:text-electric-blue hover:bg-muted"
              >
                <span className="mr-2">📊</span>
                Analytics
              </Button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}
