#!/bin/bash
# Start UNICON Platform Servers

echo "Starting UNICON Platform Servers..."
echo ""

# Check if already running
if lsof -ti:8000 > /dev/null 2>&1; then
    echo "⚠️  PHP server already running on port 8000"
else
    echo "Starting PHP server on port 8000..."
    cd /Applications/XAMPP/xamppfiles/htdocs/UNICON_SAAS
    php -S localhost:8000 router.php > /tmp/unicon_php.log 2>&1 &
    PHP_PID=$!
    echo "✅ PHP server started (PID: $PHP_PID)"
    echo "   Logs: /tmp/unicon_php.log"
fi

if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Vite server already running on port 3000"
else
    echo "Starting Vite dev server on port 3000..."
    cd /Applications/XAMPP/xamppfiles/htdocs/UNICON_SAAS
    npm run dev > /tmp/unicon_vite.log 2>&1 &
    VITE_PID=$!
    echo "✅ Vite server started (PID: $VITE_PID)"
    echo "   Logs: /tmp/unicon_vite.log"
    echo ""
    echo "⏳ Waiting for Vite to compile..."
    sleep 5
fi

echo ""
echo "=========================================="
echo "Servers Status:"
echo "=========================================="
echo ""

# Check status
if lsof -ti:8000 > /dev/null 2>&1; then
    echo "✅ PHP API: http://localhost:8000"
else
    echo "❌ PHP API: Not running"
fi

if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: http://localhost:3000"
else
    echo "❌ Frontend: Not running"
fi

echo ""
echo "=========================================="
echo "Access your platform at:"
echo "👉 http://localhost:3000"
echo "=========================================="
echo ""
echo "To stop servers:"
echo "  kill \$(lsof -ti:8000)  # Stop PHP server"
echo "  kill \$(lsof -ti:3000)  # Stop Vite server"
echo ""
