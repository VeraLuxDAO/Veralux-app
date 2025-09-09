import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

export async function POST(request: NextRequest) {
  try {
    console.log("=== Google OAuth API Route Started ===");

    const { code, redirectUri } = await request.json();
    console.log("Received code:", code ? "Present" : "Missing");
    console.log("Received redirectUri:", redirectUri);

    if (!code) {
      console.error("No authorization code provided");
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    // Check environment variables
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    console.log("Client ID exists:", !!clientId);
    console.log(
      "Client ID:",
      clientId ? `${clientId.substring(0, 20)}...` : "Not set"
    );
    console.log("Client Secret exists:", !!clientSecret);

    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID not set");
      return NextResponse.json(
        { error: "Google Client ID not configured" },
        { status: 500 }
      );
    }

    if (!clientSecret) {
      console.error("GOOGLE_CLIENT_SECRET not set");
      return NextResponse.json(
        { error: "Google Client Secret not configured" },
        { status: 500 }
      );
    }

    // Use 'postmessage' for PostMessage OAuth flow
    const redirectUriToUse = redirectUri || "postmessage";

    console.log("Using redirect URI:", redirectUriToUse);

    // Create OAuth2Client - don't pass redirect_uri in constructor for PostMessage flow
    const client = new OAuth2Client(clientId, clientSecret);

    console.log("Attempting to exchange code for tokens...");
    // Exchange authorization code for tokens - pass redirect_uri as option
    const { tokens } = await client.getToken({
      code: code,
      redirect_uri: redirectUriToUse,
    });

    console.log("Token exchange successful:", !!tokens.id_token);

    if (!tokens.id_token) {
      console.error("No ID token received from Google");
      return NextResponse.json(
        { error: "Failed to get ID token" },
        { status: 400 }
      );
    }

    console.log("Verifying ID token...");
    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      console.error("Invalid token payload");
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 400 }
      );
    }

    console.log("Token verification successful for user:", payload.email);

    return NextResponse.json({
      jwt: tokens.id_token,
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        sub: payload.sub,
      },
    });
  } catch (error: any) {
    console.error("=== Google OAuth API Error ===");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error?.message);
    console.error("Full error:", error);

    // Try to extract specific Google API error details
    let errorMessage = "Authentication failed";
    let errorDetails = "";

    if (error?.response?.data) {
      console.error("Google API response data:", error.response.data);
      errorDetails = JSON.stringify(error.response.data);

      if (error.response.data.error_description) {
        errorMessage = error.response.data.error_description;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    console.error("Final error message:", errorMessage);
    console.error("Error details:", errorDetails);

    return NextResponse.json(
      {
        error: `Authentication failed: ${errorMessage}`,
        details: errorDetails,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
