# 🚀 Deploy UNICON to Vercel

## Quick Start

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```
This will open your browser to authenticate.

### 3. Deploy
```bash
vercel
```

Or use the deployment script:
```bash
./deploy-vercel.sh
```

### 4. Set Environment Variables

After deployment, go to:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

Add:
- **Key:** `VITE_API_BASE_URL`
- **Value:** `https://your-backend-url.ngrok-free.app/api`

---

## ⚠️ Backend API Setup

Since your backend is PHP running on `localhost:8001`, you need to make it accessible:

### Option A: Use ngrok (Recommended for Testing)

1. **Install ngrok** (if not installed):
   ```bash
   brew install ngrok
   ```

2. **Start ngrok tunnel for backend**:
   ```bash
   ngrok http 8001
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

4. **Set in Vercel Environment Variables**:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://abc123.ngrok-free.app/api`

5. **Redeploy** (or it will auto-redeploy when you update env vars)

### Option B: Deploy Backend Separately

Deploy your PHP backend to:
- **Railway**: https://railway.app
- **Heroku**: https://heroku.com
- **Your own server**

Then update `VITE_API_BASE_URL` to point to that URL.

---

## 📝 Deployment Checklist

- [ ] Vercel CLI installed
- [ ] Logged in to Vercel
- [ ] Backend accessible (ngrok or deployed)
- [ ] Environment variable `VITE_API_BASE_URL` set in Vercel
- [ ] Frontend deployed successfully
- [ ] Test the deployed site

---

## 🔗 Share Your Link

After deployment, Vercel will give you a URL like:
```
https://unicon-saas.vercel.app
```

Share this with your friend along with the login credentials!

---

## 🔐 Login Credentials

**Students:**
- `kenshee@unicon.edu` / `password123`
- `rahma@unicon.edu` / `password123`
- `brenn@unicon.edu` / `password123`
- `alex@unicon.edu` / `password123`

**Teacher:**
- `archievald.ranay@unicon.edu` / `password123`

---

## 🛠️ Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Run `npm install` locally first
- Check build logs in Vercel dashboard

### API Not Working
- Verify `VITE_API_BASE_URL` is set correctly
- Check that backend is accessible (test ngrok URL in browser)
- Check CORS settings in backend

### Environment Variables Not Working
- Make sure variable name starts with `VITE_`
- Redeploy after adding environment variables
- Check Vercel dashboard → Settings → Environment Variables

---

## 📚 Resources

- Vercel Docs: https://vercel.com/docs
- Vite + Vercel: https://vercel.com/guides/deploying-vite
- ngrok: https://ngrok.com/docs

