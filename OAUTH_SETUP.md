# OAuth Setup Guide

## Current Status
✅ **Fixed Issues:**
- Added missing `JWT_SECRET` to backend environment
- Created frontend `.env.local` file with basic configuration
- Updated NextAuth configuration to handle missing OAuth credentials gracefully
- Fixed authentication flow

## To Enable OAuth (Optional)

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

### 2. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Client Secret

### 3. Update Environment Variables

Add these to your `apps/frontend/.env.local`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth
GITHUB_ID=your_github_client_id_here
GITHUB_SECRET=your_github_client_secret_here
```

## Current Configuration

### Backend (apps/backend/.env)
```env
DATABASE_URL=postgresql://postgres:nati1234@localhost:5432/task_mgmt
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=4000
```

### Frontend (apps/frontend/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_SECRET=dev_secret_change_me_in_production
NEXTAUTH_URL=http://localhost:3000
```

## How It Works Now

1. **Without OAuth credentials**: The app will work with email/password authentication only
2. **With OAuth credentials**: OAuth buttons will appear and work properly
3. **Graceful fallback**: If OAuth providers are not configured, the app won't crash

## Testing

1. Start the development servers:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000/login
3. You should see:
   - OAuth buttons (Google/GitHub) - will show error if not configured
   - Email/password form - will work immediately

## Security Notes

- Change `JWT_SECRET` in production
- Change `NEXTAUTH_SECRET` in production
- Use environment-specific OAuth credentials
- Never commit real OAuth credentials to version control
