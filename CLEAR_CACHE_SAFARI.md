# 🧹 Clear Cache for localhost:3000 in Safari

## Quick Steps

### Method 1: Developer Menu (Recommended)

1. **Enable Developer Menu** (if not already enabled):
   - Safari → Settings → Advanced
   - Check "Show features for web developers"

2. **Clear Service Worker:**
   - Open `http://localhost:3000` in Safari
   - Go to **Develop** → **Service Workers**
   - If you see any service workers, click **Unregister**

3. **Empty Caches:**
   - Go to **Develop** → **Empty Caches**

4. **Hard Refresh:**
   - Press `Cmd + Option + R` (or `Cmd + Shift + R`)

### Method 2: Privacy Settings

1. **Safari** → **Settings** → **Privacy**
2. Click **"Manage Website Data..."**
3. In the search box, type: `localhost`
4. Select all localhost entries (or just `localhost:3000`)
5. Click **"Remove"**
6. Click **"Done"**
7. Restart Safari

### Method 3: Private Window (Quick Test)

1. Open a **Private Window** (`Cmd + Shift + N`)
2. Navigate to `http://localhost:3000`
3. This bypasses all cached data

## Verify Cache is Cleared

After clearing:
1. Open Developer Console: **Develop** → **Show JavaScript Console**
2. You should see: "Service Worker unregistered for development"
3. API requests should work without errors

## If Still Having Issues

1. **Quit Safari completely** (`Cmd + Q`)
2. **Restart Safari**
3. Navigate to `http://localhost:3000`
4. Check console for service worker messages
