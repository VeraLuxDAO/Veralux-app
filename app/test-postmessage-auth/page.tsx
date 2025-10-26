"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useWallet } from "@suiet/wallet-kit";

function PostMessageAuthTestContent() {
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

  const handleTestAuth = async () => {
    addLog("Starting PostMessage Google OAuth test...");
    addLog(
      `Current auth state: authenticated=${auth.isAuthenticated}, loading=${auth.isLoading}`
    );

    try {
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
      localStorage.removeItem("veralux_auth_user");
      sessionStorage.removeItem("veralux_google_auth");
      addLog("Storage cleared");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          PostMessage Google OAuth Test
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Control Panel */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Control Panel</h2>
              <div className="space-y-3">
                <button
                  onClick={handleTestAuth}
                  disabled={auth.isLoading}
                  className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {auth.isLoading
                    ? "Loading..."
                    : "Test PostMessage Google Auth"}
                </button>
                <button
                  onClick={clearLogs}
                  className="w-full bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-muted/80"
                >
                  Clear Logs
                </button>
                <button
                  onClick={clearStorage}
                  className="w-full bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90"
                >
                  Clear Storage
                </button>
              </div>
            </div>

            {/* Current State */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Current State</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Google OAuth:</span>
                  <span
                    className={
                      auth.isAuthenticated ? "text-green-600" : "text-red-600"
                    }
                  >
                    {auth.isAuthenticated
                      ? "✓ Authenticated"
                      : "✗ Not authenticated"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Loading:</span>
                  <span
                    className={
                      auth.isLoading ? "text-yellow-600" : "text-green-600"
                    }
                  >
                    {auth.isLoading ? "⏳ Loading..." : "✓ Ready"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Error:</span>
                  <span
                    className={auth.error ? "text-red-600" : "text-green-600"}
                  >
                    {auth.error || "None"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Wallet:</span>
                  <span
                    className={
                      wallet.connected ? "text-green-600" : "text-red-600"
                    }
                  >
                    {wallet.connected ? "✓ Connected" : "✗ Not connected"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Address:</span>
                  <span className="text-muted-foreground">
                    {wallet.address || "None"}
                  </span>
                </div>
              </div>
            </div>

            {/* Session Storage Data */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">
                Session Storage Data
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Google Auth Data:</span>
                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto max-h-32">
                    {sessionData?.googleAuth
                      ? JSON.stringify(sessionData.googleAuth, null, 2)
                      : "No data"}
                  </pre>
                </div>
                <div>
                  <span className="font-medium">Auth User Data:</span>
                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto max-h-32">
                    {sessionData?.authUser
                      ? JSON.stringify(sessionData.authUser, null, 2)
                      : "No data"}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Logs */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
            <div className="bg-muted p-4 rounded-lg h-96 overflow-y-auto">
              {debugLogs.length === 0 ? (
                <p className="text-muted-foreground">No logs yet...</p>
              ) : (
                <div className="space-y-1">
                  {debugLogs.map((log, index) => (
                    <div key={index} className="text-sm font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex space-x-4">
          <a href="/debug" className="text-primary hover:underline">
            Debug Info
          </a>
          <a href="/env-check" className="text-primary hover:underline">
            Environment Check
          </a>
          <a href="/" className="text-primary hover:underline">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PostMessageAuthTest() {
  return <PostMessageAuthTestContent />;
}
