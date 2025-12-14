# Environment Variables Setup Guide

This guide explains how to set up environment variables for the UNICON SaaS application.

## Quick Start

1. **Copy the example file:**
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` with your actual values:**
   ```bash
   nano .env  # or use your preferred editor
   ```

3. **Never commit `.env` to git!** (It's already in `.gitignore`)

---

## Environment Variables Reference

### Database Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | Database host | `localhost` | No |
| `DB_NAME` | Database name | `unicon_saas` | No |
| `DB_USER` | Database username | `root` | No |
| `DB_PASS` | Database password | `` (empty) | No |
| `DB_CHARSET` | Database charset | `utf8mb4` | No |
| `DB_SOCKET` | MySQL socket path (XAMPP) | `/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock` | No |

**For XAMPP (macOS):**
- Leave `DB_SOCKET` as default or empty
- The code will automatically detect the socket path

**For Production:**
- Set `DB_HOST` to your database server
- Set `DB_PASS` to a strong password
- Leave `DB_SOCKET` empty to use TCP connection

---

### Stripe Payment Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` | Yes (for payments) |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key | `pk_test_...` | Yes (for payments) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` | Yes (for webhooks) |

**Getting Stripe Keys:**
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your test/live keys
3. Paste them in `.env`

**Note:** The code uses placeholder values by default, but you MUST set real keys for production.

---

### Email Configuration (SMTP)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` | No |
| `SMTP_PORT` | SMTP server port | `587` | No |
| `SMTP_USER` | SMTP username (email) | `your_email@gmail.com` | Yes (for email) |
| `SMTP_PASS` | SMTP password/app password | `your_app_password` | Yes (for email) |
| `FROM_EMAIL` | Sender email address | `noreply@unicon.edu` | No |
| `FROM_NAME` | Sender name | `UNICON Platform` | No |

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an app password: https://myaccount.google.com/apppasswords
3. Use the app password as `SMTP_PASS`

---

### Application URLs

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` | Yes |
| `BACKEND_URL` | Backend API URL | `http://localhost:8000` | Yes |
| `API_BASE_URL` | API base URL | `http://localhost:8000` | No |
| `VITE_API_BASE_URL` | Vite API base URL | `http://localhost:8000/api` | No |

**For Production:**
- Set `FRONTEND_URL` to your production frontend URL
- Set `BACKEND_URL` to your production backend URL
- Update `VITE_API_BASE_URL` in your build process

---

### JWT Secret

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for JWT tokens | `your_jwt_secret_key_here` | Yes (for production) |

**Generating a JWT Secret:**
```bash
# Generate a random 32-character string
openssl rand -hex 32
```

**Important:** Use a strong, random secret in production!

---

## How It Works

The application uses a simple environment variable loader (`api/env_loader.php`) that:

1. **Loads `.env` file** if it exists in the project root
2. **Falls back to system environment variables** if `.env` doesn't exist
3. **Uses default values** if neither is set

This means:
- ✅ Works in development with `.env` file
- ✅ Works in production with system environment variables
- ✅ Backward compatible (uses defaults if nothing is set)

---

## Files Using Environment Variables

The following files have been updated to use environment variables:

1. **`api/database.php`** - Database connection
2. **`api/stripe_payment.php`** - Stripe API keys
3. **`api/email_verification.php`** - SMTP settings and frontend URLs

---

## Security Best Practices

1. ✅ **Never commit `.env` to git** (already in `.gitignore`)
2. ✅ **Use different values for development and production**
3. ✅ **Rotate secrets regularly** (especially if exposed)
4. ✅ **Use strong passwords** for database and SMTP
5. ✅ **Keep `.env` file permissions restricted** (chmod 600)

---

## Troubleshooting

### Database Connection Issues

If you're having database connection issues:

1. **Check your database credentials:**
   ```bash
   mysql -u root -p
   ```

2. **Verify the database exists:**
   ```sql
   SHOW DATABASES;
   CREATE DATABASE IF NOT EXISTS unicon_saas;
   ```

3. **For XAMPP socket issues:**
   - Check if socket file exists: `ls -la /Applications/XAMPP/xamppfiles/var/mysql/mysql.sock`
   - If not, leave `DB_SOCKET` empty in `.env`

### Environment Variables Not Loading

1. **Check `.env` file location:**
   - Should be in project root: `/Applications/XAMPP/xamppfiles/htdocs/UNICON_SAAS/.env`
   - Not in `api/` directory

2. **Check file permissions:**
   ```bash
   chmod 644 .env
   ```

3. **Verify syntax:**
   - No spaces around `=`
   - No quotes needed (they're auto-stripped)
   - One variable per line

---

## Production Deployment

For production, you typically won't use a `.env` file. Instead:

1. **Set environment variables in your hosting platform:**
   - Heroku: `heroku config:set DB_PASS=your_password`
   - AWS: Use Parameter Store or Secrets Manager
   - Docker: Use `docker-compose.yml` or `-e` flags

2. **Or use a `.env` file on the server:**
   - Keep it outside the web root
   - Set restrictive permissions: `chmod 600 .env`
   - Never commit it to git

---

## Need Help?

If you encounter issues:
1. Check the error logs
2. Verify your `.env` file syntax
3. Ensure all required variables are set
4. Check file permissions

---

**Last Updated:** $(date)

