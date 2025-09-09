"use client";

import { useEffect, useState } from "react";

export default function GoogleAuthTestPostMessage() {
  const [status, setStatus] = useState("Loading...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testGoogleAuth = async () => {
      try {
        setStatus("Loading Google script...");

        // Load Google script
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          script.onload = () => resolve(undefined);
          script.onerror = () =>
            reject(new Error("Failed to load Google script"));
          document.head.appendChild(script);
        });

        setStatus("Waiting for Google to initialize...");

        // Wait for Google to initialize
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setStatus("Initializing Google Auth client...");

        // Check if Google is available
        if (typeof window.google === "undefined") {
          throw new Error("Google object not available");
        }

        // Test the client initialization with postMessage
        const client = window.google.accounts.oauth2.initCodeClient({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          scope: "openid email profile",
          ux_mode: "popup",
          callback: (response: any) => {
            console.log("Callback received:", response);
            setStatus("Callback received: " + JSON.stringify(response));
          },
        });

        setStatus(
          "Google Auth client initialized successfully! Click 'Test Auth' to proceed."
        );

        // Store client for later use
        (window as any).googleAuthClient = client;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
        setStatus("Error: " + errorMessage);
        console.error("Google Auth test error:", error);
      }
    };

    testGoogleAuth();
  }, []);

  const testAuth = () => {
    try {
      const client = (window as any).googleAuthClient;
      if (client) {
        client.requestCode();
        setStatus("Auth request sent! Check popup window.");
      } else {
        setError("Google Auth client not initialized");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">
          Google Auth Test (PostMessage)
        </h1>

        <div className="bg-muted p-4 rounded-lg mb-4">
          <p className="text-foreground">{status}</p>
          {error && <p className="text-red-500 mt-2">Error: {error}</p>}
        </div>

        <div className="bg-muted p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Configuration:</h3>
          <p className="text-sm text-muted-foreground">
            <strong>Client ID:</strong>{" "}
            {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "Not set"}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Mode:</strong> PostMessage (no redirect URI needed)
          </p>
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
            ⚠️ This version uses PostMessage
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            This approach doesn't require redirect URI configuration in Google
            Cloud Console. It uses postMessage to communicate with the popup
            window.
          </p>
        </div>

        <button
          onClick={testAuth}
          className="bg-electric-blue text-white px-6 py-2 rounded-lg hover:bg-electric-blue/90 disabled:opacity-50"
          disabled={!!error}
        >
          Test Google Auth (PostMessage)
        </button>

        <div className="mt-4 space-x-4">
          <a href="/test-google" className="text-electric-blue hover:underline">
            Test Redirect Version
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
