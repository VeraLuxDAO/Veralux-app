"use client";

import { ConnectButton } from "@suiet/wallet-kit";
import { useWallet } from "@suiet/wallet-kit";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { WalletAccountModal } from "@/components/wallet-account-modal";
import { ClientOnly } from "@/components/client-only";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { Wallet, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface WalletConnectButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  showAddress?: boolean;
}

function WalletConnectButtonContent({
  variant = "default",
  size = "default",
  className = "",
  showAddress = true,
}: WalletConnectButtonProps) {
  const wallet = useWallet();
  const auth = useAuth();
  const router = useRouter();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Handle automatic redirect to dashboard when both auth and wallet are connected
  // Only redirect once after successful login and wallet connection
  useEffect(() => {
    if (auth.isAuthenticated && wallet.connected && !auth.isLoading) {
      // Check if we've already redirected to dashboard after login
      const hasRedirectedAfterLogin = sessionStorage.getItem(
        "veralux_redirected_after_login"
      );

      if (!hasRedirectedAfterLogin) {
        // Mark that we've redirected to prevent future automatic redirects
        sessionStorage.setItem("veralux_redirected_after_login", "true");
        console.log(
          "First-time redirect to social hub after login and wallet connection"
        );
        router.push("/");
      } else {
        console.log(
          "User already redirected to social hub, allowing free navigation"
        );
      }
    }
  }, [auth.isAuthenticated, wallet.connected, auth.isLoading, router]);

  // Listen for Google OAuth success events
  useEffect(() => {
    const handleGoogleAuthSuccess = () => {
      // Google OAuth succeeded, now trigger wallet connection
      if (auth.isAuthenticated && !wallet.connected) {
        // The wallet connection modal should be triggered automatically
        console.log(
          "Google OAuth successful, wallet connection should be triggered"
        );
      }
    };

    window.addEventListener(
      "veralux:triggerWalletConnection",
      handleGoogleAuthSuccess
    );

    return () => {
      window.removeEventListener(
        "veralux:triggerWalletConnection",
        handleGoogleAuthSuccess
      );
    };
  }, [auth.isAuthenticated, wallet.connected]);

  // If user is authenticated with Google OAuth but wallet not connected
  if (auth.isAuthenticated && !wallet.connected) {
    return (
      <ConnectButton className={`wallet-connect-button ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
              {auth.user?.name?.charAt(0) || "G"}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold">Connect Wallet</span>
          <Badge
            variant="secondary"
            className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            Authenticated
          </Badge>
        </div>
      </ConnectButton>
    );
  }

  // If user is authenticated with Google OAuth and wallet is connected
  if (auth.isAuthenticated && wallet.connected) {
    return (
      <>
        <Button
          variant={variant}
          size={size}
          className={`${className} wallet-connected-button hover:shadow-xl transition-all duration-300 group`}
          onClick={() => setIsAccountModalOpen(true)}
        >
          <Avatar className="h-6 w-6 mr-2">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
              {auth.user?.name?.charAt(0) || wallet.name?.charAt(0) || "W"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">
            {showAddress && wallet.account?.address
              ? `${wallet.account.address.slice(
                  0,
                  6
                )}...${wallet.account.address.slice(-4)}`
              : auth.user?.name || wallet.name || "Wallet"}
          </span>
          <Badge
            variant="secondary"
            className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            Connected
          </Badge>
        </Button>

        <WalletAccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
        />
      </>
    );
  }

  // If user is not authenticated, show Google OAuth login
  if (!auth.isAuthenticated) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`wallet-connect-button ${className}`}
        onClick={auth.signInWithGoogle}
        disabled={auth.isLoading}
      >
        <div className="flex items-center justify-center space-x-3">
          {auth.isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Wallet className="w-5 h-5" />
          )}
          <span className="font-semibold">
            {auth.isLoading ? "Connecting..." : "Connect with Google"}
          </span>
        </div>
      </Button>
    );
  }

  // Fallback to traditional wallet connection
  return (
    <ConnectButton className={`wallet-connect-button ${className}`}>
      <div className="flex items-center justify-center space-x-3">
        <Wallet className="w-5 h-5" />
        <span className="font-semibold">Connect Wallet</span>
      </div>
    </ConnectButton>
  );
}

export function WalletConnectButton(props: WalletConnectButtonProps) {
  return (
    <ClientOnly
      fallback={
        <div className="wallet-connect-button inline-flex items-center justify-center rounded-md text-sm font-medium px-6 py-3 h-12">
          <Wallet className="w-5 h-5 mr-3" />
          <span className="font-semibold">Connect Wallet</span>
        </div>
      }
    >
      <WalletConnectButtonContent {...props} />
    </ClientOnly>
  );
}
