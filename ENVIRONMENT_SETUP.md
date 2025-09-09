# VeraLux Environment Configuration

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Sui Network Configuration
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Salt Service Configuration (for zkLogin)
NEXT_PUBLIC_SALT_SERVICE_URL=https://salt.api.mystenlabs.com/api/get_salt

# ZK Proving Service Configuration
NEXT_PUBLIC_PROVING_SERVICE_URL=https://prover.mystenlabs.com/v1

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## How to Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)
7. Copy the Client ID and Client Secret to your `.env.local` file

## Sui Network Configuration

- **Testnet**: Use `testnet` for development and testing
- **Mainnet**: Use `mainnet` for production (when ready)
- **Devnet**: Use `devnet` for early development

## Security Notes

- Never commit `.env.local` to version control
- Use different credentials for development and production
- Rotate secrets regularly
- Use environment-specific configurations
