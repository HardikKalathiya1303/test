# 📅 Tsatsaku Web Application - 12 Week Development Plan

**Duration:** 12 Weeks (5 days/week, 4-5 hours/day)  
**Architecture:** Single Unified Dashboard with Role-Based Access Control  
**Technology:** Next.js + Node.js + MongoDB

---

## 🗓️ Week 1: Analysis, Design & Project Setup

**Focus:** Requirements Analysis, Flow Design, Environment Setup, Database Architecture

### Deliverables:
- ✅ Complete requirements analysis from Excel file
- ✅ System architecture design
- ✅ Flow diagrams for all major features
- ✅ Database schema design (all 11 models)
- ✅ Frontend project setup (Next.js)
- ✅ Backend project setup (Node.js/Express)
- ✅ MongoDB connection established
- ✅ Folder structure created
- ✅ Environment configuration
- ✅ Git repository initialized

### Database Models Designed:
1. Users (with role field)
2. Buyers (with company details)
3. Products (with attributes)
4. ProductCategories (hierarchical)
5. PurchaseOrders (with status tracking)
6. Warehouses
7. Ports
8. WarehouseStock (with auto-update)
9. ContactQueries
10. ContentPages
11. EmailLogs

### Flows Created:
- Authentication flow
- Purchase order creation flow
- Order status update flow (with stock automation)
- Warehouse stock management flow
- User management flow (RBAC)
- Dashboard data aggregation flow
- QR code generation & scanning flow
- Email notification triggers

### APIs Planned: 0/77

---

## 🗓️ Week 2: Authentication & Core Infrastructure

**Focus:** Authentication System, Profile Management, Location API Integration

### Modules:
1. **Authentication System**
   - Login/Logout for all roles
   - Forgot Password (OTP-based)
   - Password Reset
   - JWT token generation
   - Auth middleware
   - Role-based access control middleware

2. **Profile Management**
   - View profile
   - Update profile
   - Reset password (logged-in user)
   - Country/State/City selection

3. **Core Infrastructure**
   - Reusable UI components (Button, Input, Form, Alert, Spinner)
   - Protected route wrapper
   - API service layer
   - Error handling
   - Nodemailer setup
   - Location API integration (Country/State/City)

### APIs Built This Week:
- POST /api/auth/login
- POST /api/auth/forgot-password
- POST /api/auth/verify-otp
- POST /api/auth/reset-password
- POST /api/auth/logout
- GET /api/locations/countries
- GET /api/locations/states/:countryId
- GET /api/locations/cities/:stateId
- GET /api/profile
- PUT /api/profile
- PUT /api/profile/reset-password

### Total APIs: 11/77

---

## 🗓️ Week 3: Buyer Portal (Complete Module)

**Focus:** Complete Buyer-facing Application

### Modules:
1. **Buyer Dashboard & Navigation**
   - Unified dashboard layout
   - Role-based navigation menu (8 links)
   - Homepage with welcome message
   - Responsive header & footer

2. **Content Pages**
   - About Us
   - Terms & Conditions
   - Privacy Policy
   - FAQ
   - Contact Us (with form)

3. **Purchase Order Management (Buyer View)**
   - View all purchase orders (table)
   - Search, filter, sort, pagination
   - View PO details
   - Status timeline visualization
   - View MAN user notes
   - Download QR code

### Features Completed:
- ✅ Buyer login & authentication
- ✅ Profile management
- ✅ Content pages rendering
- ✅ Contact form submission
- ✅ PO viewing (read-only)
- ✅ PO details with status tracking
- ✅ QR code display

### APIs Built This Week:
- GET /api/content/:pageType
- POST /api/contact
- GET /api/buyer/purchase-orders
- GET /api/buyer/purchase-orders/:poId

### Total APIs: 15/77

---

## 🗓️ Week 4: MAN User - Authentication & User Management

**Focus:** MAN User Portal Foundation & Sub-User Management

### Modules:
1. **MAN User Portal Setup**
   - MAN User dashboard layout
   - Role-based navigation (6 main sections)
   - Dashboard page structure

2. **Sub-User Management (Complete)**
   - View all sub-users (table with pagination)
   - Add new sub-user
   - Edit sub-user
   - Module access matrix (granular permissions)
   - Dependent module auto-selection
   - Activate/Deactivate sub-user
   - Search & filter sub-users

### Features Completed:
- ✅ MAN user login & authentication
- ✅ Sub-user CRUD operations
- ✅ Granular permission system
- ✅ Module dependency handling
- ✅ Email notification on sub-user creation
- ✅ Sub-user profile management

### APIs Built This Week:
- GET /api/man-user/sub-users
- POST /api/man-user/sub-users
- GET /api/man-user/sub-users/:userId
- PUT /api/man-user/sub-users/:userId
- PATCH /api/man-user/sub-users/:userId/status

### Total APIs: 20/77

---

## 🗓️ Week 5: MAN User - Buyer Management

**Focus:** Complete Buyer Management Module for MAN Users

### Modules:
1. **Buyer Management (Complete)**
   - View all buyers (table with pagination)
   - Add new buyer (with 8-10 company fields)
   - Edit buyer details
   - View buyer profile
   - Activate/Deactivate buyer
   - Search, filter, sort buyers
   - Export buyers (Excel/CSV)
   - View buyer's order history

### Features Completed:
- ✅ Buyer CRUD operations by MAN user
- ✅ Company details form (Company Name, Address, Contact Person, etc.)
- ✅ Email notification on buyer creation (with login credentials)
- ✅ Buyer account activation/deactivation
- ✅ Export functionality
- ✅ Advanced search & filtering
- ✅ Buyer profile view

### APIs Built This Week:
- GET /api/man-user/buyers
- POST /api/man-user/buyers
- GET /api/man-user/buyers/:buyerId
- PUT /api/man-user/buyers/:buyerId
- PATCH /api/man-user/buyers/:buyerId/status
- GET /api/man-user/buyers/export

### Total APIs: 26/77

---

## 🗓️ Week 6: MAN User - Order Management (Part 1)

**Focus:** Purchase Order Creation & Basic Management

### Modules:
1. **Purchase Order Creation**
   - Create new PO form
   - Select buyer (dropdown)
   - Select products (multi-select with search)
   - Set quantity & unit for each product
   - Set delivery date
   - Enter delivery address
   - Additional fields (10-15 fields)
   - Form validation
   - Auto-generate unique PO number
   - QR code generation on creation

2. **Order List View**
   - View all purchase orders (table)
   - Advanced filters (buyer, status, date range, products)
   - Search functionality
   - Sort by multiple columns
   - Pagination
   - Quick actions menu

### Features Completed:
- ✅ PO creation with product selection
- ✅ Unique PO number generation
- ✅ QR code auto-generation
- ✅ Email notification to buyer on PO creation
- ✅ Order listing with filters
- ✅ PO validation (buyer, products)

### APIs Built This Week:
- GET /api/man-user/purchase-orders
- POST /api/man-user/purchase-orders
- GET /api/man-user/purchase-orders/:poId

### Total APIs: 29/77

---

## 🗓️ Week 7: MAN User - Order Management (Part 2) & Reports

**Focus:** Order Status Management, QR Codes & Inventory Reports

### Modules:
1. **Order Status Management**
   - View PO details page
   - Status update interface (context-aware)
   - Add notes to status changes
   - Status timeline visualization
   - Status validation (cannot reverse/skip)
   - Automated stock updates:
     - Increase stock when "Received into Warehouse"
     - Decrease stock when "Dispatched from Warehouse"
   - Email notifications on status change

2. **QR Code Management**
   - View QR code for each PO
   - Download QR code (PNG)
   - Public PO view page (via QR scan)
   - QR code regeneration if needed

3. **Inventory Reports**
   - Real-Time Inventory Report (all products, all warehouses)
   - Warehouse-wise Products Report
   - Export reports (Excel/CSV)
   - Filter by product, warehouse, category
   - Low stock highlighting

### Features Completed:
- ✅ Complete order status workflow
- ✅ Automated warehouse stock updates
- ✅ QR code generation & download
- ✅ Public PO view page
- ✅ Real-time inventory calculations
- ✅ Warehouse-wise stock reports
- ✅ Low stock alerts

### APIs Built This Week:
- PUT /api/man-user/purchase-orders/:poId/status
- GET /api/man-user/purchase-orders/:poId/qr-code
- GET /api/public/purchase-orders/:poId/qr
- GET /api/man-user/reports/inventory
- GET /api/man-user/reports/warehouse-stock

### Total APIs: 34/77

---

## 🗓️ Week 8: Admin - Authentication & User Management

**Focus:** Admin Portal Foundation, Sub-Admin Management & Buyer Management

### Modules:
1. **Admin Portal Setup**
   - Admin dashboard layout
   - Role-based navigation (10+ sections)
   - Dashboard page structure

2. **Sub-Admin Management (Complete)**
   - View all sub-admins (table with pagination)
   - Add new sub-admin
   - Edit sub-admin
   - Module access matrix (12+ modules)
   - Granular permissions (View/Add/Edit/Deactivate/Reactivate)
   - Dependent module auto-selection
   - Activate/Deactivate sub-admin
   - Search & filter sub-admins
   - Module list API for permission UI

3. **Buyer Management (Admin View)**
   - View all buyers
   - Add/Edit buyers (same as MAN user)
   - Activate/Deactivate buyers
   - Export functionality
   - View buyer order history

### Features Completed:
- ✅ Admin login & authentication
- ✅ Sub-admin CRUD operations
- ✅ Granular permission system (5 permission types per module)
- ✅ Module dependency mapping
- ✅ Email notification on sub-admin creation
- ✅ Buyer management by admin

### APIs Built This Week:
- GET /api/admin/sub-admins
- POST /api/admin/sub-admins
- GET /api/admin/sub-admins/:userId
- PUT /api/admin/sub-admins/:userId
- PATCH /api/admin/sub-admins/:userId/status
- GET /api/admin/modules
- GET /api/admin/buyers
- POST /api/admin/buyers
- GET /api/admin/buyers/:buyerId
- PUT /api/admin/buyers/:buyerId
- PATCH /api/admin/buyers/:buyerId/status
- GET /api/admin/buyers/export

### Total APIs: 46/77

---

## 🗓️ Week 9: Admin - Product Categories & Products

**Focus:** Product Catalog Management with Hierarchical Categories

### Modules:
1. **Product Categories (Hierarchical)**
   - View categories in tree structure
   - Add main category
   - Add sub-category (nested)
   - Edit category
   - Delete/Deactivate category
   - Drag & drop reordering
   - Category hierarchy validation

2. **Product Attributes**
   - Define custom attributes (25-30 attributes)
   - Attribute types (text, number, dropdown, checkbox)
   - Attribute groups
   - Conditional attributes based on category

3. **Product Management (Complete)**
   - View all products (table with pagination)
   - Add new product
   - Product form with:
     - Basic info (name, code, description)
     - Category selection
     - 25-30 attributes/fields
     - Custom fields (dynamic)
     - Images (multiple upload)
     - Status (Active/Inactive)
   - Edit product
   - Delete/Deactivate product
   - Search & advanced filters
   - Export products
   - Bulk operations

### Features Completed:
- ✅ Hierarchical category system
- ✅ Product CRUD with extensive attributes
- ✅ Image upload & management
- ✅ Custom field support
- ✅ Category-based attribute display
- ✅ Product search & filtering
- ✅ Export functionality

### APIs Built This Week:
- GET /api/admin/categories
- POST /api/admin/categories
- PUT /api/admin/categories/:categoryId
- DELETE /api/admin/categories/:categoryId
- PATCH /api/admin/categories/:categoryId/status
- GET /api/admin/products
- POST /api/admin/products
- GET /api/admin/products/:productId
- PUT /api/admin/products/:productId
- DELETE /api/admin/products/:productId
- PATCH /api/admin/products/:productId/status

### Total APIs: 57/77

---

## 🗓️ Week 10: Admin - Ports, Warehouses & Stock Management

**Focus:** Inventory Infrastructure & Automated Stock Management

### Modules:
1. **Port Management**
   - View all ports
   - Add new port (name, code, location)
   - Edit port details
   - Activate/Deactivate port

2. **Warehouse Management**
   - View all warehouses
   - Add new warehouse (name, location, port)
   - Edit warehouse details
   - Activate/Deactivate warehouse
   - View warehouse stock summary

3. **Warehouse Stock Management (Complete)**
   - Add product to warehouse(s)
   - Set initial quantity
   - Set restock alert level
   - Update stock manually
   - View stock by warehouse
   - View stock by product
   - Stock movement history
   - Low stock alerts
   - Automated stock updates:
     - Increase on "Received into Warehouse" status
     - Decrease on "Dispatched from Warehouse" status
   - Email alert on low stock

### Features Completed:
- ✅ Port CRUD operations
- ✅ Warehouse CRUD operations
- ✅ Stock assignment to warehouses
- ✅ Restock alert configuration
- ✅ Automated stock updates on PO status change
- ✅ Low stock detection & alerts
- ✅ Stock movement tracking
- ✅ Stock history/audit trail

### APIs Built This Week:
- GET /api/admin/ports
- POST /api/admin/ports
- PATCH /api/admin/ports/:portId/status
- GET /api/admin/warehouses
- POST /api/admin/warehouses
- PATCH /api/admin/warehouses/:warehouseId/status
- GET /api/admin/stock
- POST /api/admin/stock
- GET /api/admin/stock/:productId
- PUT /api/admin/stock/:stockId
- DELETE /api/admin/stock/:stockId
- PATCH /api/admin/stock/:stockId/status

### Total APIs: 69/77

---

## 🗓️ Week 11: Admin - Dashboard, Reports & Queries

**Focus:** Analytics, Reporting & Customer Support

### Modules:
1. **Admin Dashboard (Complete)**
   - 6 Key Metrics:
     - Total Buyers (with link)
     - Orders This Week
     - Orders This Month
     - Orders This Year
     - Low Stock Products (with link)
     - Pending Contact Queries (with link)
   - 3 Analytics Widgets:
     - Buyers with Most Orders (top 5)
     - Most Ordered Product
     - Least Ordered Product
   - Low Stock Products List
   - Recent activities

2. **Advanced Reports**
   - Real-Time Inventory Report
   - Warehouse-wise Products Report
   - Export to Excel/CSV
   - Custom date ranges
   - Multiple filters

3. **Contact Queries Management**
   - View all contact queries
   - Query details view
   - Admin response form
   - Close query with response
   - Query status (Open/Closed)
   - Email notification on response
   - Search & filter queries

### Features Completed:
- ✅ Dashboard with 6 metrics
- ✅ Top buyers analytics
- ✅ Product order analytics
- ✅ Low stock dashboard widget
- ✅ Real-time data aggregation
- ✅ Contact query management
- ✅ Query response system
- ✅ Email notifications on query closure

### APIs Built This Week:
- GET /api/admin/dashboard
- GET /api/admin/reports/inventory
- GET /api/admin/reports/warehouse-stock
- GET /api/admin/queries
- GET /api/admin/queries/:queryId
- PUT /api/admin/queries/:queryId/close

### Total APIs: 75/77

---

## 🗓️ Week 12: Admin - Content Management & Email Notifications

**Focus:** CMS & Communication System

### Modules:
1. **Content Management System**
   - Manage 5 content pages:
     - About Us
     - Terms & Conditions
     - Privacy Policy
     - FAQ
     - Contact Us
   - Rich text editor
   - Update page content
   - Preview before save
   - Content versioning
   - Publish/Unpublish pages

2. **Email Notification System (11 Types)**
   - Email Templates:
     1. Buyer Account Created (with credentials)
     2. MAN User/Sub-user Created (with credentials)
     3. Sub-Admin Created (with credentials)
     4. Forgot Password OTP (Buyer)
     5. Forgot Password OTP (MAN User)
     6. Forgot Password OTP (Admin)
     7. New PO Created (to Buyer)
     8. PO Status Updated (to Buyer)
     9. New Contact Query (to Admin)
     10. Contact Query Closed (to User)
     11. Low Stock Alert (to Admin)
   
   - Email template variables
   - Email queue system
   - Email logs/history
   - Resend failed emails
   - Email preferences

3. **System Polish**
   - Error handling improvements
   - Loading states
   - Success/Error messages
   - Form validation refinements
   - UI/UX consistency
   - Mobile responsiveness check
   - Performance optimization

### Features Completed:
- ✅ Complete CMS for all content pages
- ✅ Rich text editing
- ✅ 11 email templates
- ✅ Email sending service
- ✅ Email logging
- ✅ All UI components polished
- ✅ Responsive design verified
- ✅ Error handling complete

### APIs Built This Week:
- GET /api/admin/content
- PUT /api/admin/content/:pageType

### Total APIs: 77/77 ✅

---

## 📊 Module Completion Summary

### ✅ Completed Modules:

**Week 1:**
- [x] Requirements Analysis & Flow Design
- [x] Project Setup (Frontend + Backend)
- [x] Database Schema Design

**Week 2:**
- [x] Authentication System (All Roles)
- [x] Profile Management
- [x] Location API Integration

**Week 3:**
- [x] Buyer Portal (Complete)
- [x] Content Pages
- [x] Buyer PO Management

**Week 4:**
- [x] MAN User Portal Setup
- [x] Sub-User Management

**Week 5:**
- [x] Buyer Management (MAN User)

**Week 6:**
- [x] Order Creation (MAN User)
- [x] Order Listing

**Week 7:**
- [x] Order Status Management
- [x] QR Code System
- [x] Inventory Reports (MAN User)

**Week 8:**
- [x] Admin Portal Setup
- [x] Sub-Admin Management
- [x] Buyer Management (Admin)

**Week 9:**
- [x] Product Categories (Hierarchical)
- [x] Product Management (with 25-30 attributes)

**Week 10:**
- [x] Port Management
- [x] Warehouse Management
- [x] Stock Management (with automation)

**Week 11:**
- [x] Admin Dashboard (6 metrics + analytics)
- [x] Inventory Reports (Admin)
- [x] Contact Queries Management

**Week 12:**
- [x] Content Management System
- [x] Email Notification System (11 types)

---

## 🎯 Key Features by Week

| Week | Key Features |
|------|--------------|
| 1 | System Design, Setup, Database |
| 2 | Login, Profile, Location API |
| 3 | Buyer Portal (8 pages) |
| 4 | Sub-User CRUD + Permissions |
| 5 | Buyer CRUD + Export |
| 6 | PO Creation + Listing |
| 7 | Status Updates + Stock Automation + Reports |
| 8 | Sub-Admin CRUD + Granular Permissions |
| 9 | Categories (Hierarchical) + Products (30 fields) |
| 10 | Ports + Warehouses + Stock + Low Stock Alerts |
| 11 | Dashboard (6 metrics) + Analytics + Queries |
| 12 | CMS + 11 Email Templates |

---

## 📈 Progress Tracking

```
Week 1  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 8%
Week 2  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 17%
Week 3  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 25%
Week 4  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░ 33%
Week 5  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░ 42%
Week 6  ████████████████████████░░░░░░░░░░░░░░░░░░░ 50%
Week 7  ████████████████████████████░░░░░░░░░░░░░░░ 58%
Week 8  ████████████████████████████████░░░░░░░░░░░ 67%
Week 9  ████████████████████████████████████░░░░░░░ 75%
Week 10 ████████████████████████████████████████░░░ 83%
Week 11 ████████████████████████████████████████████ 92%
Week 12 ████████████████████████████████████████████ 100% 🎉
```

---

## 💡 Weekly Work Pattern

### Each Week (5 days):
- **Monday:** Start new module, read requirements, plan approach
- **Tuesday-Thursday:** Build features, create APIs, develop UI
- **Friday:** Complete module, fix bugs, commit code

### Daily (4-5 hours):
- **Hour 1:** Review yesterday's work, plan today
- **Hour 2-3:** Development (APIs + UI)
- **Hour 4:** Testing, bug fixes
- **Hour 5:** Documentation, commit, next day planning

---

## ⚠️ Important Notes

### What's NOT Included:
- ❌ Testing (Unit, Integration, E2E)
- ❌ Deployment & DevOps
- ❌ Performance optimization beyond basics
- ❌ Security audits
- ❌ Load testing

### Critical Features to Implement:

1. **Automated Stock Updates:**
   - Week 7: Increase stock on "Received into Warehouse"
   - Week 7: Decrease stock on "Dispatched from Warehouse"

2. **Low Stock Alerts:**
   - Week 10: Detect when stock < threshold
   - Week 12: Email notification to admin

3. **Role-Based Access Control:**
   - Week 4: MAN sub-user permissions
   - Week 8: Admin sub-admin permissions (5 levels per module)

4. **QR Code System:**
   - Week 6: Generate on PO creation
   - Week 7: Public view page

5. **Email Notifications:**
   - Week 12: All 11 email types

---

## 🚀 Getting Started

### This Week (Week 1):
1. Read Excel requirements file thoroughly
2. Create system architecture diagrams
3. Design all workflow diagrams
4. Create all 11 database schemas
5. Initialize Next.js frontend project
6. Initialize Node.js backend project
7. Connect to MongoDB
8. Setup environment variables
9. Create folder structure
10. Commit initial setup

### Next Week (Week 2):
- Build complete authentication system
- Implement JWT & RBAC
- Create profile management
- Integrate location API

---

## 📞 Weekly Deliverables Checklist

Use this to track completion of each week:

- [ ] Week 1: Analysis, Design & Setup ✅
- [ ] Week 2: Authentication & Infrastructure ✅
- [ ] Week 3: Buyer Portal Complete ✅
- [ ] Week 4: MAN Sub-User Management ✅
- [ ] Week 5: MAN Buyer Management ✅
- [ ] Week 6: Order Creation ✅
- [ ] Week 7: Order Status & Reports ✅
- [ ] Week 8: Admin User Management ✅
- [ ] Week 9: Categories & Products ✅
- [ ] Week 10: Warehouses & Stock ✅
- [ ] Week 11: Dashboard & Queries ✅
- [ ] Week 12: CMS & Emails ✅

---

**Total Duration:** 12 Weeks  
**Total APIs:** 77  
**Total Modules:** 15+  
**Total Features:** 50+

🎉 **At the end of Week 12, you'll have a complete, production-ready web application!**
