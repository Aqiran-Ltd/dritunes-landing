#!/bin/bash

# Manual upload script for when git-ftp has issues
echo "🚀 Manual upload starting..."

# FTP credentials
FTP_HOST="ftp.dritunesconsult.com"
FTP_USER="u643770900.abytrone"
FTP_PASS="q7?9qHG6fs/t?2nX"
FTP_PATH=""

# Check if out directory exists
if [ ! -d "out" ]; then
    echo "❌ 'out' directory not found. Run 'npm run build' first."
    exit 1
fi

# Upload all files from out directory
echo "📤 Uploading files to server..."
cd out

# First, create all directories
echo "📁 Creating directories..."
find . -type d | while read dir; do
    if [ "$dir" != "." ]; then
        echo "Creating directory: $dir"
        curl -Q "MKD $FTP_PATH/$dir" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null 2>&1
    fi
done

# Then upload all files recursively
echo "📄 Uploading files..."
find . -type f | while read file; do
    echo "Uploading: $file"
    curl -T "$file" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_PATH/$file"
done

echo "✅ Manual upload completed!"
echo "🌐 Check your website at your domain" 