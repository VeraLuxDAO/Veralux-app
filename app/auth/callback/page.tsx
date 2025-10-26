"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/auth-service";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      router.push("/?error=oauth_error");
      return;
    }

    if (code) {
      // Send the authorization code to our API
      fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.error) {
            console.error("API error:", data.error);
            router.push("/?error=api_error");
          } else {
            // Complete authentication with the auth service
            await authService.completeAuthentication(data.jwt, data.user);
            // Success - redirect to dashboard after wallet connection
            // Only redirect if this is the first time (not already redirected)
            setTimeout(() => {
              const hasRedirectedAfterLogin = sessionStorage.getItem(
                "veralux_redirected_after_login"
              );
              if (!hasRedirectedAfterLogin) {
                sessionStorage.setItem(
                  "veralux_redirected_after_login",
                  "true"
                );
                router.push("/");
              } else {
                // User already redirected, go to home page instead
                router.push("/");
              }
            }, 2000); // Give time for wallet connection to be triggered
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          router.push("/?error=fetch_error");
        });
    } else {
      router.push("/?error=no_code");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
        <p className="text-foreground">
          Google login successful! Connecting wallet...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Wallet connection modal will appear automatically
        </p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
            <p className="text-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
