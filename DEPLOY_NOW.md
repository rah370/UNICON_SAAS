# 🚀 Quick Deployment Guide - Share Your App

## Option 1: Quick Demo (Recommended for Testing)

### Step 1: Start Your Backend Locally

```bash
# Terminal 1: Start PHP backend
cd /Applications/XAMPP/xamppfiles/htdocs/UNICON_SAAS
php -S localhost:8000 router.php
```

### Step 2: Expose Backend with ngrok

```bash
# Terminal 2: Install ngrok if needed
# Download from: https://ngrok.com/download
# Or: brew install ngrok

# Start ngrok tunnel
ngrok http 8000
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

### Step 3: Deploy Frontend to Vercel

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd /Applications/XAMPP/xamppfiles/htdocs/UNICON_SAAS
vercel --prod
```

### Step 4: Set Environment Variable in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://your-ngrok-url.ngrok-free.app/api`
   - **Environment:** Production, Preview, Development (select all)
3. **Redeploy** (or wait for auto-redeploy)

### Step 5: Share the Link!

Vercel will give you a URL like:

```
https://unicon-saas.vercel.app
```

**Share this with your friend!**

---

## Option 2: Full Deployment (Backend + Frontend)

### Deploy Backend to Railway/Render

1. **Railway** (Recommended):

   - Go to https://railway.app
   - New Project → Deploy from GitHub
   - Select your repo
   - Add environment variables from `.env`
   - Railway will give you a URL like `https://your-app.railway.app`

2. **Render** (Alternative):
   - Go to https://render.com
   - New Web Service
   - Connect GitHub repo
   - Build: `php -S 0.0.0.0:8000 router.php`
   - Add environment variables

### Update Frontend API URL

In Vercel Dashboard → Environment Variables:

- **Key:** `VITE_API_BASE_URL`
- **Value:** `https://your-backend-url.railway.app/api`

---

## 🔐 Demo Login Credentials

Share these with your friend:

**Students:**

- Email: `kenshee@unicon.edu` / Password: `password123`
- Email: `rahma@unicon.edu` / Password: `password123`
- Email: `brenn@unicon.edu` / Password: `password123`

**Admin:**

- Email: `archievald.ranay@unicon.edu` / Password: `password123`

---

## ⚡ Quick Deploy Script

Run this to deploy everything:

```bash
./quick-deploy.sh
```

---

## 🛠️ Troubleshooting

### Frontend not connecting to backend?

- Check `VITE_API_BASE_URL` is set correctly in Vercel
- Make sure ngrok is running (if using Option 1)
- Test backend URL directly in browser: `https://your-ngrok-url.ngrok-free.app/api/health`

### Build fails?

- Run `npm install` locally first
- Check for TypeScript/ESLint errors
- Check Vercel build logs

### CORS errors?

- Backend already has CORS headers configured
- Make sure backend URL is correct

---

## 📱 What Your Friend Will See

1. **Landing Page** - Marketing site with features
2. **Registration** - Can sign up new schools
3. **Login** - Use demo credentials above
4. **Dashboard** - Full app functionality
5. **All Features** - Posts, Events, Marketplace, Messages, etc.

---

## 🔄 Keep Backend Running

**Important:** If using ngrok (Option 1), keep both running:

- Terminal 1: PHP server (`php -S localhost:8000 router.php`)
- Terminal 2: ngrok (`ngrok http 8000`)

If you close these, the backend won't be accessible!

---

## ✅ Deployment Checklist

- [ ] Backend running locally (or deployed)
- [ ] ngrok tunnel active (if using Option 1)
- [ ] Frontend deployed to Vercel
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] Test login with demo credentials
- [ ] Share link with friend!

---

**Need help?** Check the full deployment docs in `VERCEL_DEPLOY.md`
