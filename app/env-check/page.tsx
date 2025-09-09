"use client";

import { useEffect, useState } from "react";

export default function EnvironmentCheck() {
  const [envData, setEnvData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        const response = await fetch("/api/debug/env");
        const data = await response.json();
        setEnvData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    checkEnvironment();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Check</h1>

      <div className="space-y-6">
        {loading && (
          <div className="bg-muted p-4 rounded-lg">
            <p>Loading environment check...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">
              Error:
            </h2>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {envData && (
          <div className="bg-muted p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Environment Status:</h2>
            <div className="space-y-2">
              <p>
                <strong>Google Client ID:</strong>{" "}
                <span
                  className={
                    envData.clientId !== "Not set"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {envData.clientId}
                </span>
              </p>
              <p>
                <strong>Google Client Secret:</strong>{" "}
                <span
                  className={
                    envData.hasClientSecret ? "text-green-600" : "text-red-600"
                  }
                >
                  {envData.hasClientSecret ? "✅ Set" : "❌ Not set"}
                </span>
              </p>
              <p>
                <strong>NextAuth URL:</strong>{" "}
                {envData.nextAuthUrl || "Not set"}
              </p>
              <p>
                <strong>Check Time:</strong> {envData.timestamp}
              </p>
            </div>
          </div>
        )}

        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
            Required Environment Variables:
          </h2>
          <div className="space-y-2 text-yellow-700 dark:text-yellow-300">
            <p>
              Make sure your <code>.env.local</code> file contains:
            </p>
            <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm">
              {`NEXT_PUBLIC_GOOGLE_CLIENT_ID=338707696343-7fig90qa3lfa523sur0rstdfqhraf31b.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
NEXTAUTH_URL=http://localhost:3000`}
            </pre>
          </div>
        </div>

        <div className="space-x-4">
          <a
            href="/test-postmessage-auth"
            className="text-electric-blue hover:underline"
          >
            Test PostMessage Auth
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
