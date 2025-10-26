"use client";

export default function DebugPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Environment Variables:</h2>
          <div className="bg-muted p-4 rounded-lg">
            <p>
              <strong>NEXT_PUBLIC_GOOGLE_CLIENT_ID:</strong>{" "}
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "Not set"}
            </p>
            <p>
              <strong>NEXTAUTH_URL:</strong>{" "}
              {process.env.NEXTAUTH_URL || "Not set"}
            </p>
            <p>
              <strong>NEXT_PUBLIC_SUI_NETWORK:</strong>{" "}
              {process.env.NEXT_PUBLIC_SUI_NETWORK || "Not set"}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Current Configuration:</h2>
          <div className="bg-muted p-4 rounded-lg">
            <p>
              <strong>Client ID:</strong>{" "}
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "Not set"}
            </p>
            <p>
              <strong>Redirect URI (Auth Service):</strong>{" "}
              http://localhost:3000/auth/callback
            </p>
            <p>
              <strong>Redirect URI (API Route):</strong>{" "}
              http://localhost:3000/auth/callback
            </p>
            <p>
              <strong>Current URL:</strong>{" "}
              {typeof window !== "undefined" ? window.location.origin : "N/A"}
            </p>
          </div>
        </div>

        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">
            ⚠️ Google Cloud Console Configuration Required:
          </h2>
          <div className="space-y-2 text-red-700 dark:text-red-300">
            <p>
              <strong>1. Authorized JavaScript origins:</strong>
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>http://localhost:3000</li>
            </ul>
            <p>
              <strong>2. Authorized redirect URIs:</strong>
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>http://localhost:3000/auth/callback</li>
            </ul>
            <p>
              <strong>3. Make sure your Client ID matches:</strong>
            </p>
            <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "Not set"}
            </code>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Troubleshooting Steps:</h2>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p>
              1. Go to{" "}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-electric-blue hover:underline"
              >
                Google Cloud Console
              </a>
            </p>
            <p>2. Select your OAuth 2.0 Client ID</p>
            <p>
              3. Add the exact redirect URI: http://localhost:3000/auth/callback
            </p>
            <p>4. Add JavaScript origin: http://localhost:3000</p>
            <p>5. Save the changes</p>
            <p>6. Wait 5-10 minutes for changes to propagate</p>
            <p>7. Clear browser cache and try again</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Test Links:</h2>
          <div className="space-x-4">
            <a href="/env-check" className="text-electric-blue hover:underline">
              Environment Check
            </a>
            <a
              href="/test-postmessage-auth"
              className="text-electric-blue hover:underline"
            >
              Test PostMessage Google Auth
            </a>
            <a
              href="/debug-auth"
              className="text-electric-blue hover:underline"
            >
              Debug Auth Flow
            </a>
            <a
              href="/test-integration"
              className="text-electric-blue hover:underline"
            >
              Test Google + Wallet Integration
            </a>
            <a
              href="/test-google"
              className="text-electric-blue hover:underline"
            >
              Test Google Auth (Redirect)
            </a>
            <a
              href="/test-google-postmessage"
              className="text-electric-blue hover:underline"
            >
              Test Google Auth (PostMessage)
            </a>
            <a
              href="/auth/callback"
              className="text-electric-blue hover:underline"
            >
              Callback Page
            </a>
            <a href="/" className="text-electric-blue hover:underline">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
