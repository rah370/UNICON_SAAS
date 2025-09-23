# UNICON SaaS - School Social Platform

A modern React + Vite + Tailwind CSS SaaS application for school social platforms with multi-tenant support and plan-based feature gating.

## Features

- **Multi-tenant SaaS architecture** with tenant switching
- **Plan-based feature gating** (Basic, Pro, Premium)
- **Modern UI** with Tailwind CSS and glass morphism effects
- **Responsive design** with mobile-first approach
- **Dark/Light theme** support
- **React Router** for navigation
- **Context-based state management**

## Quick Start

1. **Install dependencies:**
   ```bash
   cd kulan-saas
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:5173`

## Project Structure

```
kulan-saas/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui.jsx          # Base UI components (Button, Card, etc.)
│   │   ├── Header.jsx      # App header with tenant/plan controls
│   │   └── BottomNav.jsx   # Mobile navigation
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.jsx # Authentication state
│   │   └── SaaSContext.jsx # SaaS tenant/plan state
│   ├── pages/              # Page components
│   │   ├── Landing.jsx     # Marketing landing page
│   │   ├── SignIn.jsx      # Sign in page
│   │   ├── SignUp.jsx      # Sign up page
│   │   └── Dashboard.jsx   # Main app dashboard
│   ├── mock/               # Mock data
│   │   └── data.js         # Sample data for demo
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── vite.config.js          # Vite configuration
```

## Plan Features

### Basic (Free)
- Announcements
- Events & RSVPs
- 1 admin user
- No Marketplace/Forums

### Pro ($29/mo)
- Everything in Basic
- Student Marketplace
- Clubs & Forums (up to 10)
- Multiple admins

### Premium ($99/mo)
- Everything in Pro
- Unlimited forums
- Verified sellers
- Priority support

## Development

- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with custom design system
- **Routing:** React Router v6
- **State:** React Context API
- **Icons:** Emoji-based (no external dependencies)

## Customization

The app uses a custom primary color scheme (emerald-based) defined in `tailwind.config.js`. You can easily modify colors, fonts, and other design tokens there.

## Browser Support

- Modern browsers with ES6+ support
- Mobile responsive (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers
