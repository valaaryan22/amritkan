# Local Testing Guide

## Setup Complete ✅

Your local development environment is now configured and running!

## What's Working

1. **App is running** at http://localhost:3000
2. **Login page** - You can login with phone + password
3. **Home page** - Products are loading from backend
4. **No XAMPP needed** - Frontend connects to production backend API

## Current Issues to Check

### 1. Banners Not Showing
**What to check in browser console:**
- Look for `[API] GET /banners` log
- Check if it returns 404 or 500 error
- If error, backend might not have banners endpoint or no banners configured

**How to test:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Refresh home page
4. Look for banner-related API calls

### 2. Orders Page
**What happens:**
- Clicking "Orders" might show "Unable to Load Orders" error
- This is expected if:
  - You have no orders yet
  - Backend orders endpoint requires authentication
  - Token is not valid

**How to test:**
1. Click on "Orders" in navigation
2. If you see error, it's normal - you won't be logged out anymore
3. Try clicking "Try Again" button

## Testing Checklist

- [ ] Login with phone + password works
- [ ] Home page loads and shows products
- [ ] Can search products
- [ ] Can filter by category
- [ ] Banners show (or check console for error)
- [ ] Orders page shows error gracefully (doesn't logout)
- [ ] Can click on products
- [ ] Can add to cart
- [ ] Can view cart
- [ ] Can proceed to checkout

## Browser Console Logs

You should see logs like:
```
[API] Base URL: https://food.amritkan.com/api
[API] GET /products
[API] Response 200 from /products
[API] GET /banners
[API] Response 200 from /banners (or error)
```

## Common Issues

### Issue: "Cannot connect to server"
**Solution**: Check your internet connection - app needs to connect to production backend

### Issue: Products not loading
**Solution**: 
1. Check browser console for API errors
2. Verify backend is running at https://food.amritkan.com/api
3. Try refreshing the page

### Issue: Login doesn't work
**Solution**:
1. Check if you're using correct phone number format
2. Verify password is correct
3. Check browser console for API errors

## Next Steps

Once local testing is complete:
1. Build the app: `npm run build`
2. Upload to production server
3. Restart server process
4. Test on production: https://amritkan.in

## Need Help?

Check these files for more info:
- `DEPLOYMENT_STATUS.md` - Current deployment status
- `.env.local` - Local environment variables
- `lib/api.ts` - API configuration and error handling
