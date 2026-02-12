# Smart Bookmark Manager

A modern, real-time bookmark manager built with Next.js 15 (App Router), Supabase, and Tailwind CSS. Features Google OAuth authentication, real-time synchronization across tabs, and a clean, responsive UI.

## Live Demo

**Live URL:** [Your Vercel URL will be here after deployment]

## Features

- **Google OAuth Authentication** - Secure sign-in with Google (no email/password)
- **Private Bookmarks** - Each user's bookmarks are completely private
- **Real-time Sync** - Instantly see changes across multiple tabs/devices
- **CRUD Operations** - Add and delete bookmarks with ease
- **Responsive Design** - Works beautifully on desktop and mobile
- **Dark Mode Support** - Automatic theme based on system preferences
- **Input Validation** - URL validation and error handling

## Tech Stack

- **Framework:** Next.js 15.1.3 (App Router)
- **Authentication & Database:** Supabase
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- A Google Cloud Project with OAuth 2.0 credentials
- A Vercel account for deployment ([vercel.com](https://vercel.com))

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd smart-bookmark-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (2-3 minutes)

#### Set Up Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this repo
3. Paste it into the SQL Editor and click **Run**

This will create:
- `bookmarks` table with proper columns
- Row Level Security (RLS) policies ensuring users only see their own bookmarks
- Indexes for optimal query performance
- Real-time replication enabled

#### Configure Google OAuth

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Google** provider
3. Note the **Callback URL** (e.g., `https://xxxxx.supabase.co/auth/v1/callback`)

#### Set Up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your Vercel domain (for production, e.g., `https://your-app.vercel.app`)
7. Add Authorized redirect URIs:
   - Supabase callback URL from earlier
8. Copy the **Client ID** and **Client Secret**
9. Go back to Supabase → **Authentication** → **Providers** → **Google**
10. Paste the Client ID and Client Secret
11. Save

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from:
- Supabase Dashboard → **Settings** → **API**

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **New Project**
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### Post-Deployment Steps

1. Copy your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Go to Google Cloud Console → Your OAuth Client
3. Add your Vercel URL to **Authorized JavaScript origins**
4. Test the authentication flow

## Testing

### Manual Testing Steps

1. **Authentication:**
   - Visit the deployed URL
   - Click "Sign in with Google"
   - Authorize the application
   - Verify you're redirected to the home page

2. **Add Bookmark:**
   - Fill in the title and URL fields
   - Click "Add Bookmark"
   - Verify the bookmark appears in the list

3. **Real-time Sync:**
   - Open the app in two different browser tabs
   - Add a bookmark in one tab
   - Verify it appears instantly in the other tab

4. **Delete Bookmark:**
   - Hover over a bookmark
   - Click the delete icon
   - Confirm deletion
   - Verify it disappears from all tabs

5. **Privacy:**
   - Sign in with a different Google account
   - Verify you cannot see the first user's bookmarks

## Problems Encountered & Solutions

### Problem 1: Supabase SSR Cookie Management

**Issue:** Initial authentication wasn't persisting across page refreshes. The user would be logged out immediately after authentication.

**Solution:** Implemented proper cookie handling using `@supabase/ssr` package with separate client and server utilities:
- Created `utils/supabase/client.ts` for client-side operations
- Created `utils/supabase/server.ts` for server-side operations with Next.js cookie handling
- Added middleware in `middleware.ts` to refresh the session on every request

**Code Reference:** [utils/supabase/server.ts](utils/supabase/server.ts), [middleware.ts](middleware.ts)

### Problem 2: Real-time Subscriptions Not Working

**Issue:** Bookmarks added in one tab weren't appearing in another tab without manual refresh.

**Solution:** 
1. Enabled Real-time replication on the `bookmarks` table in Supabase:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;
   ```
2. Set up proper real-time channel subscription in `BookmarkList.tsx`:
   - Subscribed to all events (INSERT, UPDATE, DELETE) on the bookmarks table
   - Added a filter to only listen to the current user's bookmarks
   - Properly cleaned up the subscription on component unmount

**Code Reference:** [components/BookmarkList.tsx](components/BookmarkList.tsx)

### Problem 3: OAuth Redirect Loop

**Issue:** After Google authentication, users were stuck in a redirect loop between `/auth/callback` and `/login`.

**Solution:** 
- Fixed the OAuth callback handler to properly exchange the code for a session
- Updated middleware to exclude `/auth/*` routes from authentication checks
- Added proper redirect URL configuration in the Google sign-in button

**Code Reference:** [app/auth/callback/route.ts](app/auth/callback/route.ts)

### Problem 4: Row Level Security Blocking Queries

**Issue:** After setting up RLS, bookmarks weren't loading even for authenticated users.

**Solution:** 
- Created specific RLS policies for SELECT, INSERT, UPDATE, and DELETE operations
- Used `auth.uid()` in policies to ensure users can only access their own data
- Added proper indexes on `user_id` column for performance

**Code Reference:** [supabase-schema.sql](supabase-schema.sql)

### Problem 5: TypeScript Errors with Supabase Types

**Issue:** TypeScript was complaining about missing types for Supabase queries and responses.

**Solution:** 
- Defined explicit TypeScript interfaces for the Bookmark type
- Used proper typing for Supabase query responses
- Added type assertions where necessary for real-time payload data

**Code Reference:** [components/BookmarkList.tsx](components/BookmarkList.tsx), [components/BookmarkItem.tsx](components/BookmarkItem.tsx)

### Problem 6: Environment Variables Not Loading in Vercel

**Issue:** After deploying to Vercel, the app couldn't connect to Supabase.

**Solution:** 
- Ensured all environment variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Added all required environment variables in Vercel dashboard
- Redeployed after adding environment variables (Vercel requires redeployment)

### Problem 7: Dark Mode Flickering

**Issue:** Dark mode colors were flickering on page load due to Tailwind's dark mode detection.

**Solution:** 
- Used `prefers-color-scheme` media query instead of class-based dark mode
- Applied dark mode styles using Tailwind's `dark:` variant
- This provides instant dark mode detection based on system preferences

**Code Reference:** [app/globals.css](app/globals.css)

## Project Structure

```
smart-bookmark-app/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (bookmarks list)
├── components/
│   ├── AddBookmarkForm.tsx       # Form to add new bookmarks
│   ├── BookmarkItem.tsx          # Individual bookmark display
│   ├── BookmarkList.tsx          # Bookmarks list with real-time sync
│   ├── GoogleSignInButton.tsx    # Google OAuth button
│   └── LogoutButton.tsx          # Sign out button
├── utils/
│   └── supabase/
│       ├── client.ts             # Supabase client (browser)
│       ├── server.ts             # Supabase client (server)
│       └── middleware.ts         # Session refresh logic
├── middleware.ts                 # Next.js middleware for auth
├── supabase-schema.sql          # Database schema
├── .env.example                  # Environment variables template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Security Features

- **Row Level Security (RLS):** Database-level security ensures users can only access their own bookmarks
- **Google OAuth:** Secure authentication without storing passwords
- **Environment Variables:** Sensitive data stored securely in environment variables
- **HTTPS Only:** Production app runs on HTTPS via Vercel
- **CSRF Protection:** Built-in protection via Supabase session management

## UI/UX Features

- **Responsive Design:** Mobile-first design that works on all screen sizes
- **Loading States:** Visual feedback during async operations
- **Error Handling:** User-friendly error messages
- **Empty States:** Helpful messages when no bookmarks exist
- **Hover Effects:** Interactive UI elements with smooth transitions
- **Dark Mode:** Automatic dark mode based on system preferences

## API Reference

### Supabase Database Schema

```typescript
interface Bookmark {
  id: string              // UUID (auto-generated)
  user_id: string         // UUID (references auth.users)
  title: string           // Bookmark title
  url: string             // Bookmark URL
  created_at: string      // ISO timestamp
}
```

### Real-time Events

The app listens for the following events on the `bookmarks` table:

- `INSERT`: New bookmark added
- `UPDATE`: Bookmark modified
- `DELETE`: Bookmark removed

## Contributing

This is an assignment project, but feedback and suggestions are welcome!

## License

This project is for educational purposes.

## Author

**Nitin Pandey**

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Deployment
vercel                  # Deploy to preview
vercel --prod           # Deploy to production
```

## Troubleshooting

### "Invalid credentials" error
- Check that your Supabase environment variables are correct
- Verify the URLs don't have trailing slashes

### Google sign-in not working
- Ensure your Google OAuth redirect URIs are correctly configured
- Check Google Cloud Console for any error messages
- Verify your Client ID and Secret in Supabase are correct

### Bookmarks not appearing
- Check browser console for errors
- Verify RLS policies are correctly set up in Supabase
- Ensure Real-time is enabled for the bookmarks table

### Real-time not working
- Go to Supabase Dashboard → Database → Replication
- Ensure `bookmarks` table is enabled for real-time
- Check browser console for subscription errors

---

**Built with Next.js, Supabase, and Tailwind CSS**
