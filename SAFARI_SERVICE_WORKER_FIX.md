# 🍎 Safari Service Worker Fix

## Problem
Safari caches service workers more aggressively than Chrome. If you're seeing API failures in Safari, you need to manually clear the service worker.

## Quick Fix for Safari

### Method 1: Clear Service Worker via Developer Menu

1. **Enable Safari Developer Menu:**
   - Go to **Safari** → **Settings** → **Advanced**
   - Check "Show features for web developers"

2. **Unregister Service Worker:**
   - Open your app in Safari
   - Go to **Develop** → **Service Workers** → **Unregister**

3. **Clear Cache:**
   - Go to **Develop** → **Empty Caches**
   - Or **Safari** → **Settings** → **Privacy** → **Manage Website Data** → Remove your site

4. **Hard Refresh:**
   - Press `Cmd + Option + R` (or `Cmd + Shift + R`)

### Method 2: Clear All Site Data

1. **Safari** → **Settings** → **Privacy**
2. Click **Manage Website Data...**
3. Search for your localhost URL (e.g., `localhost:3000`)
4. Click **Remove** or **Remove All**
5. Restart Safari

### Method 3: Private Browsing (Quick Test)

1. Open a **Private Window** (`Cmd + Shift + N`)
2. Navigate to `http://localhost:3000`
3. This will bypass cached service workers

## Verify It's Fixed

After clearing, check the browser console:
- You should see: "Service Worker unregistered for development"
- API requests should work without "Using demo data" errors

## Prevention

The code now automatically:
- ✅ Unregisters service workers in development mode
- ✅ Only registers service workers in production
- ✅ Skips registration on localhost

But Safari may still have cached the old service worker, so manual clearing is needed the first time.
