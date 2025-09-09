import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check environment variables (without exposing secrets)
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
    const nextAuthUrl = process.env.NEXTAUTH_URL;

    return NextResponse.json({
      clientId: clientId ? `${clientId.substring(0, 10)}...` : "Not set",
      hasClientSecret,
      nextAuthUrl,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check environment" },
      { status: 500 }
    );
  }
}
