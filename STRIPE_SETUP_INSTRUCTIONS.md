# Stripe Registration Payment Setup - Quick Start

## ✅ Completed Steps

1. **npm install** - ✅ Completed

   - Stripe React packages installed
   - Dependencies resolved

2. **Environment Variables** - ✅ Setup
   - `.env` file created from `env.example`
   - `VITE_STRIPE_PUBLIC_KEY` added to `.env`
   - Ready for your Stripe keys

## 🔧 Next Steps (Required)

### 1. Install Stripe PHP SDK

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/UNICON_SAAS

# Install Composer if not already installed
curl -sS https://getcomposer.org/installer | php

# Install Stripe PHP SDK
php composer.phar require stripe/stripe-php
```

### 2. Get Your Stripe Test Keys

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### 3. Update .env File

Edit `.env` and replace the placeholder values:

```bash
# Replace these with your actual Stripe test keys:
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
STRIPE_PUBLIC_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
```

**Important**: `STRIPE_PUBLIC_KEY` and `VITE_STRIPE_PUBLIC_KEY` should be the SAME value.

### 4. Restart Servers

**Terminal 1 - Frontend:**

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/UNICON_SAAS
npm run dev
```

**Terminal 2 - Backend:**

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/UNICON_SAAS
php -S localhost:8000 router.php
```

## 🧪 Testing the Registration Flow

1. **Visit**: http://localhost:3000/register

2. **Fill out registration form**:

   - Step 1: Personal Information
   - Step 2: School Information
   - Step 3: Programs & Facilities
   - Step 4: **Select "Basic" or "Pro" plan** (paid plans)
   - Step 5: Review & Payment

3. **Payment Form**:

   - Should automatically load when you select a paid plan and enter email
   - Use Stripe test card: **4242 4242 4242 4242**
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)

4. **Verify**:
   - Payment processes successfully
   - Registration completes
   - Redirects to login page

## 🔍 Troubleshooting

### "Stripe SDK not found"

- Run: `php composer.phar require stripe/stripe-php`
- Verify `vendor/autoload.php` exists

### "Stripe secret key not configured"

- Check `.env` file has `STRIPE_SECRET_KEY` set
- Restart PHP server after updating `.env`

### Payment form doesn't load

- Check browser console for errors
- Verify `VITE_STRIPE_PUBLIC_KEY` is set in `.env`
- Restart Vite dev server (`npm run dev`)

### Payment intent creation fails

- Verify Stripe keys are correct (test keys start with `sk_test_` and `pk_test_`)
- Check Stripe dashboard for API errors
- Ensure PHP server is running on port 8000

## 📝 Files Modified

- ✅ `package.json` - Stripe packages installed
- ✅ `api/stripe_payment.php` - Updated to use Stripe PHP SDK
- ✅ `api/index.php` - Payment intent endpoint added
- ✅ `.env` - Environment variables configured
- ✅ `src/apps/student/pages/Register.jsx` - Already has Stripe integration

## 🎯 Quick Test Command

After setting up your Stripe keys, test the endpoint:

```bash
curl -X POST http://localhost:8000/api/registration/payment-intent \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","plan":"Basic"}'
```

Expected response:

```json
{
  "success": true,
  "client_secret": "pi_..."
}
```
