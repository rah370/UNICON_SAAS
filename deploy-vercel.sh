#!/bin/bash

echo "🚀 Deploying UNICON to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo ""
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo ""
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    vercel login
    echo ""
fi

echo "📦 Building project..."
npm run build

echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "⚠️  IMPORTANT: Set environment variable in Vercel Dashboard:"
echo "   VITE_API_BASE_URL = https://your-backend-url/api"
echo ""
echo "📝 For backend, use ngrok:"
echo "   ngrok http 8001"
echo "   Then update VITE_API_BASE_URL with the ngrok URL"

