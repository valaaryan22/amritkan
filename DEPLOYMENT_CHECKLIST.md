# Customer Web App - Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. Backend Configuration (Laravel)

Backend already running at: `https://food.amritkan.com/api`

**CORS Configuration Check:**
```bash
# Check if CORS is configured in Laravel backend
# File: packages/laravel-backend/config/cors.php
```

Make sure CORS allows your web app domain:
```php
'allowed_origins' => [
    'https://your-web-app-domain.com',
    'http://localhost:3000', // for local testing
],
```

### 2. Razorpay Keys

**Get your LIVE Razorpay keys:**
1. Login to https://dashboard.razorpay.com
2. Go to Settings → API Keys
3. Generate LIVE keys (not TEST keys)
4. Copy `Key ID` (starts with `rzp_live_`)

**Update in `.env.production`:**
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_actual_key
```

### 3. Environment Variables

File: `.env.production` (already created)
```bash
NEXT_PUBLIC_API_URL=https://food.amritkan.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
NODE_ENV=production
```

## 🚀 Deployment Steps

### Step 1: Build Locally

```bash
cd packages/customer-web-app

# Install dependencies
npm install

# Build the application
npm run build
```

This will create `.next/` folder with optimized production build.

### Step 2: Prepare Files for Upload

Create a folder with these files:
```
customer-web-app/
├── .next/              (build output - REQUIRED)
├── public/             (static assets - REQUIRED)
├── node_modules/       (dependencies - can install on server)
├── package.json        (REQUIRED)
├── package-lock.json   (REQUIRED)
├── server.js           (REQUIRED - custom server)
├── next.config.js      (REQUIRED)
├── .env.production     (REQUIRED - with your keys)
└── middleware.ts       (REQUIRED - auth middleware)
```

**Option A: Upload with node_modules (Faster)**
- Zip everything including node_modules
- Upload to Hostinger
- Extract

**Option B: Install on server (Smaller upload)**
- Zip without node_modules
- Upload to Hostinger
- Run `npm install --production` on server

### Step 3: Upload to Hostinger

1. **Login to cPanel**
2. **Go to File Manager**
3. **Navigate to your directory:**
   - For main domain: `public_html/`
   - For subdomain: `public_html/subdomain-name/`
4. **Upload zip file**
5. **Extract the zip**
6. **Delete zip file after extraction**

### Step 4: Setup Node.js App in cPanel

1. **Find "Setup Node.js App"** in cPanel
2. **Click "Create Application"**
3. **Configure:**
   ```
   Node.js version: 18.x or latest
   Application mode: Production
   Application root: customer-web-app (or your folder name)
   Application URL: your-domain.com or subdomain.your-domain.com
   Application startup file: server.js
   ```
4. **Click "Create"**

### Step 5: Install Dependencies (if not uploaded)

In cPanel Node.js App interface:
- Click **"Run NPM Install"**

Or via SSH:
```bash
cd ~/public_html/customer-web-app
npm install --production
```

### Step 6: Set Environment Variables

In cPanel Node.js App interface, add:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://food.amritkan.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
PORT=3000
```

### Step 7: Start the Application

- Click **"Start App"** button in cPanel
- Wait for status to show "Running"

### Step 8: Configure Domain/Subdomain

If using subdomain:
1. Go to **"Subdomains"** in cPanel
2. Create subdomain (e.g., `shop.yourdomain.com`)
3. Point document root to your app folder

## 🧪 Testing After Deployment

### 1. Basic Access Test
```
Visit: https://your-domain.com
Expected: Home page loads with products
```

### 2. API Connection Test
```
Open browser console (F12)
Check Network tab for API calls to: https://food.amritkan.com/api
Expected: No CORS errors, API responses successful
```

### 3. Feature Tests
- [ ] Home page loads with products
- [ ] Search works
- [ ] Category filter works
- [ ] Product detail page opens
- [ ] Add to cart works
- [ ] Cart page shows items
- [ ] Login with OTP works
- [ ] Checkout flow works
- [ ] Razorpay payment opens
- [ ] Order placement works
- [ ] Subscription creation works
- [ ] Wallet page loads
- [ ] Profile page works

### 4. Mobile Responsive Test
- [ ] Test on mobile browser
- [ ] Test on tablet
- [ ] Check touch interactions

## 🔧 Troubleshooting

### App Not Starting

**Check logs:**
- cPanel → Node.js App → View logs
- Look for error messages

**Common issues:**
```bash
# Port already in use
Solution: Change PORT in environment variables

# Module not found
Solution: Run npm install again

# Permission errors
Solution: Check file permissions (755 for folders, 644 for files)
```

### CORS Errors

**If you see CORS errors in browser console:**

1. **Update Laravel backend CORS config:**
   ```php
   // config/cors.php
   'allowed_origins' => [
       'https://your-web-app-domain.com',
   ],
   ```

2. **Restart Laravel backend**

### Razorpay Not Working

**Check:**
- [ ] Using LIVE keys (not TEST keys)
- [ ] Key ID is correct in .env.production
- [ ] Razorpay account is activated
- [ ] Domain is added in Razorpay dashboard

### Images Not Loading

**Check:**
- [ ] Backend image URLs are accessible
- [ ] CORS allows image loading
- [ ] Image paths are correct

## 📊 Monitoring

### Check Application Status
- cPanel → Node.js App → Check status
- Should show "Running"

### View Logs
- cPanel → Node.js App → View logs
- Check for errors or warnings

### Monitor Performance
- Use browser DevTools → Network tab
- Check page load times
- Monitor API response times

## 🔄 Updates & Maintenance

### To Update the Application:

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload new `.next/` folder** to server

3. **Restart app:**
   - cPanel → Node.js App → Restart

Or via SSH:
```bash
cd ~/public_html/customer-web-app
npm run build
# Restart via cPanel or PM2
```

### Backup Before Updates
- Backup `.next/` folder
- Backup `.env.production`
- Backup database (if any)

## 🆘 Support

### Hostinger Support
- Live chat: Available 24/7
- Email: support@hostinger.com
- Knowledge base: https://support.hostinger.com

### Common Questions

**Q: Can I use shared hosting?**
A: Yes, if it has Node.js support. Otherwise, upgrade to VPS.

**Q: What if Node.js is not available?**
A: Use static export (see HOSTINGER_DEPLOYMENT.md Method 3)

**Q: How much memory does it need?**
A: Minimum 512MB RAM, recommended 1GB+

**Q: Can I use PM2?**
A: Yes, if you have SSH access (see HOSTINGER_DEPLOYMENT.md Method 2)

## ✅ Final Checklist

Before going live:
- [ ] Production build successful
- [ ] All files uploaded
- [ ] Node.js app created in cPanel
- [ ] Environment variables set
- [ ] App started and running
- [ ] Domain/subdomain configured
- [ ] SSL certificate installed (HTTPS)
- [ ] All features tested
- [ ] Mobile responsive checked
- [ ] CORS configured on backend
- [ ] Razorpay LIVE keys configured
- [ ] Error monitoring setup
- [ ] Backup created

## 🎉 Go Live!

Once all checks pass, your customer web app is live at:
```
https://your-domain.com
```

Share the link with your customers and start taking orders! 🚀
