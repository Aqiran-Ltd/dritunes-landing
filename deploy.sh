#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting deployment process..."

# Check if git-ftp is installed
if ! command -v git-ftp &> /dev/null; then
    echo "❌ git-ftp is not installed. Please install it first:"
    echo "   macOS: brew install git-ftp"
    echo "   Ubuntu/Debian: sudo apt-get install git-ftp"
    echo "   Or download from: https://git-ftp.github.io/"
    exit 1
fi

# Build the Next.js project (this now includes static export)
echo "📦 Building Next.js project..."
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
    echo "❌ Build failed. 'out' directory not found."
    exit 1
fi

# Initialize git-ftp if not already done
if [ ! -f ".git-ftp.log" ]; then
    echo "🔧 Initializing git-ftp..."
    git-ftp init
else
    echo "📤 Syncing changes with server..."
    git-ftp catchup
    git-ftp push
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Your site should now be live at your domain" 