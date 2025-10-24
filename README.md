# UNICON SaaS - Modern React SPA

A complete school social platform built with **React 18**, **Vite**, **Tailwind CSS**, and **PHP API**. This is a modern Single Page Application (SPA) that provides a seamless user experience for students, teachers, and administrators.

## 🚀 **Tech Stack**

### **Frontend (React SPA)**

- **React 18** - Modern React with hooks and context
- **Vite** - Lightning-fast build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Context API** - State management (Auth + Branding)

### **Backend (PHP API)**

- **PHP 8+** - Server-side API
- **Custom Router** - Clean URL routing
- **RESTful API** - JSON endpoints
- **Local Storage** - Client-side data persistence

## 📁 **Project Structure**

```
UNICON_SAAS/
├── src/                          # React SPA Source
│   ├── components/               # Reusable UI components
│   │   ├── Header.jsx           # App header with branding
│   │   └── BottomNav.jsx        # Mobile navigation
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.jsx      # Authentication state
│   │   └── BrandingContext.jsx  # School branding
│   ├── pages/                   # Page components
│   │   ├── LandingPage.jsx      # Marketing landing page
│   │   ├── StudentLogin.jsx     # Student login
│   │   ├── AdminLogin.jsx       # Admin login
│   │   ├── Register.jsx         # School registration
│   │   ├── ForYou.jsx           # Main feed
│   │   ├── Profile.jsx          # User profile
│   │   ├── Community.jsx        # Forums & discussions
│   │   ├── Messages.jsx         # Direct messaging
│   │   ├── Marketplace.jsx      # Buy/sell platform
│   │   ├── Calendar.jsx         # Academic calendar
│   │   ├── Settings.jsx         # User settings
│   │   └── AdminDashboard.jsx   # Admin panel
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # App entry point
│   └── index.css                # Global styles
├── api/                         # PHP API
│   └── index.php                # API endpoints
├── router.php                   # Custom PHP router
├── index.html                   # React SPA entry point
├── package.json                 # Dependencies
├── vite.config.js               # Vite configuration
└── tailwind.config.js           # Tailwind configuration
```

## 🛠 **Setup & Installation**

### **1. Install Dependencies**

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/UNICON_SAAS
npm install
```

### **2. Development Mode**

```bash
# Terminal 1: Start React dev server
npm run dev

# Terminal 2: Start PHP server
npm run serve
```

### **3. Access the Application**

- **React App**: `http://localhost:3000`
- **PHP API**: `http://localhost:8000/api/*`

## 🎯 **Key Features**

### **✅ Complete React SPA**

- **Single Page Application** with client-side routing
- **Responsive Design** - Mobile-first approach
- **Modern UI/UX** - Glass effects, animations, gradients
- **Component-based Architecture** - Reusable components

### **✅ Authentication System**

- **Student Login** - Regular user authentication
- **Admin Login** - Administrative access
- **Protected Routes** - Role-based access control
- **Session Management** - Persistent login state

### **✅ School Branding**

- **Dynamic Branding** - Custom colors, logos, names
- **Multi-tenant Support** - Different schools, same platform
- **Plan-based Features** - Basic, Pro, Premium tiers

### **✅ Core Modules**

- **📢 Announcements** - School-wide communications
- **📅 Events & Calendar** - Academic calendar with RSVP
- **💬 Community Forums** - Discussion boards by category
- **📱 Direct Messages** - Private messaging system
- **🛒 Marketplace** - Student buy/sell platform
- **👤 User Profiles** - Student profiles with stats
- **⚙️ Settings** - Account preferences and privacy

### **✅ Admin Dashboard**

- **📊 Analytics** - User activity and engagement
- **👥 User Management** - Student and staff accounts
- **📝 Content Moderation** - Review posts and reports
- **📈 System Status** - Platform health monitoring

## 🔧 **Development Commands**

```bash
# Development
npm run dev          # Start Vite dev server (port 3000)
npm run serve        # Start PHP server (port 8000)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Both servers
npm run dev & npm run serve  # Run both simultaneously
```

## 🌐 **API Endpoints**

The PHP API provides these endpoints:

```bash
GET  /api/health           # Health check
POST /api/auth/login       # User authentication
POST /api/auth/logout      # User logout
GET  /api/me              # Current user info
GET  /api/feed            # User feed data
GET  /api/events          # Calendar events
```

## 🎨 **Design System**

### **Color Palette**

- **Primary**: `#1D4E89` (Customizable per school)
- **Secondary**: `#6AA7D8`
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`

### **Typography**

- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### **Components**

- **Glass Effects** - Backdrop blur with transparency
- **Gradients** - Modern gradient buttons and backgrounds
- **Animations** - Smooth transitions and hover effects
- **Responsive Grid** - Mobile-first layout system

## 📱 **Responsive Design**

- **Mobile First** - Optimized for mobile devices
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

## 🔐 **Security Features**

- **Protected Routes** - Authentication required
- **Role-based Access** - Student vs Admin permissions
- **Input Validation** - Form validation and sanitization
- **CORS Headers** - Proper API security

## 🚀 **Deployment**

### **Production Build**

```bash
npm run build
```

### **Server Requirements**

- **PHP 8.0+** - For API endpoints
- **Node.js 16+** - For build process
- **Web Server** - Apache/Nginx for serving files

## 📊 **Performance**

- **Vite Build** - Lightning-fast development and builds
- **Code Splitting** - Automatic route-based splitting
- **Tree Shaking** - Unused code elimination
- **Asset Optimization** - Compressed images and CSS

## 🔄 **Migration from Legacy**

The project has been completely rewritten as a modern React SPA while preserving all original functionality:

- ✅ **All pages migrated** to React components
- ✅ **Authentication system** modernized
- ✅ **API integration** maintained
- ✅ **Design system** enhanced
- ✅ **Mobile responsiveness** improved
- ✅ **Performance** optimized

## 🎉 **Ready to Use**

Your UNICON SaaS platform is now a modern, scalable React SPA!

**Start development:**

```bash
npm run dev
npm run serve
```

**Access at:** `http://localhost:3000`

---

_Built with ❤️ using React, Vite, Tailwind CSS, and PHP_
