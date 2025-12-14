# 🔗 How to Share UNICON with Friends

## Quick Setup Options

### Option 1: Use ngrok (Recommended - Easiest)

1. **Install ngrok** (if not installed):
   ```bash
   brew install ngrok
   ```
   Or download from: https://ngrok.com/download

2. **Start ngrok tunnel**:
   ```bash
   ngrok http 3000
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

4. **Share this link** with your friend:
   ```
   https://abc123.ngrok-free.app
   ```

5. **Important**: You also need to tunnel the backend API:
   ```bash
   # In a new terminal, run:
   ngrok http 8001
   ```
   Then update your `.env` file:
   ```
   VITE_API_BASE_URL=https://your-backend-ngrok-url.ngrok-free.app/api
   ```

---

### Option 2: Same WiFi Network

1. **Find your local IP address**:
   - Mac: System Settings → Network → Wi-Fi → IP Address
   - Or run: `ipconfig getifaddr en0`

2. **Share this link** (replace YOUR_IP with your actual IP):
   ```
   http://YOUR_IP:3000
   ```
   Example: `http://192.168.1.100:3000`

3. **Make sure**:
   - Both devices are on the same WiFi network
   - Your firewall allows connections on port 3000
   - Backend API is accessible at `http://YOUR_IP:8001`

---

### Option 3: Deploy to Production

Deploy to a public hosting service:
- **Vercel** (Frontend): https://vercel.com
- **Railway** (Backend): https://railway.app
- **Heroku** (Backend): https://heroku.com

---

## 🔐 Login Credentials to Share

### Students:
- **Kenshee**: `kenshee@unicon.edu` / `password123`
- **Rahma**: `rahma@unicon.edu` / `password123`
- **Brenn**: `brenn@unicon.edu` / `password123`
- **Alex**: `alex@unicon.edu` / `password123`

### Teacher:
- **Archievald Ranay**: `archievald.ranay@unicon.edu` / `password123`

---

## 📝 Quick Start Script

Run this to get your shareable link:

```bash
# Check if ngrok is installed
if command -v ngrok &> /dev/null; then
    echo "✅ ngrok is installed!"
    echo "Run: ngrok http 3000"
    echo "Then share the HTTPS URL with your friend"
else
    echo "❌ ngrok not installed"
    echo "Install: brew install ngrok"
    echo "Or use local IP method (Option 2)"
fi
```

---

## ⚠️ Important Notes

1. **Keep servers running**: Both frontend (port 3000) and backend (port 8001) must be running
2. **ngrok free tier**: Limited to 1 tunnel at a time, but perfect for testing
3. **Security**: These are demo credentials - change passwords for production
4. **Database**: Make sure your MySQL database is accessible if using remote connection

