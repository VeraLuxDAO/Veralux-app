import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const nextAuthUrl = process.env.NEXTAUTH_URL;

    return NextResponse.json({
      clientId: clientId ? `${clientId.substring(0, 20)}...` : "Not set",
      clientIdExists: !!clientId,
      clientSecretExists: !!clientSecret,
      nextAuthUrl: nextAuthUrl || "Not set",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check environment" },
      { status: 500 }
    );
  }
}
