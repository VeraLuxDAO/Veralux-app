# 🔧 Google OAuth Setup Guide

## **Step 1: Create .env.local File**

Create a `.env.local` file in your project root with these variables:

```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=338707696343-7fig90qa3lfa523sur0rstdfqhraf31b.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# Sui Network Configuration
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
```

## **Step 2: Google Cloud Console Configuration**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)**

2. **Select your OAuth 2.0 Client ID** (the one with ID: `338707696343-7fig90qa3lfa523sur0rstdfqhraf31b`)

3. **Add Authorized JavaScript origins:**

   ```
   http://localhost:3000
   ```

4. **Add Authorized redirect URIs:**

   ```
   http://localhost:3000/auth/callback
   ```

5. **Save the changes**

6. **Wait 5-10 minutes** for changes to propagate

## **Step 3: Test the Setup**

1. **Start your development server:**

   ```bash
   npm run dev
   ```

2. **Go to:** `http://localhost:3000/debug`

   - Check that your Client ID is displayed correctly
   - Verify the redirect URI matches

3. **Test Google Auth:** `http://localhost:3000/test-google`
   - Click "Test Google Auth"
   - Should work without redirect_uri_mismatch error

## **Step 4: Troubleshooting**

### **If you still get "redirect_uri_mismatch":**

1. **Double-check Google Cloud Console:**

   - Make sure the redirect URI is EXACTLY: `http://localhost:3000/auth/callback`
   - Make sure JavaScript origin is EXACTLY: `http://localhost:3000`

2. **Clear browser cache:**

   - Hard refresh (Ctrl+F5)
   - Clear cookies for localhost

3. **Check environment variables:**

   - Make sure `.env.local` exists
   - Restart your development server after creating `.env.local`

4. **Verify Client ID:**
   - The Client ID in your `.env.local` must match the one in Google Cloud Console

## **Step 5: Production Setup**

For production, update your Google Cloud Console with:

- **Authorized JavaScript origins:** `https://yourdomain.com`
- **Authorized redirect URIs:** `https://yourdomain.com/auth/callback`

And update your `.env.local`:

```bash
NEXTAUTH_URL=https://yourdomain.com
```
