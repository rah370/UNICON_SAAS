#!/bin/bash
# Platform Diagnostic Script

echo "=========================================="
echo "UNICON Platform Diagnostic"
echo "=========================================="
echo ""

# Check if servers are running
echo "1. Checking if servers are running..."
echo ""

# Check PHP server
PHP_PID=$(lsof -ti:8000 2>/dev/null)
if [ -n "$PHP_PID" ]; then
    echo "✅ PHP server is running on port 8000 (PID: $PHP_PID)"
else
    echo "❌ PHP server is NOT running on port 8000"
    echo "   Start it with: php -S localhost:8000 router.php"
fi

# Check Vite server
VITE_PID=$(lsof -ti:3000 2>/dev/null)
if [ -n "$VITE_PID" ]; then
    echo "✅ Vite dev server is running on port 3000 (PID: $VITE_PID)"
else
    echo "❌ Vite dev server is NOT running on port 3000"
    echo "   Start it with: npm run dev"
fi

echo ""
echo "2. Testing API endpoints..."
echo ""

# Test API
API_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/ 2>/dev/null)
if [ "$API_TEST" = "200" ] || [ "$API_TEST" = "404" ] || [ "$API_TEST" = "405" ]; then
    echo "✅ API server is responding (HTTP $API_TEST)"
else
    echo "❌ API server is NOT responding"
    echo "   Response code: $API_TEST"
fi

# Test frontend
FRONTEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null)
if [ "$FRONTEND_TEST" = "200" ]; then
    echo "✅ Frontend is responding (HTTP $FRONTEND_TEST)"
else
    echo "❌ Frontend is NOT responding"
    echo "   Response code: $FRONTEND_TEST"
fi

echo ""
echo "3. Checking environment setup..."
echo ""

# Check .env file
if [ -f .env ]; then
    echo "✅ .env file exists"
    
    # Check Stripe keys
    if grep -q "sk_test_your_stripe_secret_key_here" .env; then
        echo "⚠️  Stripe keys are still using placeholder values"
    else
        echo "✅ Stripe keys appear to be configured"
    fi
else
    echo "❌ .env file not found"
    echo "   Create it with: cp env.example .env"
fi

# Check vendor directory
if [ -d vendor ]; then
    echo "✅ vendor directory exists (Composer dependencies installed)"
else
    echo "⚠️  vendor directory not found"
    echo "   Stripe SDK may not be installed"
    echo "   Install with: composer require stripe/stripe-php"
fi

echo ""
echo "4. Checking for common issues..."
echo ""

# Check PHP syntax
if php -l api/index.php > /dev/null 2>&1; then
    echo "✅ api/index.php has no syntax errors"
else
    echo "❌ api/index.php has syntax errors"
    php -l api/index.php
fi

if php -l api/stripe_payment.php > /dev/null 2>&1; then
    echo "✅ api/stripe_payment.php has no syntax errors"
else
    echo "❌ api/stripe_payment.php has syntax errors"
    php -l api/stripe_payment.php
fi

# Check node_modules
if [ -d node_modules ]; then
    echo "✅ node_modules directory exists"
else
    echo "❌ node_modules directory not found"
    echo "   Install with: npm install"
fi

echo ""
echo "5. Quick API test..."
echo ""

# Test a simple API endpoint
TEST_RESPONSE=$(curl -s http://localhost:8000/api/ 2>&1)
if echo "$TEST_RESPONSE" | grep -q "error\|Error\|ERROR"; then
    echo "⚠️  API returned an error:"
    echo "$TEST_RESPONSE" | head -5
else
    echo "✅ API appears to be working"
fi

echo ""
echo "=========================================="
echo "Diagnostic Complete"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. If servers aren't running, start them:"
echo "   Terminal 1: npm run dev"
echo "   Terminal 2: php -S localhost:8000 router.php"
echo ""
echo "2. If you see errors, check:"
echo "   - Browser console (F12) for JavaScript errors"
echo "   - PHP server logs for backend errors"
echo "   - Network tab for failed requests"
echo ""
echo "3. Visit: http://localhost:3000"
echo ""
