# Hostinger cPanel Deployment Guide

## Prerequisites
- Hostinger hosting with Node.js support
- cPanel access
- SSH access (optional but recommended)
- Domain/subdomain configured

## Method 1: Using cPanel Node.js App Manager (Recommended)

### Step 1: Prepare Your Files

1. **Build the application locally:**
   ```bash
   cd packages/customer-web-app
   npm install
   npm run build
   ```

2. **Create a zip file with these files/folders:**
   - `.next/` (build output)
   - `node_modules/` (or install on server)
   - `public/`
   - `package.json`
   - `package-lock.json`
   - `server.js`
   - `next.config.js`
   - `.env.production` (create this with production values)

### Step 2: Upload to Hostinger

1. Login to cPanel
2. Go to **File Manager**
3. Navigate to your domain's directory (e.g., `public_html/customer-app`)
4. Upload and extract the zip file
5. Delete the zip file after extraction

### Step 3: Setup Node.js Application

1. In cPanel, find **"Setup Node.js App"**
2. Click **"Create Application"**
3. Configure:
   - **Node.js version:** 18.x or latest
   - **Application mode:** Production
   - **Application root:** Path to your app (e.g., `customer-app`)
   - **Application URL:** Your domain/subdomain
   - **Application startup file:** `server.js`
   - **Passenger log file:** Leave default

4. Click **"Create"**

### Step 4: Install Dependencies

1. In the Node.js App interface, click **"Run NPM Install"**
2. Or use SSH:
   ```bash
   cd ~/public_html/customer-app
   npm install --production
   ```

### Step 5: Environment Variables

1. In cPanel Node.js App, add environment variables:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
   NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
   PORT=3000
   ```

2. Or create `.env.production` file:
   ```bash
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
   NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_xxxxx
   ```

### Step 6: Start the Application

1. Click **"Start App"** in cPanel Node.js interface
2. Or via SSH:
   ```bash
   cd ~/public_html/customer-app
   npm start
   ```

### Step 7: Configure Domain

1. In cPanel, go to **"Domains"** or **"Subdomains"**
2. Point your domain/subdomain to the Node.js app
3. The app should be accessible at your domain

## Method 2: Using SSH (Advanced)

### Step 1: Connect via SSH

```bash
ssh username@your-server-ip
```

### Step 2: Clone or Upload Your Code

```bash
cd ~/public_html
mkdir customer-app
cd customer-app
# Upload your files via FTP or git clone
```

### Step 3: Install Dependencies

```bash
npm install --production
```

### Step 4: Build the Application

```bash
npm run build
```

### Step 5: Setup PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start the app
pm2 start server.js --name customer-web-app

# Save PM2 configuration
pm2 save

# Setup PM2 to start on reboot
pm2 startup
```

### Step 6: Configure Reverse Proxy

Create `.htaccess` in your domain root:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

## Troubleshooting

### App Not Starting

1. Check Node.js version:
   ```bash
   node --version
   ```

2. Check logs in cPanel Node.js App interface

3. Verify all dependencies installed:
   ```bash
   npm list
   ```

### Port Already in Use

Change port in environment variables or server.js

### Memory Issues

Hostinger shared hosting has memory limits. Consider:
- Upgrading to VPS
- Optimizing build size
- Using static export (see Method 3)

## Method 3: Static Export (Fallback)

If Node.js hosting doesn't work, export as static site:

### Step 1: Modify next.config.js

Add to `next.config.js`:
```javascript
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // ... rest of config
}
```

### Step 2: Build Static Site

```bash
npm run build
```

This creates an `out/` folder with static files.

### Step 3: Upload to cPanel

1. Upload contents of `out/` folder to `public_html/`
2. Configure `.htaccess` for client-side routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Note:** Static export has limitations:
- No server-side rendering
- No API routes
- No dynamic routing with getServerSideProps
- All API calls must go to external backend

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Backend API accessible from web app
- [ ] CORS configured on backend
- [ ] SSL certificate installed (HTTPS)
- [ ] Domain/subdomain pointing correctly
- [ ] Test all features (login, cart, checkout, etc.)
- [ ] Check browser console for errors
- [ ] Verify Razorpay integration works
- [ ] Test on mobile devices

## Monitoring

1. Check application logs in cPanel
2. Monitor memory and CPU usage
3. Setup uptime monitoring (UptimeRobot, etc.)

## Updates

To update the application:

1. Build locally: `npm run build`
2. Upload new `.next/` folder
3. Restart app in cPanel Node.js interface
4. Or via SSH: `pm2 restart customer-web-app`

## Support

If you face issues:
1. Check Hostinger documentation
2. Contact Hostinger support for Node.js hosting help
3. Check Next.js deployment documentation
