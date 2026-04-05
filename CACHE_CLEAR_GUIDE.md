# Browser Cache Clear Guide

The password login feature has been deployed but your browser is showing old cached content.

## Quick Fix - Hard Refresh

Try these keyboard shortcuts to force refresh:

### Windows/Linux:
- Chrome/Edge: `Ctrl + Shift + R` or `Ctrl + F5`
- Firefox: `Ctrl + Shift + R` or `Ctrl + F5`

### Mac:
- Chrome/Edge: `Cmd + Shift + R`
- Firefox: `Cmd + Shift + R`
- Safari: `Cmd + Option + R`

## If Hard Refresh Doesn't Work

### Option 1: Clear Browser Cache
1. Open browser settings
2. Go to Privacy/History section
3. Clear browsing data
4. Select "Cached images and files"
5. Clear data for "Last hour" or "All time"
6. Reload the page

### Option 2: Use Incognito/Private Mode
1. Open incognito/private window
2. Go to https://amritkan.in/login
3. You should see the password login option

### Option 3: Try Different Browser
- If using Chrome, try Firefox or Edge
- Fresh browser = no cache

## What You Should See

After clearing cache, the login page should show:
- Phone Number field
- Password field
- "Login" button
- "Login with OTP instead" link at the bottom

## Test Login

Use any existing user credentials:
- Phone: 10-digit number (e.g., 9876543210)
- Password: User's password

## Verify It's Working

1. Enter phone number and password
2. Click "Login" button
3. Should redirect to home page if credentials are correct
4. Should show error message if credentials are wrong

## Still Not Working?

If you still see the old OTP-only login page:
1. Check browser console for errors (F12 → Console tab)
2. Verify the app is running: `ps -p $(cat app.pid)`
3. Check app logs: `tail -f app.log`
4. Restart the app:
   ```bash
   kill $(cat app.pid)
   nohup npm start > app.log 2>&1 &
   echo $! > app.pid
   ```
