"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useWallet } from "@suiet/wallet-kit";

export default function DebugAuthFlow() {
  const auth = useAuth();
  const wallet = useWallet();
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [sessionData, setSessionData] = useState<any>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[DEBUG] ${message}`);
  };

  const checkSessionStorage = () => {
    if (typeof window === "undefined") return null;

    const googleAuth = sessionStorage.getItem("veralux_google_auth");
    const authUser = localStorage.getItem("veralux_auth_user");

    return {
      googleAuth: googleAuth ? JSON.parse(googleAuth) : null,
      authUser: authUser ? JSON.parse(authUser) : null,
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const data = checkSessionStorage();
      setSessionData(data);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    addLog(
      `Auth state changed: authenticated=${auth.isAuthenticated}, loading=${auth.isLoading}`
    );
  }, [auth.isAuthenticated, auth.isLoading]);

  useEffect(() => {
    addLog(`Wallet state changed: connected=${wallet.connected}`);
  }, [wallet.connected]);

  const testGoogleAuth = async () => {
    try {
      addLog("Starting Google OAuth test...");
      addLog(
        `Current auth state: authenticated=${auth.isAuthenticated}, loading=${auth.isLoading}`
      );

      await auth.signInWithGoogle();
      addLog("Google OAuth request sent");
    } catch (error) {
      addLog(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const clearLogs = () => {
    setDebugLogs([]);
  };

  const clearStorage = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("veralux_google_auth");
      localStorage.removeItem("veralux_auth_user");
      addLog("Storage cleared");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Auth Flow</h1>

      <div className="space-y-6">
        {/* Control Panel */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Control Panel</h2>
          <div className="space-x-4">
            <button
              onClick={testGoogleAuth}
              className="bg-electric-blue text-white px-4 py-2 rounded-lg hover:bg-electric-blue/90"
              disabled={auth.isLoading}
            >
              {auth.isLoading ? "Loading..." : "Test Google Auth"}
            </button>
            <button
              onClick={clearLogs}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Clear Logs
            </button>
            <button
              onClick={clearStorage}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Clear Storage
            </button>
          </div>
        </div>

        {/* Current State */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Current State</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Google OAuth:</strong>{" "}
                {auth.isAuthenticated
                  ? "✅ Authenticated"
                  : "❌ Not authenticated"}
              </p>
              <p>
                <strong>Loading:</strong>{" "}
                {auth.isLoading ? "🔄 Loading" : "✅ Ready"}
              </p>
              <p>
                <strong>Error:</strong> {auth.error || "None"}
              </p>
            </div>
            <div>
              <p>
                <strong>Wallet:</strong>{" "}
                {wallet.connected ? "✅ Connected" : "❌ Not connected"}
              </p>
              <p>
                <strong>Address:</strong> {wallet.account?.address || "None"}
              </p>
            </div>
          </div>
        </div>

        {/* Session Storage Data */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Session Storage Data</h2>
          <div className="space-y-2">
            <p>
              <strong>Google Auth Data:</strong>
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto max-h-32">
              {sessionData?.googleAuth
                ? JSON.stringify(sessionData.googleAuth, null, 2)
                : "No data"}
            </pre>

            <p>
              <strong>Auth User Data:</strong>
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto max-h-32">
              {sessionData?.authUser
                ? JSON.stringify(sessionData.authUser, null, 2)
                : "No data"}
            </pre>
          </div>
        </div>

        {/* Debug Logs */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Debug Logs</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto max-h-64">
            {debugLogs.length === 0 ? (
              <p className="text-gray-500">No logs yet...</p>
            ) : (
              debugLogs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Environment Check */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Environment Check</h2>
          <div className="space-y-2">
            <p>
              <strong>Google Client ID:</strong>{" "}
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "Not set"}
            </p>
            <p>
              <strong>Current URL:</strong>{" "}
              {typeof window !== "undefined" ? window.location.href : "N/A"}
            </p>
            <p>
              <strong>Google Object:</strong>{" "}
              {typeof window !== "undefined" && (window as any).google
                ? "Available"
                : "Not available"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-x-4">
          <a
            href="/test-integration"
            className="text-electric-blue hover:underline"
          >
            Integration Test
          </a>
          <a href="/test-google" className="text-electric-blue hover:underline">
            Google Auth Test
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
