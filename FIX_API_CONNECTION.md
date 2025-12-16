# 🔧 Fix: API Connection Issues on Vercel

## Problem
If you're seeing errors like "Failed to load conversations. Using demo data." or other API failures, it means your frontend can't connect to your backend API.

## Root Cause
The `VITE_API_BASE_URL` environment variable is not set in Vercel, so the app defaults to `/api` which tries to hit the Vercel frontend instead of your backend.

## Quick Fix (Choose One)

### Option 1: Use ngrok (Quick Testing)

1. **Start your backend locally:**
   ```bash
   cd /Applications/XAMPP/xamppfiles/htdocs/UNICON_SAAS
   php -S localhost:8000 router.php
   ```

2. **Expose with ngrok** (in another terminal):
   ```bash
   ngrok http 8000
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

4. **Set in Vercel:**
   - Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
   - Add:
     - **Key:** `VITE_API_BASE_URL`
     - **Value:** `https://abc123.ngrok-free.app/api`
     - **Environment:** Production, Preview, Development (select all)
   - Click **Save**

5. **Redeploy** (Vercel will auto-redeploy when you update env vars)

### Option 2: Deploy Backend Separately

Deploy your PHP backend to:
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Your own server**

Then set `VITE_API_BASE_URL` in Vercel to point to your deployed backend URL.

## Verify It's Working

1. Open browser console (F12)
2. Check the console logs - you should see:
   ```
   API Configuration: { API_BASE_URL: "https://your-backend-url/api", ... }
   ```
3. Try loading conversations/messages - should work without "demo data" errors

## Current Status

- ✅ Frontend deployed on Vercel
- ❌ Backend API not accessible (needs ngrok or separate deployment)
- ❌ `VITE_API_BASE_URL` not set in Vercel

## After Fixing

Once `VITE_API_BASE_URL` is set correctly:
- ✅ API requests will go to your backend
- ✅ Data will load properly
- ✅ No more "Using demo data" errors
