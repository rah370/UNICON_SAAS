# 📤 How to Share Your UNICON App

## 🎯 Quick Share (5 Minutes)

### Method 1: Using ngrok + Vercel (Easiest)

1. **Start Backend:**

   ```bash
   cd /Applications/XAMPP/xamppfiles/htdocs/UNICON_SAAS
   php -S localhost:8000 router.php
   ```

2. **Expose Backend with ngrok:**

   ```bash
   # In a new terminal
   ngrok http 8000
   ```

   Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

3. **Deploy Frontend:**

   ```bash
   # Install Vercel CLI if needed
   npm install -g vercel

   # Login
   vercel login

   # Deploy
   vercel --prod
   ```

4. **Set API URL in Vercel:**

   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-ngrok-url.ngrok-free.app/api`
   - Redeploy

5. **Share the Vercel URL!** (e.g., `https://unicon-saas.vercel.app`)

---

## 🔐 Demo Accounts to Share

**Student Accounts:**

- `kenshee@unicon.edu` / `password123`
- `rahma@unicon.edu` / `password123`
- `brenn@unicon.edu` / `password123`

**Admin Account:**

- `archievald.ranay@unicon.edu` / `password123`

---

## 📋 What They Can Do

✅ View landing page
✅ Register new schools
✅ Login with demo accounts
✅ Browse all features:

- Posts & Community
- Events & Calendar
- Marketplace
- Messages
- Profile & Settings
- Admin Dashboard (if admin)

---

## ⚠️ Important Notes

1. **Keep Backend Running:** If using ngrok, keep both PHP server and ngrok running
2. **ngrok Free Tier:** Free tier has session limits (2 hours), but good for demos
3. **Database:** Make sure MySQL is running in XAMPP
4. **Environment:** Backend needs `.env` file with database credentials

---

## 🚀 One-Command Deploy

```bash
./quick-deploy.sh
```

This will:

- Install dependencies
- Build frontend
- Deploy to Vercel
- Give you next steps

---

## 🔄 Alternative: Full Deployment

For permanent hosting, deploy backend to:

- **Railway** (https://railway.app) - Easy PHP hosting
- **Render** (https://render.com) - Free tier available
- **Your own server** - VPS or cloud instance

Then update `VITE_API_BASE_URL` in Vercel to point to your backend.

---

## 📱 Share This Message

```
Hey! Check out my UNICON SaaS platform:

🔗 Live Demo: https://your-app.vercel.app

Login Credentials:
- Student: kenshee@unicon.edu / password123
- Admin: archievald.ranay@unicon.edu / password123

Features:
✅ School social platform
✅ Posts, Events, Marketplace
✅ Direct Messaging
✅ Admin Dashboard
✅ Multi-tenant branding

Let me know what you think! 🚀
```

---

## 🛠️ Troubleshooting

**"Can't connect to API"**

- Check ngrok is running
- Verify `VITE_API_BASE_URL` in Vercel
- Test backend URL: `https://your-ngrok-url.ngrok-free.app/api/health`

**"Login not working"**

- Make sure MySQL is running
- Check database has demo users
- Verify backend is accessible

**"Build failed"**

- Run `npm install` locally first
- Check for errors in build logs
- Make sure all dependencies are in `package.json`

---

## ✅ Checklist Before Sharing

- [ ] Backend running (`php -S localhost:8000 router.php`)
- [ ] ngrok tunnel active (if using)
- [ ] MySQL running in XAMPP
- [ ] Frontend deployed to Vercel
- [ ] `VITE_API_BASE_URL` set correctly
- [ ] Tested login with demo account
- [ ] Shared link and credentials

---

**Ready to share! 🎉**
