# Tsatsaku Web Application - Quick Start Guide

## 📋 Project Overview

A comprehensive web application for managing purchase orders, inventory, and buyer relationships with role-based access control.

**3 User Roles (Single Unified Dashboard):**
- 👤 **Buyer** - View and track purchase orders
- 🏭 **MAN User** - Manage buyers, create orders, manage inventory
- 👨‍💼 **Admin** - Full system control with sub-admin management

**Architecture:**
- **One unified dashboard** with role-based views
- Navigation and features change based on logged-in user's role
- Single codebase with conditional rendering
- More maintainable and efficient than separate portals

**Tech Stack:**
- Frontend: Next.js (React)
- Backend: Node.js + Express
- Database: MongoDB

---

## 🚀 Getting Started in 5 Steps

### Step 1: Review the Full Plan
📄 **Read [PROJECT_DEVELOPMENT_PLAN.md](./PROJECT_DEVELOPMENT_PLAN.md)** - This is your complete roadmap!

### Step 2: Setup Your Environment (Day 1 Morning)

#### Prerequisites
Install these first:
- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git
- Code Editor (VS Code recommended)

#### Create Project Structure
```powershell
# You're already in E:\Tsatsaku

# Create frontend folder
mkdir tsatsaku-frontend
cd tsatsaku-frontend
npx create-next-app@latest . --typescript --tailwind --app --src-dir

# Go back and create backend folder
cd ..
mkdir tsatsaku-backend
cd tsatsaku-backend
npm init -y
```

### Step 3: Install Dependencies (Day 1 Morning)

#### Frontend Dependencies
```powershell
cd tsatsaku-frontend

# Core dependencies
npm install axios react-hook-form @tanstack/react-query
npm install @mui/material @emotion/react @emotion/styled
# OR use Tailwind (already installed with create-next-app)

# Development dependencies
npm install -D @types/node @types/react
```

#### Backend Dependencies
```powershell
cd ../tsatsaku-backend

# Production dependencies
npm install express mongoose bcryptjs jsonwebtoken
npm install express-validator nodemailer dotenv cors helmet
npm install multer qrcode xlsx

# Development dependencies
npm install -D nodemon
```

### Step 4: Configure Environment Variables (Day 1)

#### Frontend (.env.local)
Create `tsatsaku-frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Tsatsaku
```

#### Backend (.env)
Create `tsatsaku-backend/.env`:
```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/tsatsaku
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tsatsaku

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Email Configuration (use Gmail for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@tsatsaku.com

# Third-party APIs
COUNTRY_STATE_CITY_API_KEY=your-api-key-here
# Get free API key from: https://countrystatecity.in/

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### Step 5: Start Development (Day 1 Afternoon)

#### Run Backend
```powershell
cd tsatsaku-backend
npm run dev  # Add script to package.json: "dev": "nodemon src/app.js"
```

#### Run Frontend
```powershell
cd tsatsaku-frontend
npm run dev
```

Visit: http://localhost:3000

---

## 📅 Development Timeline

**Total Duration:** 43 days @ 4-5 hours/day

### Week 1 (Days 1-5): Foundation + Buyer Portal
- Day 1: Setup & Database Design
- Day 2: Authentication Infrastructure
- Day 3: Location API & Profile
- Day 4-5: Buyer Portal

### Week 2 (Days 6-10): Buyer Portal + Start MAN User
- Day 6-8: Buyer PO Management
- Day 9-10: MAN User Authentication & Sub-users

### Week 3 (Days 11-17): MAN User Portal
- Day 11-12: Buyer Management
- Day 13-17: Order Management & Reports

### Week 4 (Days 18-23): MAN User Reports + Admin Start
- Day 18-19: Inventory Reports
- Day 20-23: Admin User Management

### Week 5-6 (Days 24-32): Admin Product & Inventory
- Day 24-28: Products, Categories, Attributes
- Day 29-32: Ports, Warehouses, Stock Management

### Week 7 (Days 33-37): Admin Dashboard & Content
- Day 33-35: Dashboard, Queries, Reports
- Day 36-37: Content Management

### Week 8 (Days 38-40): Notifications & Testing
- Day 38: Email Notifications
- Day 39-40: Integration Testing

### Week 9 (Days 41-43): Final Testing & Deployment
- Day 41-42: Pre-deployment Testing
- Day 43: Deployment

---

## 📂 Folder Structure

See detailed structure in [PROJECT_DEVELOPMENT_PLAN.md](./PROJECT_DEVELOPMENT_PLAN.md#expected-project-structure)

---

## 🔑 Key Features to Build

### Buyer Portal
- ✅ Login/Logout
- ✅ View Purchase Orders (with search, filter, pagination)
- ✅ View PO Details with status timeline
- ✅ Profile Management
- ✅ Content Pages (About, T&C, Privacy, FAQ)
- ✅ Contact Us Form

### MAN User Portal
- ✅ Login/Logout/Profile
- ✅ Manage MAN Sub-Users (with granular permissions)
- ✅ Manage Buyers (CRUD + Export)
- ✅ Create & Manage Purchase Orders
- ✅ Update Order Status (with automation)
- ✅ Generate QR Codes for POs
- ✅ Real-Time Inventory Report
- ✅ Warehouse-wise Products Report

### Admin Panel
- ✅ Login/Logout/Profile
- ✅ Manage Sub-Admins (with granular permissions)
- ✅ Manage Buyers (CRUD + Export)
- ✅ Manage Product Categories (hierarchical)
- ✅ Manage Products (with 25-30 attributes + custom fields)
- ✅ Manage Ports
- ✅ Manage Warehouses
- ✅ Warehouse Stock Management (with auto-update on PO status)
- ✅ Low Stock Alerts
- ✅ Dashboard (6 key metrics)
- ✅ Real-Time Inventory Report
- ✅ Warehouse-wise Products Report
- ✅ Contact Queries Management
- ✅ Content Manager (About, T&C, Privacy, FAQ)
- ✅ Email Notifications (11 types)

---

## 🔐 Role-Based Access Control

### Permission Levels
- **View** - Can only view data
- **Add** - Can create new records
- **Edit** - Can update existing records
- **Deactivate** - Can deactivate records
- **Reactivate** - Can reactivate records

### Module Dependencies
If Module B depends on Module A, granting access to B automatically grants access to A.

Example: If sub-admin has access to "Manage Orders", they automatically need "View Products" and "View Buyers".

---

## 📡 API Endpoints Summary

**Total: 77 API Endpoints**

### Authentication (5)
- POST /api/auth/login
- POST /api/auth/forgot-password
- POST /api/auth/verify-otp
- POST /api/auth/reset-password
- POST /api/auth/logout

### Buyer (2)
- GET /api/buyer/purchase-orders
- GET /api/buyer/purchase-orders/:id

### MAN User (16)
- Sub-users: 5 endpoints
- Buyers: 6 endpoints
- Orders: 5 endpoints
- Reports: 2 endpoints

### Admin (51)
- Sub-admins: 6 endpoints
- Buyers: 6 endpoints
- Categories: 5 endpoints
- Products: 6 endpoints
- Ports: 3 endpoints
- Warehouses: 3 endpoints
- Stock: 6 endpoints
- Reports: 2 endpoints
- Dashboard: 1 endpoint
- Queries: 3 endpoints
- Content: 2 endpoints

### Public (3)
- Content pages
- Contact form
- QR code view

Full API list in [PROJECT_DEVELOPMENT_PLAN.md](./PROJECT_DEVELOPMENT_PLAN.md#api-endpoints-complete-list)

---

## 🗄️ Database Models

1. **Users** - All user types with role field
2. **Buyers** - Buyer profiles with company info (8-10 fields)
3. **Products** - Product catalog with attributes
4. **ProductCategories** - Hierarchical categories
5. **PurchaseOrders** - Orders with status tracking
6. **Warehouses** - Warehouse locations
7. **Ports** - Port locations
8. **WarehouseStock** - Inventory with auto-update
9. **ContactQueries** - Contact form submissions
10. **ContentPages** - CMS content
11. **EmailLogs** - Email audit trail

---

## ⚠️ Critical Features

### 1. Automated Stock Management
```
When PO Status = "Received into Warehouse"
  → Increase warehouse stock for products in that PO

When PO Status = "Dispatched from Warehouse"
  → Decrease warehouse stock for products in that PO
```

### 2. Low Stock Alerts
```
If warehouse_stock.quantity < warehouse_stock.restockAlertLevel
  → Generate alert
  → Show in dashboard
  → Send email to admin
```

### 3. QR Code for Each PO
```
- Generate unique QR code when PO is created
- QR code links to public read-only PO details page
- Downloadable as PNG image
```

### 4. Email Notifications (11 Types)

**Buyer:**
1. Account created (with credentials)
2. Forgot password (OTP)
3. PO status updated

**MAN User:**
4. Account created (with credentials)
5. Forgot password (OTP)
6. New PO generated

**Admin:**
7. Forgot password (OTP)
8. New contact query submitted
9. Contact query closed
10. Low product stock alert
11. Sub-admin/Sub-user created (credentials)

### 5. Order Status Flow
```
Pending 
  → In Production 
    → Ready for Dispatch 
      → Dispatched from Warehouse 
        → In Transit 
          → Delivered
```
- Status cannot be reversed
- Each status change records timestamp and user
- Optional notes for each status change

---

## 🚫 What NOT to Build

DO NOT implement these (not in requirements):
- ❌ SMS/Text notifications
- ❌ Browser push notifications
- ❌ Multi-language support
- ❌ Multi-currency
- ❌ Payment integration
- ❌ Chat/messaging
- ❌ Mobile app
- ❌ Advanced analytics beyond specified reports

---

## 📝 Development Checklist

### Day 1
- [ ] Install Node.js, MongoDB, Git
- [ ] Create project folders
- [ ] Initialize Next.js frontend
- [ ] Initialize Node.js backend
- [ ] Install all dependencies
- [ ] Setup .env files
- [ ] Test MongoDB connection
- [ ] Create database schema diagram
- [ ] Push to Git repository

### Day 2
- [ ] Create User model
- [ ] Implement password hashing
- [ ] Build login API
- [ ] Build forgot password API (with OTP)
- [ ] Setup email service
- [ ] Create login page UI
- [ ] Test authentication flow

### Day 3
- [ ] Integrate Country/State/City API
- [ ] Build profile API
- [ ] Build reset password API
- [ ] Create profile page UI
- [ ] Create location selector component
- [ ] Test profile updates

### Continue following the detailed plan...

---

## 🎯 Daily Work Pattern

### Each Development Day (4-5 hours)
1. **Planning (15 min):** Review day's tasks from PROJECT_DEVELOPMENT_PLAN.md
2. **Backend First (2 hours):** Build APIs and database models
3. **Frontend Next (2 hours):** Build UI components and integrate APIs
4. **Testing (30 min):** Test features you built today
5. **Git Commit (15 min):** Commit your code with meaningful messages

### Example Commit Messages
```
git commit -m "feat: implement buyer login API"
git commit -m "feat: add PO list page with pagination"
git commit -m "fix: resolve email notification bug"
git commit -m "refactor: improve product search performance"
```

---

## 🧪 Testing Strategy

### What to Test Daily
1. ✅ API endpoints (using Postman or Thunder Client)
2. ✅ UI components (manual testing)
3. ✅ Form validations
4. ✅ Authentication flows
5. ✅ Database operations

### Before Moving to Next Phase
1. ✅ All APIs working
2. ✅ All UI pages rendering
3. ✅ No console errors
4. ✅ Responsive design verified
5. ✅ Git commits up to date

---

## 🔧 Useful Commands

### Frontend
```powershell
cd tsatsaku-frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter
```

### Backend
```powershell
cd tsatsaku-backend
npm run dev          # Start with nodemon
npm start            # Start production server
```

### Database
```powershell
# Start MongoDB (if installed locally)
mongod

# Connect to MongoDB
mongosh

# View databases
show dbs

# Use tsatsaku database
use tsatsaku

# View collections
show collections

# Query users
db.users.find()
```

---

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)

### APIs
- [CountryStateCity API](https://countrystatecity.in/)
- [Nodemailer Guide](https://nodemailer.com/about/)

### UI Libraries
- [Material-UI](https://mui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🆘 Troubleshooting

### Can't connect to MongoDB
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Make sure MongoDB is running: mongod
2. Check connection string in .env
3. Try MongoDB Atlas if local doesn't work
```

### CORS errors
```
Access to fetch at 'http://localhost:5000' blocked by CORS

Solution:
Add to backend app.js:
const cors = require('cors');
app.use(cors());
```

### Email not sending
```
Error: Invalid login

Solution:
1. Use App-Specific Password for Gmail
2. Enable "Less secure app access" in Gmail settings
3. Or use SendGrid/AWS SES for production
```

### File upload not working
```
Error: Multer unexpected field

Solution:
1. Check field name matches in frontend/backend
2. Ensure multer middleware is before route handler
3. Check file size limits
```

---

## 📞 Next Steps

1. **Right Now:** Read the full [PROJECT_DEVELOPMENT_PLAN.md](./PROJECT_DEVELOPMENT_PLAN.md)
2. **Today:** Complete Day 1 tasks (setup)
3. **Tomorrow:** Start Day 2 (authentication)
4. **This Week:** Complete Phase 1 (Foundation & Setup)

---

## ✅ Success Criteria

You'll know you're on track when:
- ✅ Each day's tasks are completed before moving to next day
- ✅ Code is committed to Git daily
- ✅ APIs are tested and working
- ✅ UI matches the requirements
- ✅ No major bugs accumulating
- ✅ Following ONLY the features in the Excel file

---

## 🎓 Key Principles

1. **Build Only What's Specified** - Don't add extra features
2. **Test As You Go** - Don't accumulate untested code
3. **Follow the Plan** - Stick to the day-by-day schedule
4. **Commit Often** - Save your work frequently
5. **Ask Questions** - Clarify requirements when unclear
6. **Stay Focused** - 4-5 hours of focused work beats 8 hours of distracted work

---

## 📈 Progress Tracking

Create a simple checklist:

```markdown
## My Progress

### Week 1
- [x] Day 1: Setup ✅
- [x] Day 2: Authentication ✅
- [ ] Day 3: Profile
- [ ] Day 4: Buyer Portal
- [ ] Day 5: Content Pages

### Week 2
- [ ] Day 6-8: PO Management
- [ ] Day 9-10: MAN User Portal
...
```

---

**Remember:** This is a 43-day journey. Take it one day at a time. Follow the plan, and you'll build this successfully! 💪

Good luck! 🚀

---

**Files in this Project:**
- 📄 `README.md` (this file) - Quick start guide
- 📋 `PROJECT_DEVELOPMENT_PLAN.md` - Detailed day-by-day plan
- 📊 `Tsatsaku_WebApp_FeatureList_v1.1.xlsx` - Original requirements

**Start Here:** Read PROJECT_DEVELOPMENT_PLAN.md thoroughly, then begin Day 1!
