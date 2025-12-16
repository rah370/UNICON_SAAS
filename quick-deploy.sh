#!/bin/bash

echo "🚀 UNICON SaaS - Quick Deployment"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Are you in the project root?${NC}"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "🔨 Step 2: Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Please fix errors and try again.${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Before deploying, make sure:${NC}"
echo "   1. Your PHP backend is running (php -S localhost:8000 router.php)"
echo "   2. ngrok is running (ngrok http 8000) - if you want to expose backend"
echo ""

read -p "Continue with Vercel deployment? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo ""
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo ""
    echo "🔐 Please login to Vercel:"
    vercel login
fi

echo ""
echo "🚀 Step 3: Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}📝 Next Steps:${NC}"
    echo "   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables"
    echo "   2. Add: VITE_API_BASE_URL = https://your-ngrok-url.ngrok-free.app/api"
    echo "   3. Redeploy (or wait for auto-redeploy)"
    echo ""
    echo "🔗 Your app will be live at: https://your-project.vercel.app"
    echo ""
    echo -e "${GREEN}🎉 Done! Share the link with your friend!${NC}"
else
    echo -e "${RED}❌ Deployment failed. Check errors above.${NC}"
    exit 1
fi
