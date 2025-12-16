# Stripe Payment Setup Guide

This guide will help you set up Stripe payments for the registration flow.

## Prerequisites

1. **Stripe Account**: Sign up at https://stripe.com if you don't have an account
2. **Stripe API Keys**: Get your test keys from https://dashboard.stripe.com/test/apikeys

## Step 1: Install Stripe PHP SDK

The backend uses the Stripe PHP SDK. Install it using Composer:

```bash
# If you don't have Composer installed:
curl -sS https://getcomposer.org/installer | php

# Install Stripe PHP SDK
php composer.phar require stripe/stripe-php

# Or if Composer is globally installed:
composer require stripe/stripe-php
```

## Step 2: Update .env File

Edit the `.env` file in the project root and set your Stripe keys:

```bash
# Backend Stripe Keys (for PHP)
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_PUBLIC_KEY=pk_test_your_actual_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Frontend Stripe Key (for React/Vite)
# This should be the SAME as STRIPE_PUBLIC_KEY
VITE_STRIPE_PUBLIC_KEY=pk_test_your_actual_publishable_key_here
```

**Important**:

- Replace `your_actual_secret_key_here` with your real Stripe secret key
- Replace `your_actual_publishable_key_here` with your real Stripe publishable key
- Both `STRIPE_PUBLIC_KEY` and `VITE_STRIPE_PUBLIC_KEY` should have the same value

## Step 3: Update stripe_payment.php to Load Stripe SDK

The `api/stripe_payment.php` file needs to load the Stripe SDK. Add this at the top:

```php
require_once __DIR__ . '/../vendor/autoload.php';
```

Or if using a different path, adjust accordingly.

## Step 4: Restart Servers

After updating `.env`, restart both servers:

### Terminal 1: Frontend (Vite)

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/UNICON_SAAS
npm run dev
```

### Terminal 2: Backend (PHP)

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/UNICON_SAAS
php -S localhost:8000 router.php
```

**Note**: Vite will automatically reload when `.env` changes, but you may need to restart it to pick up `VITE_STRIPE_PUBLIC_KEY`.

## Step 5: Test the Registration Flow

1. **Visit**: http://localhost:3000/register
2. **Fill out the form**:

   - Personal information (Step 1)
   - School details (Step 2)
   - Programs (Step 3)
   - Select a **paid plan** (Basic or Pro) in Step 4
   - Review and payment (Step 5)

3. **Use Stripe Test Cards**:

   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0025 0000 3155`
   - Use any future expiry date (e.g., 12/25)
   - Use any 3-digit CVC (e.g., 123)
   - Use any ZIP code (e.g., 12345)

4. **Check the payment flow**:
   - Payment form should load when you select a paid plan and enter email
   - Card form should appear
   - Payment should process successfully with test card

## Troubleshooting

### "Stripe secret key not configured" error

- Check that `STRIPE_SECRET_KEY` is set in `.env`
- Make sure the key starts with `sk_test_` (for test mode)
- Restart the PHP server after updating `.env`

### "Payment form not loading"

- Check browser console for errors
- Verify `VITE_STRIPE_PUBLIC_KEY` is set in `.env`
- Restart the Vite dev server (`npm run dev`)
- Check that the key starts with `pk_test_` (for test mode)

### "Stripe SDK not found" error

- Run `composer require stripe/stripe-php` to install the SDK
- Make sure `vendor/autoload.php` exists
- Check that `stripe_payment.php` includes the autoload file

### Payment intent creation fails

- Verify your Stripe keys are correct
- Check Stripe dashboard for API errors
- Ensure you're using test keys (not live keys) for development

## Testing Checklist

- [ ] Stripe PHP SDK installed via Composer
- [ ] `.env` file has `STRIPE_SECRET_KEY` set
- [ ] `.env` file has `STRIPE_PUBLIC_KEY` set
- [ ] `.env` file has `VITE_STRIPE_PUBLIC_KEY` set (same as STRIPE_PUBLIC_KEY)
- [ ] Both servers restarted after updating `.env`
- [ ] Can access registration page: http://localhost:3000/register
- [ ] Payment form loads when selecting paid plan
- [ ] Test card `4242 4242 4242 4242` processes successfully
- [ ] Payment appears in Stripe dashboard test mode

## Next Steps

After successful testing:

1. Set up webhook endpoint for production
2. Configure webhook secret in `.env`
3. Test webhook events in Stripe dashboard
4. Update to live keys for production deployment
