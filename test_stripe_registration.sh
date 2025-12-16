#!/bin/bash
# Test script for Stripe registration payment flow

echo "=========================================="
echo "Testing Stripe Registration Payment Flow"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it from env.example"
    exit 1
fi

# Check if Stripe keys are set
if grep -q "sk_test_your_stripe_secret_key_here" .env || grep -q "pk_test_your_stripe_publishable_key_here" .env; then
    echo "⚠️  WARNING: Stripe keys are still using placeholder values!"
    echo "   Please update .env with your actual Stripe keys from:"
    echo "   https://dashboard.stripe.com/apikeys"
    echo ""
    echo "   Required variables:"
    echo "   - STRIPE_SECRET_KEY=sk_test_..."
    echo "   - STRIPE_PUBLIC_KEY=pk_test_..."
    echo "   - VITE_STRIPE_PUBLIC_KEY=pk_test_... (same as STRIPE_PUBLIC_KEY)"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Environment file found"
echo ""

# Test payment intent endpoint
echo "Testing payment intent creation..."
echo "POST /api/registration/payment-intent"
echo ""

RESPONSE=$(curl -s -X POST http://localhost:8000/api/registration/payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "plan": "Basic"
  }')

echo "Response:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

# Check response
if echo "$RESPONSE" | grep -q "client_secret"; then
    echo "✅ Payment intent created successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Make sure your dev server is running: npm run dev"
    echo "2. Make sure your PHP server is running: php -S localhost:8000 router.php"
    echo "3. Visit http://localhost:3000/register"
    echo "4. Fill out the registration form"
    echo "5. Select a paid plan (Basic or Pro)"
    echo "6. Enter your email"
    echo "7. Use Stripe test card: 4242 4242 4242 4242"
    echo "8. Use any future expiry date and any CVC"
else
    echo "❌ Payment intent creation failed"
    echo ""
    echo "Common issues:"
    echo "- Stripe keys not set in .env"
    echo "- PHP server not running on port 8000"
    echo "- Stripe PHP SDK not installed (run: composer require stripe/stripe-php)"
fi

echo ""
echo "=========================================="
