#!/bin/bash

echo "🚀 Starting UNICON Demo Environment"
echo "===================================="
echo ""

# Check if PHP server is already running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ PHP backend already running on port 8000"
else
    echo "📦 Starting PHP backend on port 8000..."
    php -S localhost:8000 router.php > /tmp/unicon_php.log 2>&1 &
    echo "✅ Backend started (PID: $!)"
    echo "   Logs: /tmp/unicon_php.log"
fi

echo ""
echo "🌐 Next Steps:"
echo ""
echo "1. Start ngrok (in a new terminal):"
echo "   ngrok http 8000"
echo ""
echo "2. Copy the ngrok HTTPS URL (e.g., https://abc123.ngrok-free.app)"
echo ""
echo "3. Deploy frontend:"
echo "   ./quick-deploy.sh"
echo ""
echo "4. Set VITE_API_BASE_URL in Vercel to: https://your-ngrok-url.ngrok-free.app/api"
echo ""
echo "✅ Backend is ready at: http://localhost:8000"
echo ""
