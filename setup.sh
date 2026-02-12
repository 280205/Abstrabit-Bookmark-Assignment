#!/bin/bash

# Smart Bookmark App - Setup Script
# This script will guide you through the setup process

echo "🚀 Smart Bookmark App Setup"
echo "============================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local file not found"
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your Supabase credentials"
    echo "   1. Go to https://supabase.com and create a project"
    echo "   2. Go to Settings → API"
    echo "   3. Copy the URL and anon key to .env.local"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Check if Supabase credentials are set
if grep -q "your_supabase_project_url" .env.local; then
    echo "⚠️  Please update your Supabase credentials in .env.local"
    echo ""
else
    echo "✅ Supabase credentials appear to be configured"
    echo ""
fi

echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Set up Supabase:"
echo "   - Create a project at https://supabase.com"
echo "   - Run the SQL from supabase-schema.sql in SQL Editor"
echo "   - Enable Google OAuth in Authentication → Providers"
echo ""
echo "2. Set up Google OAuth:"
echo "   - Go to Google Cloud Console"
echo "   - Create OAuth 2.0 credentials"
echo "   - Add Supabase callback URL to redirect URIs"
echo ""
echo "3. Update .env.local with your credentials"
echo ""
echo "4. Run the development server:"
echo "   npm run dev"
echo ""
echo "📖 For detailed instructions, see README.md"
echo "⚡ For quick start, see QUICKSTART.md"
echo ""
echo "✨ Setup script completed!"
