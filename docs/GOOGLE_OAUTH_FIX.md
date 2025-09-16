# 🔧 Google OAuth Redirect URI Mismatch Fix

## Problem
You're getting this error when trying to sign in with Google:
```
Error 400: redirect_uri_mismatch
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy.
If you're the app developer, register the redirect URI in the Google Cloud Console.
Request details: redirect_uri=https://nzeuxqodvgdadtsjjvum.supabase.co/auth/v1/callback
```

## Root Cause
The redirect URI `https://nzeuxqodvgdadtsjjvum.supabase.co/auth/v1/callback` is not registered as an authorized redirect URI in your Google Cloud Console OAuth 2.0 client configuration.

## Solution Steps

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one if you haven't)
3. Navigate to **APIs & Services** > **Credentials**

### Step 2: Find Your OAuth 2.0 Client
1. Look for your OAuth 2.0 client ID in the credentials list
2. Click on the client ID name to edit it
3. If you don't have one, click **+ CREATE CREDENTIALS** > **OAuth client ID**

### Step 3: Configure Authorized Redirect URIs
In the OAuth client configuration, add these redirect URIs:

**Production (Required):**
```
https://nzeuxqodvgdadtsjjvum.supabase.co/auth/v1/callback
```

**Development (Optional but recommended):**
```
http://localhost:3000/auth/callback
http://localhost:3004/auth/callback
```

### Step 4: Save Configuration
1. Click **SAVE** at the bottom of the form
2. Wait a few minutes for changes to propagate

### Step 5: Verify Your Environment Variables
Ensure your `.env.local` file has the correct values:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret
GOOGLE_OAUTH_CALLBACK_URL=https://nzeuxqodvgdadtsjjvum.supabase.co/auth/v1/callback

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nzeuxqodvgdadtsjjvum.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 6: Configure Supabase Authentication
1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to **Authentication** > **Providers**
3. Enable **Google** provider
4. Enter your Google Client ID and Client Secret
5. The redirect URL should automatically be set to your Supabase callback URL

### Step 7: Test the Configuration
1. Restart your development server: `npm run dev`
2. Go to your authentication page
3. Click "Sign in with Google"
4. You should now be redirected to Google's OAuth flow without errors

## Troubleshooting

### Still Getting redirect_uri_mismatch?
- **Check spelling**: Ensure the redirect URI in Google Cloud Console exactly matches the one in the error message
- **Wait for propagation**: Google Cloud changes can take 5-10 minutes to take effect
- **Clear browser cache**: Clear your browser cache and cookies
- **Check project**: Ensure you're configuring the correct Google Cloud project

### Invalid Client Error?
- Verify your `GOOGLE_CLIENT_ID` matches the one in Google Cloud Console
- Ensure your `GOOGLE_CLIENT_SECRET` is correct and hasn't been regenerated

### Supabase Configuration Issues?
- Verify your Supabase project URL is correct
- Check that Google OAuth is enabled in Supabase Dashboard
- Ensure your Supabase keys are valid and not expired

## Quick Verification Script
Run this command to verify your configuration:

```bash
node scripts/setup-google-oauth.js
```

This script will check:
- ✅ Environment variables are properly set
- ✅ Google Client ID and Secret format is valid
- ✅ Supabase connection is working
- ✅ Authentication files are in place

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)

---

**Note**: After making these changes, the Google OAuth authentication should work properly. If you continue to experience issues, please check the browser console for additional error messages and verify all configuration steps have been completed correctly.