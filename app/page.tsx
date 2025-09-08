"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Redesigned with Better UI/UX */}
      <header className="border-b border-border/50 backdrop-blur-md bg-background/95 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo Section - Left */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-electric-blue to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm sm:text-lg md:text-xl">
                V
              </span>
            </div>
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              VeraLux
            </span>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-8">
            <Button
              variant="ghost"
              className="nav-link text-foreground hover:text-electric-blue font-medium text-sm transition-colors duration-200"
            >
              About
            </Button>
            <Button
              variant="ghost"
              className="nav-link text-foreground hover:text-electric-blue font-medium text-sm transition-colors duration-200"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className="nav-link text-foreground hover:text-electric-blue font-medium text-sm transition-colors duration-200"
            >
              Docs
            </Button>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle className="theme-toggle-nav w-9 h-9 hover:bg-accent rounded-lg transition-colors duration-200" />
            <WalletConnectButton className="wallet-connect-button wallet-pulse text-sm px-4 py-2 bg-gradient-to-r from-electric-blue to-purple-600 hover:from-electric-blue/90 hover:to-purple-600/90 text-white border-0 shadow-md" />
          </div>

          {/* Mobile Right Section */}
          <div className="flex lg:hidden items-center space-x-3">
            {/* Mobile Wallet Button - Compact */}
            <div className="hidden sm:block">
              <WalletConnectButton className="wallet-connect-button wallet-pulse text-xs px-3 py-1.5 bg-gradient-to-r from-electric-blue to-purple-600 hover:from-electric-blue/90 hover:to-purple-600/90 text-white border-0 shadow-md rounded-lg" />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle className="theme-toggle-nav w-8 h-8 sm:w-9 sm:h-9 hover:bg-accent rounded-lg transition-colors duration-200" />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent p-2 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Enhanced */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-sm shadow-lg">
            <div className="container mx-auto px-3 sm:px-4 py-4 space-y-3">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-foreground hover:text-electric-blue font-medium text-sm py-3"
                >
                  About
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-foreground hover:text-electric-blue font-medium text-sm py-3"
                >
                  Features
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-foreground hover:text-electric-blue font-medium text-sm py-3"
                >
                  Docs
                </Button>
              </div>

              {/* Mobile Wallet Section */}
              <div className="pt-3 border-t border-border/50">
                <div className="sm:hidden mb-3">
                  <WalletConnectButton className="w-full wallet-connect-button wallet-pulse text-sm px-4 py-3 bg-gradient-to-r from-electric-blue to-purple-600 hover:from-electric-blue/90 hover:to-purple-600/90 text-white border-0 shadow-md" />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Connect your wallet to access all VeraLux features
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Enhanced */}
      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 sm:mb-6 bg-veralux-green/20 text-veralux-green border-veralux-green/30 text-sm px-3 py-1.5">
            🚀 Now in Beta - Join the Future of Web3 Identity
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Your <span className="text-electric-blue">Authentic</span> Digital
            Identity in <span className="text-veralux-green">Web3</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto">
            VeraLux is the integrated dApp that combines identity, reputation,
            social engagement, gaming, marketplace, and development tools into
            one seamless Web3 experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-electric-blue to-purple-600 hover:from-electric-blue/90 hover:to-purple-600/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto shadow-lg"
            >
              Join Waitlist
            </Button>
            <Link href="/profile" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-transparent w-full shadow-lg"
              >
                Mint Your NFT Identity
              </Button>
            </Link>
          </div>

          {/* Waitlist Form - Enhanced */}
          <Card className="max-w-md mx-auto bg-card border-border shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-card-foreground">
                Get Early Access
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Enter your email"
                  className="flex-1 bg-input border-border text-foreground"
                />
                <Button className="bg-gradient-to-r from-electric-blue to-purple-600 hover:from-electric-blue/90 hover:to-purple-600/90 text-white w-full sm:w-auto">
                  Join
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Be among the first to experience the future of Web3 identity
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Grid - Enhanced */}
      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            One Platform,{" "}
            <span className="text-electric-blue">Infinite Possibilities</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the integrated modules that make VeraLux the ultimate Web3
            platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Social Hub */}
          <Card className="bg-card border-border hover:border-electric-blue/50 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-electric-blue/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-electric-blue/30 transition-colors duration-300">
                <span className="text-2xl sm:text-3xl">💬</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-card-foreground">
                Social Hub
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Connect, share, and engage with authentic Web3 communities
                through Flows, Rooms, and Circles.
              </p>
            </CardContent>
          </Card>

          {/* Gaming Hub */}
          <Card className="bg-card border-border hover:border-veralux-yellow/50 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-veralux-yellow/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-veralux-yellow/30 transition-colors duration-300">
                <span className="text-2xl sm:text-3xl">🎮</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-card-foreground">
                Gaming Hub
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Discover games, join guilds, and build your gaming reputation
                across the Web3 ecosystem.
              </p>
            </CardContent>
          </Card>

          {/* Marketplace */}
          <Card className="bg-card border-border hover:border-veralux-green/50 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-veralux-green/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-veralux-green/30 transition-colors duration-300">
                <span className="text-2xl sm:text-3xl">🛒</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-card-foreground">
                Marketplace
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Trade with confidence using our vetted marketplace with built-in
                escrow and reputation system.
              </p>
            </CardContent>
          </Card>

          {/* Dev Hub */}
          <Card className="bg-card border-border hover:border-electric-blue/50 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-electric-blue/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-electric-blue/30 transition-colors duration-300">
                <span className="text-2xl sm:text-3xl">⚡</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-card-foreground">
                Dev Hub
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Build and deploy Web3 applications with our integrated SDK and
                development sandbox.
              </p>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card className="bg-card border-border hover:border-veralux-yellow/50 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-veralux-yellow/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-veralux-yellow/30 transition-colors duration-300">
                <span className="text-2xl sm:text-3xl">🤖</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-card-foreground">
                KYNO AI
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Your personal Web3 assistant, available everywhere to help
                navigate the ecosystem.
              </p>
            </CardContent>
          </Card>

          {/* Identity NFT */}
          <Card className="bg-card border-border hover:border-veralux-green/50 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-veralux-green/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-veralux-green/30 transition-colors duration-300">
                <span className="text-2xl sm:text-3xl">🎭</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-card-foreground">
                NFT Identity
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Mint your unique profile NFT and customize your digital identity
                with skills and reputation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
        <Card className="bg-gradient-to-br from-electric-blue via-purple-600 to-electric-blue text-white border-0 shadow-2xl">
          <CardContent className="p-6 sm:p-8 md:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Build Your Web3 Identity?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users already building their authentic digital
              presence on VeraLux
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-electric-blue hover:bg-white/90 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto shadow-lg"
              >
                Join Waitlist Now
              </Button>
              <WalletConnectButton
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-electric-blue px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-transparent w-full sm:w-auto shadow-lg"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer - Enhanced */}
      <footer className="border-t border-border bg-background/50">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-electric-blue to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-lg sm:text-xl font-semibold text-foreground">
                VeraLux
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
              <a
                href="#"
                className="hover:text-electric-blue transition-colors duration-200"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-electric-blue transition-colors duration-200"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-electric-blue transition-colors duration-200"
              >
                Docs
              </a>
              <a
                href="#"
                className="hover:text-electric-blue transition-colors duration-200"
              >
                Support
              </a>
            </div>
          </div>
          <div className="text-center mt-4 text-sm text-muted-foreground">
            © 2024 VeraLux. Building the future of Web3 identity.
          </div>
        </div>
      </footer>
    </div>
  );
}
