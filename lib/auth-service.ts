"use client";

import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { generateNonce, generateRandomness } from "@mysten/sui/zklogin";
import { jwtToAddress } from "@mysten/sui/zklogin";

export interface AuthUser {
  address: string;
  email: string;
  name: string;
  picture?: string;
  provider: "google";
  jwt: string;
  ephemeralKeyPair: Ed25519Keypair;
  maxEpoch: number;
  jwtRandomness: string;
  userSalt: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  private listeners: ((state: AuthState) => void)[] = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.authState));
  }

  private setState(updates: Partial<AuthState>): void {
    this.authState = { ...this.authState, ...updates };
    this.notifyListeners();
  }

  getState(): AuthState {
    return this.authState;
  }

  async initializeGoogleAuth(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      // Check if Google Client ID is available
      if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        throw new Error("Google Client ID not configured");
      }

      // Load Google OAuth script
      await this.loadGoogleScript();

      // Initialize Google Auth with postMessage
      const client = google.accounts.oauth2.initCodeClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        ux_mode: "popup",
        callback: this.handleGoogleCallback.bind(this),
      });

      // Store client for later use
      (window as any).googleAuthClient = client;

      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to initialize Google Auth",
      });
    }
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Window is not defined"));
        return;
      }

      // Clear any existing Google script
      const existingScript = document.querySelector(
        'script[src*="accounts.google.com"]'
      );
      if (existingScript) {
        existingScript.remove();
      }

      // Clear Google object
      if ((window as any).google) {
        delete (window as any).google;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setTimeout(() => resolve(), 100);
      };
      script.onerror = () => reject(new Error("Failed to load Google script"));

      document.head.appendChild(script);
    });
  }

  async signInWithGoogle(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      // Check if Google is available
      if (typeof window === "undefined" || !(window as any).google) {
        throw new Error("Google Auth not available. Please refresh the page.");
      }

      const client = (window as any).googleAuthClient;
      if (!client) {
        // Initialize client if not available
        await this.initializeGoogleAuth();
        const newClient = (window as any).googleAuthClient;
        if (!newClient) {
          throw new Error("Failed to initialize Google Auth client");
        }
        newClient.requestCode();
      } else {
        // Request authorization code
        client.requestCode();
      }
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to sign in with Google",
      });
    }
  }

  private async handleGoogleCallback(response: any): Promise<void> {
    try {
      console.log("=== Google OAuth Callback Started ===");
      console.log("Google callback received:", response);
      this.setState({ isLoading: true, error: null });

      if (response.error) {
        throw new Error(`Google OAuth error: ${response.error}`);
      }

      if (!response.code) {
        throw new Error("No authorization code received from Google");
      }

      console.log("Authorization code received, exchanging for JWT...");
      // Exchange code for JWT
      const jwt = await this.exchangeCodeForJWT(response.code);

      console.log("JWT received, decoding user information...");
      // Get user info from JWT
      const userInfo = this.decodeJWT(jwt);

      console.log("=== User Information Retrieved ===");
      console.log("Email:", userInfo.email);
      console.log("Name:", userInfo.name);
      console.log("Picture:", userInfo.picture);
      console.log("Subject ID:", userInfo.sub);
      console.log("Full user info:", userInfo);

      // Validate that we have essential user data
      if (!userInfo.email) {
        throw new Error("No email found in user information");
      }
      if (!userInfo.name) {
        throw new Error("No name found in user information");
      }

      console.log("User data validation passed, completing authentication...");
      // Complete authentication
      await this.completeAuthentication(jwt, userInfo);
    } catch (error) {
      console.error("=== Google Callback Error ===");
      console.error("Error type:", error?.constructor?.name);
      console.error("Error message:", (error as any)?.message);
      console.error("Full error:", error);
      this.setState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      });
    }
  }

  private async exchangeCodeForJWT(code: string): Promise<string> {
    try {
      console.log("Exchanging code for JWT...");

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          redirectUri: "postmessage",
        }),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        throw new Error(`API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log("JWT exchange successful");
      return data.jwt;
    } catch (error) {
      console.error("JWT exchange failed:", error);
      throw error;
    }
  }

  private async getUserSalt(jwt: string): Promise<string> {
    try {
      // Generate a proper salt that can be converted to BigInt
      // Using a random number that can be converted to BigInt
      const randomNumber = Math.floor(Math.random() * 1000000000000000);
      const salt = randomNumber.toString();
      console.log("Generated salt:", salt);
      return salt;
    } catch (error) {
      console.error("Salt service error:", error);
      // Fallback to a simple numeric salt
      const fallbackSalt = Math.floor(Math.random() * 1000000).toString();
      console.log("Using fallback salt:", fallbackSalt);
      return fallbackSalt;
    }
  }

  private decodeJWT(jwt: string): any {
    const parts = jwt.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const base64Url = parts[1]!;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  async completeAuthentication(jwt: string, userInfo: any): Promise<void> {
    try {
      console.log("=== Starting Authentication Completion ===");
      this.setState({ isLoading: true, error: null });

      console.log("Generating ephemeral key pair...");
      // Generate ephemeral key pair
      const ephemeralKeyPair = new Ed25519Keypair();
      const ephemeralPublicKey = ephemeralKeyPair.getPublicKey();

      console.log("Generating nonce and randomness...");
      // Generate nonce and randomness
      const maxEpoch = 0;
      const jwtRandomness = generateRandomness();
      const nonce = generateNonce(ephemeralPublicKey, maxEpoch, jwtRandomness);

      console.log("Getting user salt...");
      // Get user salt from salt service
      const userSalt = await this.getUserSalt(jwt);

      console.log("Generating zkLogin address...");
      // Generate zkLogin address
      const address = jwtToAddress(jwt, userSalt);
      console.log("Generated zkLogin address:", address);

      const authUser: AuthUser = {
        address,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        provider: "google",
        jwt,
        ephemeralKeyPair,
        maxEpoch,
        jwtRandomness,
        userSalt,
      };

      console.log("=== Final User Data ===");
      console.log("Address:", authUser.address);
      console.log("Email:", authUser.email);
      console.log("Name:", authUser.name);
      console.log("Picture:", authUser.picture);
      console.log("Provider:", authUser.provider);

      console.log("Storing user data in localStorage...");
      // Store in localStorage for persistence
      localStorage.setItem("veralux_auth_user", JSON.stringify(authUser));

      console.log("Storing Google OAuth data in sessionStorage...");
      // Store Google OAuth token in session storage for wallet connection
      const googleAuthData = {
        jwt,
        userInfo,
        timestamp: Date.now(),
        address,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };
      sessionStorage.setItem(
        "veralux_google_auth",
        JSON.stringify(googleAuthData)
      );

      console.log("Updating auth state...");
      this.setState({
        user: authUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log("Triggering wallet connection...");
      // Trigger wallet connection flow
      this.triggerWalletConnection();

      console.log("=== Authentication Completed Successfully ===");
    } catch (error) {
      console.error("=== Authentication Completion Error ===");
      console.error("Error type:", error?.constructor?.name);
      console.error("Error message:", (error as any)?.message);
      console.error("Full error:", error);
      this.setState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      });
    }
  }

  private triggerWalletConnection(): void {
    // Dispatch custom event to trigger wallet connection modal
    const event = new CustomEvent("veralux:triggerWalletConnection", {
      detail: {
        source: "google_oauth",
        timestamp: Date.now(),
      },
    });
    window.dispatchEvent(event);
  }

  async signOut(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      // Clear localStorage
      localStorage.removeItem("veralux_auth_user");
      sessionStorage.removeItem("veralux_google_auth");
      sessionStorage.removeItem("veralux_redirected_after_login");

      // Clear state
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to sign out",
      });
    }
  }

  async loadStoredUser(): Promise<void> {
    try {
      if (typeof window === "undefined") return;

      const storedUser = localStorage.getItem("veralux_auth_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);

        // Verify JWT is still valid (basic check)
        const decoded = this.decodeJWT(user.jwt);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp && decoded.exp > now) {
          this.setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // JWT expired, clear storage
          localStorage.removeItem("veralux_auth_user");
          sessionStorage.removeItem("veralux_google_auth");
        }
      }
    } catch (error) {
      console.error("Failed to load stored user:", error);
      localStorage.removeItem("veralux_auth_user");
      sessionStorage.removeItem("veralux_google_auth");
    }
  }
}

export const authService = AuthService.getInstance();
