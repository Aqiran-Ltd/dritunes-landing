#!/bin/bash

# Fix permissions script for web files
echo "🔧 Fixing file permissions..."

# FTP credentials
FTP_HOST="ftp.dritunesconsult.com"
FTP_USER="u643770900.abytrone"
FTP_PASS="q7?9qHG6fs/t?2nX"
FTP_PATH="/home/u643770900/domains/dritunesconsult.com/public_html"

# Set permissions for directories (755)
echo "📁 Setting directory permissions to 755..."
curl -Q "SITE CHMOD 755 $FTP_PATH" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null 2>&1
curl -Q "SITE CHMOD 755 $FTP_PATH/_next" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null 2>&1
curl -Q "SITE CHMOD 755 $FTP_PATH/_next/static" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null 2>&1
curl -Q "SITE CHMOD 755 $FTP_PATH/_next/static/css" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null 2>&1
curl -Q "SITE CHMOD 755 $FTP_PATH/_next/static/chunks" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null 2>&1
curl -Q "SITE CHMOD 755 $FTP_PATH/_next/static/media" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null 2>&1
curl -Q "SITE CHMOD 755 $FTP_PATH/contact" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null 2>&1
curl -Q "SITE CHMOD 755 $FTP_PATH/logo" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null 2>&1

# Set permissions for files (644)
echo "📄 Setting file permissions to 644..."
curl -Q "SITE CHMOD 644 $FTP_PATH/index.html" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null 2>&1
curl -Q "SITE CHMOD 644 $FTP_PATH/404.html" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null 2>&1
curl -Q "SITE CHMOD 644 $FTP_PATH/favicon.ico" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null 2>&1
curl -Q "SITE CHMOD 644 $FTP_PATH/contact/index.html" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null 2>&1

echo "✅ Permissions fixed!"
echo "🌐 Try accessing your website now: https://dritunesconsult.com/" 