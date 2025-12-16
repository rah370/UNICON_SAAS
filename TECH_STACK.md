# UNICON SaaS - Complete Tech Stack

## 🎯 **Frontend Technologies**

### **Core Framework**
- **React 18.3.1** - UI library with hooks and context API
- **React DOM 18.3.1** - React rendering for web
- **React Router DOM 6.26.2** - Client-side routing and navigation

### **Build Tools & Development**
- **Vite 5.4.8** - Build tool and dev server (replaces Create React App)
- **@vitejs/plugin-react 4.2.1** - Vite plugin for React support

### **Styling & UI**
- **Tailwind CSS 3.4.10** - Utility-first CSS framework
- **PostCSS 8.4.47** - CSS processing
- **Autoprefixer 10.4.20** - Automatic vendor prefixes
- **Framer Motion 11.0.0** - Animation library for React

### **State Management**
- **React Context API** - Built-in state management
  - `AuthContext` - Authentication state
  - `BrandingContext` - School branding state
  - `WebSocketContext` - Real-time communication
  - `ToastContext` - Notification system

### **Payment Integration**
- **@stripe/react-stripe-js 2.4.0** - React components for Stripe
- **@stripe/stripe-js 2.4.0** - Stripe.js library
- **stripe 19.1.0** - Stripe Node.js SDK (for frontend utilities)

---

## 🔧 **Backend Technologies**

### **Server-Side Language**
- **PHP 8+** - Server-side scripting
- **XAMPP** - Local development environment (Apache + MySQL + PHP)

### **Database**
- **MySQL** - Relational database management system
- **PDO (PHP Data Objects)** - Database abstraction layer
- **MySQL Socket Connection** - Optimized for XAMPP

### **API Architecture**
- **RESTful API** - JSON-based API endpoints
- **Custom PHP Router** - Clean URL routing (`router.php`)
- **JWT-like Token System** - Custom authentication tokens

### **Payment Processing**
- **Stripe PHP SDK** - Server-side payment processing
- **Stripe Webhooks** - Payment event handling

### **File Handling**
- **File Upload System** - Custom file upload handler
- **Image Processing** - Logo, avatar, and post image handling

### **Email Services**
- **Email Verification System** - Custom email verification
- **SMTP Integration** - Email sending capabilities

---

## 🗄️ **Database Schema**

### **Core Tables**
- `users` - User accounts (students, teachers, admins)
- `schools` - School/tenant information
- `subscriptions` - School subscription plans
- `school_branding` - Per-school branding configuration
- `school_branding_versions` - Branding version history

### **Content Tables**
- `posts` - Community posts and announcements
- `comments` - Post comments
- `reactions` - Post reactions/likes
- `events` - Calendar events
- `marketplace_listings` - Marketplace items
- `messages` - Direct messages
- `conversations` - Message conversations

### **System Tables**
- `file_uploads` - Uploaded file metadata
- `notifications` - User notifications
- `tasks` - Task management
- `contact_submissions` - Landing page contact form
- `newsletter_subscribers` - Newsletter signups

---

## 🛠️ **Development Tools**

### **Package Management**
- **npm** - Node.js package manager
- **package.json** - Frontend dependencies
- **composer.json** - PHP dependencies (if used)

### **Version Control**
- **Git** - Source control
- **.gitignore** - Ignore patterns

### **Environment Management**
- **.env** - Environment variables
- **env_loader.php** - PHP environment variable loader
- **env.example** - Environment template

### **Build & Deployment**
- **Vite Build** - Production build system
- **Vercel** - Deployment platform (configured)
- **vercel.json** - Vercel configuration

---

## 📦 **Key Libraries & Utilities**

### **Frontend Utilities**
- **Custom API Client** (`api.js`) - Centralized API requests
- **CSV Parser** - Data import/export
- **Export Utils** - Data export functionality
- **File Upload Utils** - Client-side file handling
- **Messages API** - Messaging utilities

### **Backend Utilities**
- **Database Singleton** - Database connection management
- **Auth Handler** - Authentication and authorization
- **File Upload Handler** - Server-side file processing
- **Stripe Payment Handler** - Payment processing
- **Email Verification** - Email verification system
- **Enhanced Endpoints** - Extended API functionality
- **School Branding** - Branding management system

---

## 🎨 **Design & UI**

### **Design System**
- **Custom Color Palette** - School-branded colors
- **Typography** - Inter font family
- **Glass Morphism** - Backdrop blur effects
- **Gradient System** - Modern gradient designs
- **Responsive Grid** - Mobile-first layouts

### **Component Library**
- **Reusable Components** - Card, Button, Header, etc.
- **Skeleton Loaders** - Loading states
- **Toast Notifications** - User feedback
- **Error Boundaries** - Error handling
- **Offline Manager** - Offline support

---

## 🔐 **Security Features**

### **Authentication**
- **Password Hashing** - PHP `password_hash()` with bcrypt
- **Token-based Auth** - JWT-like token system
- **Session Management** - Server-side sessions
- **Role-based Access Control** - Student, Admin, Super Admin

### **Data Protection**
- **Prepared Statements** - SQL injection prevention
- **Input Validation** - Server-side validation
- **CORS Headers** - Cross-origin security
- **File Type Validation** - Upload security

---

## 🌐 **Deployment & Infrastructure**

### **Development Servers**
- **Vite Dev Server** - Port 3000 (frontend)
- **PHP Built-in Server** - Port 8000 (backend)
- **Apache (XAMPP)** - Production web server option

### **Production**
- **Vercel** - Frontend hosting
- **Serverless Functions** - API endpoints
- **CDN** - Content delivery network

### **Database Hosting**
- **MySQL** - Local (XAMPP) or cloud-hosted
- **Database Migrations** - SQL migration files

---

## 📱 **Platform Features**

### **Multi-tenant Architecture**
- **School-based Isolation** - Each school has separate data
- **Branding per School** - Customizable per tenant
- **Plan-based Features** - Free Trial, Basic, Pro, Premium

### **Real-time Features**
- **WebSocket Support** - Real-time messaging (configured)
- **Live Notifications** - Real-time updates
- **Activity Feeds** - Live content updates

### **Offline Support**
- **Service Worker** - PWA capabilities
- **Offline Manager** - Offline data handling
- **Cache Management** - Local storage caching

---

## 🔄 **Data Flow**

### **Frontend → Backend**
1. React components make API calls via `apiRequest()`
2. Requests sent to `/api/*` endpoints
3. Vite proxy forwards to PHP server (dev) or serverless (prod)
4. PHP router processes requests
5. Database queries via PDO
6. JSON responses returned

### **Authentication Flow**
1. User logs in → `POST /api/auth/login`
2. Backend validates credentials
3. Token generated and stored
4. Token included in subsequent requests
5. Backend validates token on each request

---

## 📊 **Performance Optimizations**

### **Frontend**
- **Code Splitting** - Route-based lazy loading
- **Tree Shaking** - Unused code elimination
- **Asset Optimization** - Compressed assets
- **React Memoization** - Component optimization

### **Backend**
- **Database Connection Pooling** - Singleton pattern
- **Query Optimization** - Prepared statements
- **Caching** - In-memory branding cache
- **Indexed Queries** - Database indexes

---

## 🧪 **Testing & Quality**

### **Code Quality**
- **ESLint** - JavaScript linting (if configured)
- **PHP Syntax Checking** - `php -l` validation
- **Error Boundaries** - React error handling

### **Development Scripts**
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run serve` - Start PHP server
- `npm run preview` - Preview production build

---

## 📚 **Documentation**

- **README.md** - Project overview
- **BRANDING_SYSTEM_DOCUMENTATION.md** - Branding system docs
- **SETUP_STRIPE.md** - Stripe integration guide
- **ENV_SETUP.md** - Environment setup
- **Migration Files** - Database schema updates

---

## 🎯 **Architecture Pattern**

- **Single Page Application (SPA)** - Client-side routing
- **RESTful API** - Backend API design
- **Component-based** - React component architecture
- **Multi-tenant SaaS** - School-based isolation
- **Microservices-ready** - Modular backend structure

---

## 📈 **Scalability Features**

- **Database Indexing** - Optimized queries
- **Caching Strategy** - Branding and data caching
- **CDN Ready** - Static asset delivery
- **Serverless Architecture** - Vercel deployment
- **Horizontal Scaling** - Stateless API design

---

_Last Updated: December 2025_
