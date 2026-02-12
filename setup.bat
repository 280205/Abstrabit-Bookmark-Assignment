@echo off
REM Smart Bookmark App - Setup Script for Windows
REM This script will guide you through the setup process

echo 🚀 Smart Bookmark App Setup
echo ============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

node --version
echo ✅ Node.js is installed
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Check for .env.local
if not exist .env.local (
    echo ⚠️  .env.local file not found
    echo 📝 Creating .env.local from .env.example...
    copy .env.example .env.local
    echo ✅ Created .env.local
    echo.
    echo ⚠️  IMPORTANT: Edit .env.local and add your Supabase credentials
    echo    1. Go to https://supabase.com and create a project
    echo    2. Go to Settings → API
    echo    3. Copy the URL and anon key to .env.local
    echo.
) else (
    echo ✅ .env.local already exists
    echo.
)

echo 📋 Next Steps:
echo ==============
echo.
echo 1. Set up Supabase:
echo    - Create a project at https://supabase.com
echo    - Run the SQL from supabase-schema.sql in SQL Editor
echo    - Enable Google OAuth in Authentication → Providers
echo.
echo 2. Set up Google OAuth:
echo    - Go to Google Cloud Console
echo    - Create OAuth 2.0 credentials
echo    - Add Supabase callback URL to redirect URIs
echo.
echo 3. Update .env.local with your credentials
echo.
echo 4. Run the development server:
echo    npm run dev
echo.
echo 📖 For detailed instructions, see README.md
echo ⚡ For quick start, see QUICKSTART.md
echo.
echo ✨ Setup script completed!
pause
