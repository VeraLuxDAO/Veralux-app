import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background ">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 header-logo rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">V</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              VeraLux
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-6">
            <Button
              variant="ghost"
              className="nav-link text-foreground hover:text-electric-blue font-medium hidden sm:inline-flex"
            >
              About
            </Button>
            <Button
              variant="ghost"
              className="nav-link text-foreground hover:text-electric-blue font-medium hidden sm:inline-flex"
            >
              Features
            </Button>
            <ThemeToggle className="theme-toggle-nav" />
            <WalletConnectButton className="wallet-connect-button wallet-pulse text-sm px-3 py-2 sm:px-4 sm:py-2" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 sm:mb-6 bg-veralux-green/20 text-veralux-green border-veralux-green/30 text-xs sm:text-sm">
            🚀 Now in Beta - Join the Future of Web3 Identity
          </Badge>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Your <span className="text-electric-blue">Authentic</span> Digital
            Identity in <span className="text-veralux-green">Web3</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed px-4">
            VeraLux is the integrated dApp that combines identity, reputation,
            social engagement, gaming, marketplace, and development tools into
            one seamless Web3 experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
            <Button
              size="lg"
              className="bg-electric-blue hover:bg-electric-blue/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
            >
              Join Waitlist
            </Button>
            <Link href="/profile" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-transparent w-full"
              >
                Mint Your NFT Identity
              </Button>
            </Link>
          </div>

          {/* Waitlist Form */}
          <Card className="max-w-md mx-auto bg-card border-border mx-4 sm:mx-auto">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">
                Get Early Access
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Enter your email"
                  className="flex-1 bg-input border-border text-foreground"
                />
                <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white w-full sm:w-auto">
                  Join
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Be among the first to experience the future of Web3 identity
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
            One Platform,{" "}
            <span className="text-electric-blue">Infinite Possibilities</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Discover the integrated modules that make VeraLux the ultimate Web3
            platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Social Hub */}
          <Card className="bg-card border-border hover:border-electric-blue/50 transition-colors">
            <CardContent className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-electric-blue/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">💬</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-card-foreground">
                Social Hub
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Connect, share, and engage with authentic Web3 communities
                through Flows, Rooms, and Circles.
              </p>
            </CardContent>
          </Card>

          {/* Gaming Hub */}
          <Card className="bg-card border-border hover:border-veralux-yellow/50 transition-colors">
            <CardContent className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-veralux-yellow/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🎮</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-card-foreground">
                Gaming Hub
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Discover games, join guilds, and build your gaming reputation
                across the Web3 ecosystem.
              </p>
            </CardContent>
          </Card>

          {/* Marketplace */}
          <Card className="bg-card border-border hover:border-veralux-green/50 transition-colors">
            <CardContent className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-veralux-green/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🛒</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-card-foreground">
                Marketplace
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Trade with confidence using our vetted marketplace with built-in
                escrow and reputation system.
              </p>
            </CardContent>
          </Card>

          {/* Dev Hub */}
          <Card className="bg-card border-border hover:border-electric-blue/50 transition-colors">
            <CardContent className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-electric-blue/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">⚡</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-card-foreground">
                Dev Hub
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Build and deploy Web3 applications with our integrated SDK and
                development sandbox.
              </p>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card className="bg-card border-border hover:border-veralux-yellow/50 transition-colors">
            <CardContent className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-veralux-yellow/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🤖</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-card-foreground">
                Luxie AI
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Your personal Web3 assistant, available everywhere to help
                navigate the ecosystem.
              </p>
            </CardContent>
          </Card>

          {/* Identity NFT */}
          <Card className="bg-card border-border hover:border-veralux-green/50 transition-colors">
            <CardContent className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-veralux-green/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🎭</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-card-foreground">
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <Card className="bg-gradient-veralux text-white border-0">
          <CardContent className="p-6 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Ready to Build Your Web3 Identity?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 px-4">
              Join thousands of users already building their authentic digital
              presence on VeraLux
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                size="lg"
                className="bg-white text-electric-blue hover:bg-white/90 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              >
                Join Waitlist Now
              </Button>
              <WalletConnectButton
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-electric-blue px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-transparent wallet-button w-full sm:w-auto"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-electric-blue rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">
                  V
                </span>
              </div>
              <span className="text-base sm:text-lg font-semibold text-foreground">
                VeraLux
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <a
                href="#"
                className="hover:text-electric-blue transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-electric-blue transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-electric-blue transition-colors"
              >
                Docs
              </a>
              <a
                href="#"
                className="hover:text-electric-blue transition-colors"
              >
                Support
              </a>
            </div>
          </div>
          <div className="text-center mt-4 text-xs sm:text-sm text-muted-foreground">
            © 2024 VeraLux. Building the future of Web3 identity.
          </div>
        </div>
      </footer>
    </div>
  );
}
