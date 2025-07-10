#!/bin/bash

# Manual upload script for when git-ftp has issues
echo "🚀 Manual upload starting..."

# FTP credentials
FTP_HOST="82.29.189.235"
FTP_USER="u643770900"
FTP_PASS="l~1Q>ei&0G>@9A4r"
FTP_PATH="public_html"

# Check if out directory exists
if [ ! -d "out" ]; then
    echo "❌ 'out' directory not found. Run 'npm run build' first."
    exit 1
fi

# Upload all files from out directory
echo "📤 Uploading files to server..."
cd out

# Upload all files recursively
find . -type f -exec curl -T {} -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_PATH/{}" \;

echo "✅ Manual upload completed!"
echo "🌐 Check your website at your domain" 