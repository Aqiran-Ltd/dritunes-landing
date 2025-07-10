# DriTunes Landing Page

A modern landing page built with Next.js, React, and Tailwind CSS.

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment to Hostinger cPanel

This project is configured to deploy to Hostinger cPanel using git-ftp.

### Prerequisites

1. **Install git-ftp:**
   ```bash
   # macOS
   brew install git-ftp
   
   # Ubuntu/Debian
   sudo apt-get install git-ftp
   
   # Or download from: https://git-ftp.github.io/
   ```

2. **Get your Hostinger FTP credentials:**
   - Log into your Hostinger cPanel
   - Go to "Files" → "FTP Accounts"
   - Create a new FTP account or use your main account
   - Note down: FTP hostname, username, and password

### Initial Setup

1. **Update the git-ftp configuration:**
   Edit `.git-ftp-config` and replace the placeholder values:
   ```ini
   [ftp]
       url = ftp://your-domain.com
       user = your-ftp-username
       passwd = your-ftp-password
       syncroot = out/
       remote-root = public_html/
   ```

2. **Initial deployment:**
   ```bash
   npm run deploy
   ```

### Ongoing Deployments

After making changes and pushing to GitHub:

```bash
npm run deploy
```

Or manually:
```bash
# Build and export
npm run export

# Sync with server
git-ftp catchup
git-ftp push
```

### Deployment Process

The deployment script will:
1. Build the Next.js project
2. Export it to static files in the `out/` directory
3. Sync the static files to your Hostinger server via FTP
4. Only upload changed files for faster deployments

### File Structure on Server

The static files will be uploaded to your `public_html/` directory on Hostinger, which is the web root for your domain.

### Troubleshooting

- **FTP Connection Issues:** Verify your FTP credentials in `.git-ftp-config`
- **Build Errors:** Check that all dependencies are installed (`npm install`)
- **Export Issues:** Ensure your Next.js config supports static export
- **Permission Issues:** Make sure the deploy script is executable (`chmod +x deploy.sh`)

### Manual Commands

```bash
# Initialize git-ftp (first time only)
git-ftp init

# Catch up with server state
git-ftp catchup

# Push changes
git-ftp push

# Pull changes from server
git-ftp pull
```

## Project Structure

```
dritunes-landing/
├── src/
│   ├── app/           # Next.js app router pages
│   └── components/    # React components
├── public/            # Static assets
├── deploy.sh          # Deployment script
├── .git-ftp-config    # FTP configuration
└── .git-ftp-ignore    # Files to exclude from upload
```

## Technologies Used

- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **TypeScript** - Type safety
