"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useWallet } from "@suiet/wallet-kit";

export default function GoogleWalletIntegrationTest() {
  const auth = useAuth();
  const wallet = useWallet();
  const [status, setStatus] = useState("Ready to test");

  const testGoogleAuth = async () => {
    try {
      setStatus("Starting Google OAuth...");
      await auth.signInWithGoogle();
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const checkSessionStorage = () => {
    if (typeof window === "undefined") {
      return {
        googleAuth: null,
        authUser: null,
      };
    }

    const googleAuth = sessionStorage.getItem("veralux_google_auth");
    const authUser = localStorage.getItem("veralux_auth_user");

    return {
      googleAuth: googleAuth ? JSON.parse(googleAuth) : null,
      authUser: authUser ? JSON.parse(authUser) : null,
    };
  };

  const [sessionData, setSessionData] = useState(checkSessionStorage());

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionData(checkSessionStorage());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">
        Google OAuth + Wallet Integration Test
      </h1>

      <div className="space-y-6">
        {/* Test Button */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Test Google OAuth</h2>
          <button
            onClick={testGoogleAuth}
            className="bg-electric-blue text-white px-6 py-2 rounded-lg hover:bg-electric-blue/90"
            disabled={auth.isLoading}
          >
            {auth.isLoading ? "Loading..." : "Start Google OAuth"}
          </button>
          <p className="text-sm text-muted-foreground mt-2">Status: {status}</p>
        </div>

        {/* Authentication Status */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
          <div className="space-y-2">
            <p>
              <strong>Google OAuth:</strong>{" "}
              <span
                className={
                  auth.isAuthenticated ? "text-green-600" : "text-red-600"
                }
              >
                {auth.isAuthenticated
                  ? "✅ Authenticated"
                  : "❌ Not authenticated"}
              </span>
            </p>
            <p>
              <strong>Wallet Connection:</strong>{" "}
              <span
                className={wallet.connected ? "text-green-600" : "text-red-600"}
              >
                {wallet.connected ? "✅ Connected" : "❌ Not connected"}
              </span>
            </p>
            <p>
              <strong>User:</strong> {auth.user?.name || "None"}
            </p>
            <p>
              <strong>Wallet Address:</strong>{" "}
              {wallet.account?.address || "None"}
            </p>
          </div>
        </div>

        {/* Session Storage Data */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Session Storage Data</h2>
          <div className="space-y-2">
            <p>
              <strong>Google Auth Data:</strong>
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
              {sessionData.googleAuth
                ? JSON.stringify(sessionData.googleAuth, null, 2)
                : "No data"}
            </pre>

            <p>
              <strong>Auth User Data:</strong>
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
              {sessionData.authUser
                ? JSON.stringify(sessionData.authUser, null, 2)
                : "No data"}
            </pre>
          </div>
        </div>

        {/* Expected Flow */}
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">
            Expected Flow:
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-blue-700 dark:text-blue-300">
            <li>Click "Start Google OAuth"</li>
            <li>Google login popup appears</li>
            <li>After successful login, Google OAuth status becomes ✅</li>
            <li>Wallet connection modal automatically appears</li>
            <li>After wallet connection, both statuses become ✅</li>
            <li>User is redirected to dashboard</li>
          </ol>
        </div>

        {/* Navigation */}
        <div className="space-x-4">
          <a href="/test-google" className="text-electric-blue hover:underline">
            Test Google Auth (Redirect)
          </a>
          <a
            href="/test-google-postmessage"
            className="text-electric-blue hover:underline"
          >
            Test Google Auth (PostMessage)
          </a>
          <a href="/debug" className="text-electric-blue hover:underline">
            Debug Info
          </a>
          <a href="/" className="text-electric-blue hover:underline">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
