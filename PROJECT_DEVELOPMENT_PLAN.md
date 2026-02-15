# Tsatsaku Web Application - Complete Development Plan

## Project Overview

**Technology Stack:**
- Frontend: Next.js (React Framework)
- Backend: Node.js
- Database: MongoDB
- Language: English
- Supported Browsers: Latest versions of Firefox, Chrome & Safari (IE not supported)

**User Roles:**
1. **Buyer** - Can view and manage their Purchase Orders
2. **MAN User** (Manufacturers Association of Nigeria) - Can manage buyers, orders, inventory
3. **Admin** - Full system access with ability to create sub-admins with granular permissions

**Important Architecture Note:**
- **Single Unified Dashboard** with role-based access control
- Same application, different views/features based on logged-in user's role
- Navigation menu and available features change dynamically based on user role
- No separate portals - one codebase, role-based rendering

---

## Project Timeline Summary

**Total Estimated Duration:** 43 working days (4-5 hours/day)
- **Frontend Development:** ~21 days
- **Backend Development:** ~27 days  
- **Database Design:** 1 day
- **Project Setup:** 1 day
- **Testing & Integration:** Throughout development

**Note:** Frontend and Backend work will overlap in many phases.

---

## Development Phases

### Phase 1: Foundation & Setup (Days 1-3)
### Phase 2: Buyer Portal (Days 4-10)
### Phase 3: MAN User Portal (Days 11-19)
### Phase 4: Admin Panel - User Management (Days 20-25)
### Phase 5: Admin Panel - Product & Inventory (Days 26-32)
### Phase 6: Admin Panel - Reports & Dashboard (Days 33-36)
### Phase 7: Content Management & Notifications (Days 37-40)
### Phase 8: Testing, Fixes & Deployment (Days 41-43)

---

# DETAILED DAY-WISE BREAKDOWN

---

## PHASE 1: FOUNDATION & SETUP

### **DAY 1 - Project Setup & Database Design**

#### **Frontend (Next.js):**
- [ ] Initialize Next.js project with TypeScript
- [ ] Setup project folder structure:
  ```
  /src
    /app (Next.js 13+ app directory)
      /dashboard (unified dashboard)
      /(auth) (login, forgot password)
      /profile
    /components
      /dashboard
        /buyer (buyer-specific components)
        /man-user (MAN user-specific components)
        /admin (admin-specific components)
        /shared (shared across roles)
      /layouts (role-based layouts)
      /ui (reusable UI components)
    /lib
    /utils
    /hooks
    /types
    /constants
  /public
  ```
- [ ] Install core dependencies:
  - axios (API calls)
  - react-hook-form (forms)
  - tailwindcss or Material-UI (UI framework)
  - next-auth (authentication)
  - react-query (data fetching)
- [ ] Setup environment variables (.env.local)
- [ ] Configure tailwindcss or chosen UI framework
- [ ] Create unified dashboard layout with role-based rendering
- [ ] Setup routing structure with role-based access control

#### **Backend (Node.js):**
- [ ] Initialize Node.js project with Express.js
- [ ] Setup project folder structure:
  ```
  /src
    /config
    /controllers
      /buyer
      /manUser
      /admin
      /auth
    /models
    /routes
    /middleware
    /services
    /utils
    /validators
  ```
- [ ] Install core dependencies:
  - express
  - mongoose (MongoDB ODM)
  - bcryptjs (password hashing)
  - jsonwebtoken (JWT authentication)
  - express-validator (input validation)
  - nodemailer (email notifications)
  - dotenv (environment variables)
  - cors
  - helmet (security)
- [ ] Setup MongoDB connection
- [ ] Create database design document
- [ ] Design all database schemas/models:
  - Users (with role: buyer, man_user, admin, sub_admin, man_sub_user)
  - Buyers (buyer profile details with company info)
  - Products
  - ProductCategories
  - PurchaseOrders
  - Warehouses
  - Ports
  - WarehouseStock
  - ContactQueries
  - ContentPages (About Us, T&C, Privacy Policy, FAQ)
  - EmailLogs
  - AuditLogs

#### **API Endpoints to Build:**
None (setup day)

---

### **DAY 2 - Authentication Infrastructure**

#### **Frontend (Next.js):**
- [ ] Create authentication context/provider
- [ ] Build reusable components:
  - Input fields (text, email, password)
  - Button component
  - Form wrapper
  - Alert/notification component
  - Loading spinner
- [ ] Create login page layout (generic - will be styled per role later)
- [ ] Create forgot password page layout
- [ ] Setup protected route middleware
- [ ] Setup role-based route protection
- [ ] Create authentication utilities (token management, API interceptors)

#### **Backend (Node.js):**
- [ ] Create User model with fields:
  - email, password, firstName, lastName, role, status (active/inactive)
  - isEmailVerified, resetPasswordToken, resetPasswordExpiry
  - moduleAccess (for sub-admins and MAN sub-users)
  - createdBy, createdAt, updatedAt
- [ ] Create Buyer model with fields:
  - userId (reference), companyName, companyInfo (8-10 fields object)
  - status, createdBy, createdAt, updatedAt
- [ ] Implement password hashing middleware
- [ ] Create JWT token generation utilities
- [ ] Create email service configuration (Nodemailer setup)
- [ ] Create email templates structure

#### **API Endpoints to Build:**
1. **POST /api/auth/login** - Login for all roles
   - Input: email, password
   - Output: JWT token, user data, role
   - Validation: Check credentials, account status

2. **POST /api/auth/forgot-password** - Request password reset
   - Input: email
   - Output: Success message
   - Action: Generate 6-digit OTP, send email, store with 5-min expiry

3. **POST /api/auth/verify-otp** - Verify OTP for password reset
   - Input: email, otp
   - Output: Reset token
   - Validation: Check OTP validity and expiry

4. **POST /api/auth/reset-password** - Reset password with token
   - Input: resetToken, newPassword, confirmPassword
   - Output: Success message
   - Validation: Password rules (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol)

5. **POST /api/auth/logout** - Logout user
   - Input: JWT token
   - Output: Success message

---

### **DAY 3 - Country/State/City Integration & Profile Management**

#### **Frontend (Next.js):**
- [ ] Create reusable location selector component (Country/State/City cascading dropdowns)
- [ ] Create profile page layout (generic for all roles)
- [ ] Build profile form with:
  - Email (read-only)
  - First Name, Last Name (editable)
  - Reset Password section (current password, new password, confirm password)
- [ ] Implement form validation
- [ ] Create API integration for profile updates
- [ ] Create password strength indicator component

#### **Backend (Node.js):**
- [ ] Integrate third-party API for Country/State/City data
  - Setup API client for countrystatecity.in or Geonames
  - Create caching mechanism for location data
- [ ] Create Location service for fetching countries, states, cities
- [ ] Create middleware for JWT authentication verification
- [ ] Create middleware for role-based access control

#### **API Endpoints to Build:**
6. **GET /api/locations/countries** - Get all countries
   - Output: List of countries

7. **GET /api/locations/states/:countryId** - Get states by country
   - Input: countryId
   - Output: List of states

8. **GET /api/locations/cities/:stateId** - Get cities by state
   - Input: stateId
   - Output: List of cities

9. **GET /api/profile** - Get logged-in user profile
   - Input: JWT token (from header)
   - Output: User profile data

10. **PUT /api/profile** - Update user profile
    - Input: firstName, lastName
    - Output: Updated profile data
    - Validation: Required fields

11. **PUT /api/profile/reset-password** - Reset password from profile
    - Input: currentPassword, newPassword, confirmPassword
    - Output: Success message
    - Validation: Verify current password, password rules

---

## PHASE 2: BUYER PORTAL

### **DAY 4 - Unified Dashboard - Layout & Navigation**

#### **Frontend (Next.js):**
- [ ] Create unified dashboard layout component
- [ ] Build role-based navigation system:
  - **Buyer sees:** PO Management, Profile, About Us, T&C, Privacy, FAQ, Contact Us, Logout
  - **MAN User sees:** Dashboard, Buyers, Orders, Sub-Users, Reports, Profile, Logout
  - **Admin sees:** Dashboard, Buyers, Sub-Admins, Products, Categories, Warehouses, Stock, Reports, Content, Queries, Profile, Logout
- [ ] Create dynamic navigation menu component (renders based on user role)
- [ ] Create homepage/landing page with role-specific content
- [ ] Add responsive design for mobile/tablet
- [ ] Create header with user info, role badge, and logout option
- [ ] Create footer component
- [ ] Implement role-based route guards

#### **Backend (Node.js):**
- [ ] Create ContentPage model with fields:
  - pageType (about_us, terms, privacy, faq)
  - title, content, status
  - createdAt, updatedAt
- [ ] Seed initial content pages (empty content, admin will fill later)

#### **API Endpoints to Build:**
12. **GET /api/content/:pageType** - Get content page by type
    - Input: pageType (about_us, terms, privacy, faq)
    - Output: Page content
    - Public access

---

### **DAY 5 - Buyer Portal - Content Pages**

#### **Frontend (Next.js):**
- [ ] Create About Us page
- [ ] Create Terms & Conditions page
- [ ] Create Privacy Policy page
- [ ] Create FAQ page
- [ ] Create Contact Us page with form:
  - Name field
  - Email address field
  - Notes/message field (textarea)
  - Submit button
- [ ] Add rich text rendering for content pages
- [ ] Add loading states
- [ ] Add error handling

#### **Backend (Node.js):**
- [ ] Create ContactQuery model with fields:
  - name, email, message
  - userId (if logged in)
  - status (open, closed)
  - createdAt, updatedAt

#### **API Endpoints to Build:**
13. **POST /api/contact** - Submit contact form
    - Input: name, email, message
    - Output: Success message
    - Action: Save query, send email notification to admin

---

### **DAY 6-7 - Buyer Portal - PO Management (View)**

#### **Frontend (Next.js):**
- [ ] Create PO Management page
- [ ] Build PO list table with:
  - Pagination component
  - Search functionality
  - Sorting functionality (by date, status, etc.)
  - 2-3 filter dropdowns (by status, date range)
  - Columns: PO Number, Created Date, Delivery Date, Status, Actions
- [ ] Create PO details modal/page showing:
  - All PO information (read-only)
  - Order status timeline with dates
  - Notes from MAN user (if any)
  - Product details with quantities
  - Delivery address
- [ ] Add status badges with color coding
- [ ] Create responsive table design

#### **Backend (Node.js):**
- [ ] Create PurchaseOrder model with fields:
  - poNumber (auto-generated, unique)
  - buyerId (reference to Buyer)
  - products (array of objects):
    - productId, productName, quantity, unit
  - deliveryDate
  - deliveryAddress:
    - addressLine1, addressLine2, country, state, city, zipcode
  - additionalFields (object for 10-15 custom fields)
  - status (pending, in_production, ready_for_dispatch, dispatched_from_warehouse, in_transit, delivered)
  - statusHistory (array):
    - status, changedAt, changedBy, notes
  - qrCode (URL/path to QR code image)
  - createdBy (MAN user or Admin who created it)
  - createdAt, updatedAt

#### **API Endpoints to Build:**
14. **GET /api/buyer/purchase-orders** - Get buyer's PO list
    - Input: JWT token, query params (page, limit, search, sortBy, filters)
    - Output: Paginated list of POs
    - Access: Buyer only

15. **GET /api/buyer/purchase-orders/:poId** - Get PO details
    - Input: JWT token, poId
    - Output: Complete PO details
    - Access: Buyer only (their own POs)

---

### **DAY 8 - Testing & Bug Fixes for Buyer Portal**

#### **Frontend (Next.js):**
- [ ] Test all buyer portal pages
- [ ] Test navigation between pages
- [ ] Test form validations
- [ ] Test responsive design on different devices
- [ ] Fix any UI/UX issues
- [ ] Test authentication flow
- [ ] Test API error handling

#### **Backend (Node.js):**
- [ ] Test all buyer APIs
- [ ] Test authentication and authorization
- [ ] Test input validation
- [ ] Test error handling
- [ ] Fix any bugs
- [ ] Test database queries performance

#### **API Endpoints to Build:**
None (testing day)

---

## PHASE 3: MAN USER PORTAL

### **DAY 9-10 - MAN User Portal - Authentication & User Management**

#### **Frontend (Next.js):**
- [ ] Create MAN User portal layout with navigation
- [ ] Build authentication pages:
  - Login page (MAN User branding)
  - Forgot password page
  - Profile page with reset password
- [ ] Create MAN Sub-User Management page
- [ ] Build sub-user list table with:
  - Pagination, search, sorting, filters
  - Columns: Name, Email, Status, Actions (Edit, Activate/Deactivate)
- [ ] Create Add/Edit Sub-User modal/form:
  - First Name, Last Name, Email fields
  - Module access section with checkboxes:
    - Each module with options: View, Add, Edit, Deactivate, Reactivate
  - Implement dependent module auto-selection
  - Status toggle
  - Submit button
- [ ] Create access control matrix UI

#### **Backend (Node.js):**
- [ ] Create MAN User specific routes
- [ ] Implement module access validation middleware
- [ ] Create sub-user creation logic with access control

#### **API Endpoints to Build:**
16. **GET /api/man-user/sub-users** - Get MAN sub-users list
    - Input: JWT token, query params (page, limit, search, filters)
    - Output: Paginated list of sub-users
    - Access: MAN User only

17. **POST /api/man-user/sub-users** - Create MAN sub-user
    - Input: firstName, lastName, email, moduleAccess (object)
    - Output: Created user data
    - Action: Generate password, send email
    - Access: MAN User only

18. **GET /api/man-user/sub-users/:userId** - Get sub-user details
    - Input: userId
    - Output: Sub-user details
    - Access: MAN User only

19. **PUT /api/man-user/sub-users/:userId** - Update sub-user
    - Input: firstName, lastName, moduleAccess, status
    - Output: Updated user data
    - Access: MAN User only

20. **PATCH /api/man-user/sub-users/:userId/status** - Toggle sub-user status
    - Input: userId, status (active/inactive)
    - Output: Success message
    - Access: MAN User only

---

### **DAY 11-12 - MAN User Portal - Buyer Management**

#### **Frontend (Next.js):**
- [ ] Create Buyer Management page
- [ ] Build buyers list table with:
  - Pagination, search, sorting, filters
  - Columns: Company Name, Contact Name, Email, Status, Created Date, Actions
  - Export to spreadsheet button
- [ ] Create Add/Edit Buyer modal/form:
  - Name, Email fields
  - Company info section (8-10 fields):
    - Company Name, Company Registration Number
    - Tax ID, Business Type
    - Phone Number, Website
    - Industry, Number of Employees
    - etc.
  - Status toggle
  - Submit button
- [ ] Create buyer details view page
- [ ] Implement export to Excel/CSV functionality

#### **Backend (Node.js):**
- [ ] Implement buyer creation by MAN user
- [ ] Create export service for Excel/CSV generation
- [ ] Install dependencies: xlsx or csv-writer

#### **API Endpoints to Build:**
21. **GET /api/man-user/buyers** - Get buyers list
    - Input: JWT token, query params (page, limit, search, filters)
    - Output: Paginated list of buyers
    - Access: MAN User only

22. **POST /api/man-user/buyers** - Create buyer account
    - Input: name, email, companyInfo (object with 8-10 fields)
    - Output: Created buyer data
    - Action: Create user account, generate password, send email
    - Access: MAN User only

23. **GET /api/man-user/buyers/:buyerId** - Get buyer details
    - Input: buyerId
    - Output: Buyer details with company info
    - Access: MAN User only

24. **PUT /api/man-user/buyers/:buyerId** - Update buyer
    - Input: buyerId, name, companyInfo, status
    - Output: Updated buyer data
    - Access: MAN User only

25. **PATCH /api/man-user/buyers/:buyerId/status** - Toggle buyer status
    - Input: buyerId, status
    - Output: Success message
    - Access: MAN User only

26. **GET /api/man-user/buyers/export** - Export buyers to spreadsheet
    - Input: JWT token, filters (optional)
    - Output: Excel/CSV file
    - Access: MAN User only

---

### **DAY 13-15 - MAN User Portal - Order Management (Part 1)**

#### **Frontend (Next.js):**
- [ ] Create Order Management page
- [ ] Build orders list table with:
  - Pagination, search, sorting, filters (by status, date, buyer)
  - Columns: PO Number, Buyer, Products, Delivery Date, Status, Actions
- [ ] Create "Add PO" form with fields:
  - Select Buyer dropdown
  - Product selection (multi-select with quantities):
    - Product dropdown (searchable)
    - Quantity input
    - Unit dropdown (Litre, kg, pieces, tons, etc.)
    - Add more products button
  - Delivery Date (date picker)
  - Delivery Address:
    - Address Line 1, Address Line 2
    - Country, State, City dropdowns (cascading)
    - Zipcode
  - Additional Fields section (10-15 custom fields):
    - Will be provided by client - for now use generic textboxes
  - Submit button
- [ ] Add form validation
- [ ] Create product selector component with search

#### **Backend (Node.js):**
- [ ] Create PO creation logic for MAN user
- [ ] Implement product validation
- [ ] Add buyer verification

#### **API Endpoints to Build:**
27. **GET /api/man-user/purchase-orders** - Get all POs
    - Input: JWT token, query params (page, limit, search, filters)
    - Output: Paginated list of all POs in system
    - Access: MAN User only

28. **POST /api/man-user/purchase-orders** - Create PO on behalf of buyer
    - Input: buyerId, products[], deliveryDate, deliveryAddress, additionalFields
    - Output: Created PO data
    - Action: Generate PO number, create PO
    - Access: MAN User only

29. **GET /api/man-user/purchase-orders/:poId** - Get PO details
    - Input: poId
    - Output: Complete PO details
    - Access: MAN User only

---

### **DAY 16-17 - MAN User Portal - Order Management (Part 2 - Status & QR)**

#### **Frontend (Next.js):**
- [ ] Create PO details page showing:
  - All PO information
  - Product details table
  - Delivery address
  - Current status with timeline
  - Status action buttons
  - Notes section
  - QR code display with download button
- [ ] Build order status management UI:
  - Status buttons (context-aware - show next available status only)
  - Status timeline visualization
  - Notes textarea for each status change
  - Status flow: Pending → In Production → Ready for Dispatch → Dispatched from Warehouse → In Transit → Delivered
- [ ] Create QR code display and download functionality
- [ ] Implement status change confirmation dialogs

#### **Backend (Node.js):**
- [ ] Implement order status update logic
- [ ] Create status transition validation (can't skip or reverse)
- [ ] Implement automatic warehouse stock updates:
  - Increase stock when status = "Received into Warehouse"
  - Decrease stock when status = "Dispatched from Warehouse"
- [ ] Implement QR code generation:
  - Install qrcode library
  - Generate unique QR code for each PO
  - Store QR code image
  - QR code links to public PO view page
- [ ] Create public PO view page (no auth required, read-only)

#### **API Endpoints to Build:**
30. **PUT /api/man-user/purchase-orders/:poId/status** - Update PO status
    - Input: poId, newStatus, notes (optional)
    - Output: Updated PO with status history
    - Action: Validate status transition, update warehouse stock if needed, add to status history
    - Access: MAN User only

31. **GET /api/public/purchase-orders/:poId/qr** - Public PO view via QR code
    - Input: poId (from QR code scan)
    - Output: PO details (read-only)
    - Access: Public (no auth required)

32. **GET /api/man-user/purchase-orders/:poId/qr-code** - Get/Generate QR code
    - Input: poId
    - Output: QR code image URL
    - Action: Generate QR code if not exists
    - Access: MAN User only

---

### **DAY 18-19 - MAN User Portal - Inventory Reports**

#### **Frontend (Next.js):**
- [ ] Create Real-Time Inventory Report page
- [ ] Build inventory table showing:
  - Product Name
  - Available Stock (number)
  - In-Transit Stock (number)
  - Dispatched Stock (number)
  - Total Stock (number)
  - Filters and search
- [ ] Create Warehouse-wise Products Report page
- [ ] Build warehouse stock table showing:
  - Product Name
  - Warehouse 1 Stock, Warehouse 2 Stock, etc. (dynamic columns based on warehouses)
  - Total across all warehouses
  - Filters and search
- [ ] Add data visualization (optional charts)
- [ ] Implement export functionality for reports

#### **Backend (Node.js):**
- [ ] Create inventory calculation services
- [ ] Implement real-time stock aggregation from POs and warehouse stock
- [ ] Create warehouse-wise stock reporting logic

#### **API Endpoints to Build:**
33. **GET /api/man-user/reports/inventory** - Real-time inventory report
    - Input: JWT token, filters (optional)
    - Output: Array of products with stock stats (available, in-transit, dispatched)
    - Calculation: 
      - Available = warehouse stock
      - In-transit = POs with status "In Transit"
      - Dispatched = POs with status "Dispatched"
    - Access: MAN User only

34. **GET /api/man-user/reports/warehouse-stock** - Warehouse-wise products report
    - Input: JWT token, filters (optional)
    - Output: Array of products with stock per warehouse
    - Access: MAN User only

---

## PHASE 4: ADMIN PANEL - USER MANAGEMENT

### **DAY 20-21 - Admin Panel - Authentication & Sub-Admin Management**

#### **Frontend (Next.js):**
- [ ] Create Admin portal layout with navigation
- [ ] Build authentication pages:
  - Admin login page
  - Forgot password page
  - Profile page with reset password
- [ ] Create Sub-Admin User Management page
- [ ] Build sub-admin list table with:
  - Pagination, search, sorting, filters
  - Columns: Name, Email, Created Date, Status, Actions
- [ ] Create Add/Edit Sub-Admin modal/form:
  - First Name, Last Name, Email
  - Module Access section with granular permissions:
    - List all admin panel modules
    - For each module: View, Add, Edit, Deactivate, Reactivate checkboxes
    - Implement auto-selection for dependent modules
  - Status toggle
  - Submit button
- [ ] Create permission matrix UI component (reusable)

#### **Backend (Node.js):**
- [ ] Create admin-specific routes
- [ ] Implement sub-admin creation with module access
- [ ] Create module dependency mapping
- [ ] Implement permission validation middleware

#### **API Endpoints to Build:**
35. **GET /api/admin/sub-admins** - Get sub-admins list
    - Input: JWT token, query params
    - Output: Paginated list of sub-admins
    - Access: Admin only

36. **POST /api/admin/sub-admins** - Create sub-admin user
    - Input: firstName, lastName, email, moduleAccess
    - Output: Created sub-admin data
    - Action: Generate password, send email
    - Access: Admin only

37. **GET /api/admin/sub-admins/:userId** - Get sub-admin details
    - Input: userId
    - Output: Sub-admin details with permissions
    - Access: Admin only

38. **PUT /api/admin/sub-admins/:userId** - Update sub-admin
    - Input: userId, firstName, lastName, moduleAccess, status
    - Output: Updated sub-admin data
    - Access: Admin only

39. **PATCH /api/admin/sub-admins/:userId/status** - Toggle sub-admin status
    - Input: userId, status
    - Output: Success message
    - Access: Admin only

40. **GET /api/admin/modules** - Get all admin modules list
    - Output: List of all modules with dependencies
    - Access: Admin only

---

### **DAY 22-23 - Admin Panel - Buyer Management**

#### **Frontend (Next.js):**
- [ ] Create Buyer Management page (similar to MAN User version)
- [ ] Build buyers list table with all features
- [ ] Create Add/Edit Buyer form with company info (8-10 fields)
- [ ] Implement export to spreadsheet functionality
- [ ] Add buyer details view

#### **Backend (Node.js):**
- [ ] Implement admin buyer management (similar to MAN user)
- [ ] Add admin-specific validation and access control

#### **API Endpoints to Build:**
41. **GET /api/admin/buyers** - Get buyers list
    - Input: JWT token, query params
    - Output: Paginated list of buyers
    - Access: Admin/Sub-Admin with permission

42. **POST /api/admin/buyers** - Create buyer account
    - Input: name, email, companyInfo
    - Output: Created buyer data
    - Action: Create account, generate password, send email
    - Access: Admin/Sub-Admin with permission

43. **GET /api/admin/buyers/:buyerId** - Get buyer details
    - Input: buyerId
    - Output: Buyer details
    - Access: Admin/Sub-Admin with permission

44. **PUT /api/admin/buyers/:buyerId** - Update buyer
    - Input: buyerId, updates
    - Output: Updated buyer data
    - Access: Admin/Sub-Admin with permission

45. **PATCH /api/admin/buyers/:buyerId/status** - Toggle buyer status
    - Input: buyerId, status
    - Output: Success message
    - Access: Admin/Sub-Admin with permission

46. **GET /api/admin/buyers/export** - Export buyers list
    - Input: JWT token, filters
    - Output: Excel/CSV file
    - Access: Admin/Sub-Admin with permission

---

## PHASE 5: ADMIN PANEL - PRODUCT & INVENTORY MANAGEMENT

### **DAY 24-25 - Admin Panel - Product Category Master**

#### **Frontend (Next.js):**
- [ ] Create Product Category Management page
- [ ] Build categories list table with:
  - Pagination, search, sorting, filters
  - Columns: Category Name, Parent Category, Status, Actions
  - Tree view or indented display for parent-child relationships
- [ ] Create Add/Edit Category modal/form:
  - Name field (mandatory)
  - Parent Category dropdown (optional, shows all active categories)
  - Status toggle (Active/Inactive)
  - Submit button
- [ ] Implement category hierarchy visualization
- [ ] Add validation for circular dependencies

#### **Backend (Node.js):**
- [ ] Create ProductCategory model with fields:
  - name
  - parentCategoryId (reference to ProductCategory, nullable)
  - status (active/inactive)
  - createdAt, updatedAt
- [ ] Implement category hierarchy logic
- [ ] Add validation to prevent circular references

#### **API Endpoints to Build:**
47. **GET /api/admin/product-categories** - Get categories list
    - Input: JWT token, query params
    - Output: Paginated/tree list of categories
    - Access: Admin/Sub-Admin with permission

48. **POST /api/admin/product-categories** - Create category
    - Input: name, parentCategoryId (optional), status
    - Output: Created category
    - Validation: Check for duplicates, validate parent exists
    - Access: Admin/Sub-Admin with permission

49. **GET /api/admin/product-categories/:categoryId** - Get category details
    - Input: categoryId
    - Output: Category details with parent/children info
    - Access: Admin/Sub-Admin with permission

50. **PUT /api/admin/product-categories/:categoryId** - Update category
    - Input: categoryId, name, parentCategoryId, status
    - Output: Updated category
    - Validation: Prevent circular references
    - Access: Admin/Sub-Admin with permission

51. **DELETE /api/admin/product-categories/:categoryId** - Delete category (soft)
    - Input: categoryId
    - Output: Success message
    - Validation: Check if used in products, handle children
    - Access: Admin/Sub-Admin with permission

---

### **DAY 26-27 - Admin Panel - Product Master (Part 1)**

#### **Frontend (Next.js):**
- [ ] Create Product Management page
- [ ] Build products list table with:
  - Pagination, search, sorting, filters (by category, status)
  - Columns: Product Image, Name, Category, Status, Actions
- [ ] Create Add Product form (Part 1 - Basic Info):
  - Name field (mandatory)
  - Product Category dropdown (mandatory, hierarchical)
  - Product Image upload (file picker, .jpeg/.jpg/.png, mandatory)
  - Status toggle
- [ ] Implement image upload with preview
- [ ] Create image validation (format, size)

#### **Backend (Node.js):**
- [ ] Create Product model with fields:
  - name
  - categoryId (reference)
  - image (URL/path)
  - attributes (object - category-specific, 25-30 fields)
  - customFields (array of objects):
    - fieldType (textbox, dropdown, file)
    - fieldName
    - options (for dropdown)
    - value
  - status (active/inactive)
  - createdAt, updatedAt
- [ ] Setup file upload handling:
  - Install multer
  - Configure storage (local or cloud like AWS S3)
  - Create upload middleware
- [ ] Create image processing service (optional: resize, optimize)

#### **API Endpoints to Build:**
52. **POST /api/admin/products/upload-image** - Upload product image
    - Input: image file
    - Output: Image URL/path
    - Validation: File type, size
    - Access: Admin/Sub-Admin with permission

53. **POST /api/admin/products** - Create product (basic info only for now)
    - Input: name, categoryId, image, status
    - Output: Created product
    - Access: Admin/Sub-Admin with permission

54. **GET /api/admin/products** - Get products list
    - Input: JWT token, query params
    - Output: Paginated products list
    - Access: Admin/Sub-Admin with permission

55. **GET /api/admin/products/:productId** - Get product details
    - Input: productId
    - Output: Complete product details
    - Access: Admin/Sub-Admin with permission

---

### **DAY 28 - Admin Panel - Product Master (Part 2 - Attributes)**

#### **Frontend (Next.js):**
- [ ] Enhance Add/Edit Product form with:
  - Product Attributes section (category-based, dynamic):
    - Load attributes based on selected category
    - Create 25-30 attribute fields (textbox/file-picker mix)
    - Examples: Weight, Dimensions, Color, Material, Manufacturer, etc.
  - Custom Fields section:
    - Add Custom Field button
    - For each custom field:
      - Field Type selector (Textbox, Dropdown, File-picker)
      - Field Name input
      - For Dropdown: Options input (comma-separated or dynamic add)
    - Remove custom field button
  - Save button
- [ ] Implement dynamic form generation based on category
- [ ] Create custom field builder component

#### **Backend (Node.js):**
- [ ] Create category-attribute mapping (can be static config or database-driven)
- [ ] Implement product creation with attributes and custom fields
- [ ] Add validation for required attributes

#### **API Endpoints to Build:**
56. **GET /api/admin/product-categories/:categoryId/attributes** - Get category attributes
    - Input: categoryId
    - Output: List of attribute fields for that category
    - Access: Admin/Sub-Admin with permission

57. **PUT /api/admin/products/:productId** - Update product (with attributes & custom fields)
    - Input: productId, name, categoryId, image, attributes, customFields, status
    - Output: Updated product
    - Access: Admin/Sub-Admin with permission

---

### **DAY 29 - Admin Panel - Port & Warehouse Masters**

#### **Frontend (Next.js):**
- [ ] Create Port Management page
- [ ] Build ports list table with pagination, search, sorting
- [ ] Create Add/Edit Port form:
  - Name (mandatory)
  - Country, State, City (cascading dropdowns)
  - Status toggle
- [ ] Create Warehouse Management page
- [ ] Build warehouses list table
- [ ] Create Add/Edit Warehouse form:
  - Name (mandatory)
  - Country, State, City (cascading dropdowns)
  - Status toggle
- [ ] Reuse location selector component

#### **Backend (Node.js):**
- [ ] Create Port model with fields:
  - name, country, state, city
  - status (active/inactive)
  - createdAt, updatedAt
- [ ] Create Warehouse model with fields:
  - name, country, state, city
  - status (active/inactive)
  - createdAt, updatedAt

#### **API Endpoints to Build:**
58. **GET /api/admin/ports** - Get ports list
    - Input: JWT token, query params
    - Output: Paginated ports list
    - Access: Admin/Sub-Admin with permission

59. **POST /api/admin/ports** - Create port
    - Input: name, country, state, city, status
    - Output: Created port
    - Access: Admin/Sub-Admin with permission

60. **PUT /api/admin/ports/:portId** - Update port
    - Input: portId, updates
    - Output: Updated port
    - Access: Admin/Sub-Admin with permission

61. **GET /api/admin/warehouses** - Get warehouses list
    - Input: JWT token, query params
    - Output: Paginated warehouses list
    - Access: Admin/Sub-Admin with permission

62. **POST /api/admin/warehouses** - Create warehouse
    - Input: name, country, state, city, status
    - Output: Created warehouse
    - Access: Admin/Sub-Admin with permission

63. **PUT /api/admin/warehouses/:warehouseId** - Update warehouse
    - Input: warehouseId, updates
    - Output: Updated warehouse
    - Access: Admin/Sub-Admin with permission

---

### **DAY 30-31 - Admin Panel - Warehouse Stock Management**

#### **Frontend (Next.js):**
- [ ] Create Warehouse Stock Management page
- [ ] Build warehouse products list table with:
  - Pagination, search, sorting, filters (by warehouse, product)
  - Columns: Product, Warehouse, Quantity, Unit, Restock Alert Level, Status, Actions
- [ ] Create Add Product to Warehouse form:
  - Select Product dropdown (from Product Master, active only)
  - Quantity input (numeric)
  - Unit dropdown (Litre, tons, kg, pieces, etc.)
  - Warehouse dropdown (multi-select to add same product to multiple warehouses)
  - Restock Alert Level input (numeric)
  - Status toggle
  - Save button
- [ ] Create stock details view showing:
  - Current quantity
  - Restock alert threshold
  - Manual adjustment option
- [ ] Build low stock alerts notification component

#### **Backend (Node.js):**
- [ ] Create WarehouseStock model with fields:
  - productId (reference)
  - warehouseId (reference)
  - quantity
  - unit (enum: litre, ton, kg, piece, etc.)
  - restockAlertLevel
  - status (active/inactive)
  - lastRestockedAt
  - createdAt, updatedAt
- [ ] Implement stock addition logic
- [ ] Implement automated quantity change on PO status updates
- [ ] Create low stock alert service
- [ ] Create manual stock adjustment logic

#### **API Endpoints to Build:**
64. **GET /api/admin/warehouse-stock** - Get warehouse stock list
    - Input: JWT token, query params
    - Output: Paginated warehouse stock list
    - Access: Admin/Sub-Admin with permission

65. **POST /api/admin/warehouse-stock** - Add product to warehouse(s)
    - Input: productId, warehouses[] (array of {warehouseId, quantity, unit}), restockAlertLevel, status
    - Output: Created warehouse stock records
    - Access: Admin/Sub-Admin with permission

66. **GET /api/admin/warehouse-stock/:stockId** - Get stock details
    - Input: stockId
    - Output: Stock details
    - Access: Admin/Sub-Admin with permission

67. **PUT /api/admin/warehouse-stock/:stockId** - Update stock
    - Input: stockId, quantity, unit, restockAlertLevel, status
    - Output: Updated stock
    - Access: Admin/Sub-Admin with permission

68. **PUT /api/admin/warehouse-stock/:stockId/adjust** - Manual stock adjustment
    - Input: stockId, quantityChange (+ or -)
    - Output: Updated stock
    - Action: Add to audit log
    - Access: Admin/Sub-Admin with permission

69. **GET /api/admin/warehouse-stock/low-stock-alerts** - Get low stock products
    - Input: JWT token
    - Output: List of products below restock alert level
    - Access: Admin/Sub-Admin with permission

---

### **DAY 32 - Admin Panel - Inventory Reports**

#### **Frontend (Next.js):**
- [ ] Create Admin Real-Time Inventory Report page
- [ ] Build inventory report table (similar to MAN user version)
- [ ] Create Admin Warehouse-wise Products Report page
- [ ] Build warehouse stock report table
- [ ] Add export functionality for both reports
- [ ] Add filtering options

#### **Backend (Node.js):**
- [ ] Create admin inventory report services (similar to MAN user)
- [ ] Implement export functionality

#### **API Endpoints to Build:**
70. **GET /api/admin/reports/inventory** - Admin real-time inventory report
    - Input: JWT token, filters
    - Output: Inventory report data
    - Access: Admin/Sub-Admin with permission

71. **GET /api/admin/reports/warehouse-stock** - Admin warehouse-wise report
    - Input: JWT token, filters
    - Output: Warehouse stock report data
    - Access: Admin/Sub-Admin with permission

---

## PHASE 6: ADMIN PANEL - DASHBOARD & QUERIES

### **DAY 33-34 - Admin Dashboard**

#### **Frontend (Next.js):**
- [ ] Create Admin Dashboard page
- [ ] Build dashboard widgets showing:
  - **Total Buyers in System** (clickable, links to buyers list)
  - **Total Orders This Week/Month/Year** (labels with counts)
  - **Buyers with Most Orders** (list with buyer names and order counts)
  - **Low Stock Products** (list, clickable to product details)
  - **Most Ordered Product** (clickable to product details)
  - **Least Ordered Product** (clickable to product details)
- [ ] Create stat cards/widgets components
- [ ] Implement data visualization (charts/graphs - optional but recommended)
- [ ] Add date range selectors for time-based stats
- [ ] Create responsive grid layout

#### **Backend (Node.js):**
- [ ] Create dashboard statistics aggregation services
- [ ] Implement efficient queries for large datasets

#### **API Endpoints to Build:**
72. **GET /api/admin/dashboard/stats** - Get dashboard statistics
    - Input: JWT token, timePeriod (week/month/year)
    - Output: Object containing:
      - totalBuyers (count)
      - ordersThisWeek (count)
      - ordersThisMonth (count)
      - ordersThisYear (count)
      - buyersWithMostOrders (array of {buyerId, buyerName, orderCount})
      - lowStockProducts (array of products below alert level)
      - mostOrderedProduct (object with product details and count)
      - leastOrderedProduct (object with product details and count)
    - Access: Admin/Sub-Admin with permission

---

### **DAY 35 - Contact Us Queries Management**

#### **Frontend (Next.js):**
- [ ] Create Contact Us Queries Management page
- [ ] Build queries list table with:
  - Pagination, search, sorting, filters (by status, date)
  - Columns: User Name, Email, Message Preview, Date Submitted, Status, Actions
- [ ] Create query details modal/view showing:
  - User name, email
  - Full message
  - Submission date/time
  - User details (if logged in user submitted)
  - Close Query button
- [ ] Implement query status management (Open/Closed)
- [ ] Add notes that admin can close query after resolving outside system

#### **Backend (Node.js):**
- [ ] Implement query status update
- [ ] Send email notification to admin when new query submitted
- [ ] Send notification when query closed

#### **API Endpoints to Build:**
73. **GET /api/admin/contact-queries** - Get contact queries list
    - Input: JWT token, query params
    - Output: Paginated queries list
    - Access: Admin/Sub-Admin with permission

74. **GET /api/admin/contact-queries/:queryId** - Get query details
    - Input: queryId
    - Output: Complete query details
    - Access: Admin/Sub-Admin with permission

75. **PATCH /api/admin/contact-queries/:queryId/close** - Close query
    - Input: queryId
    - Output: Success message
    - Action: Update status to closed
    - Access: Admin/Sub-Admin with permission

---

## PHASE 7: CONTENT MANAGEMENT & NOTIFICATIONS

### **DAY 36-37 - Content Manager**

#### **Frontend (Next.js):**
- [ ] Create Content Manager page
- [ ] Build tabbed interface for content pages:
  - About Us tab
  - Terms & Conditions tab
  - Privacy Policy tab
  - FAQ tab
- [ ] Integrate rich text editor (TinyMCE, Quill, or Draft.js)
- [ ] Create content editing form for each page:
  - Title field
  - Content editor (rich text)
  - Preview option
  - Save button
- [ ] Add content preview before saving
- [ ] Implement autosave functionality (optional)

#### **Backend (Node.js):**
- [ ] Create content update APIs
- [ ] Implement versioning (optional - for content history)
- [ ] Add validation for required fields

#### **API Endpoints to Build:**
76. **GET /api/admin/content/:pageType** - Get content page for editing
    - Input: pageType (about_us, terms, privacy, faq)
    - Output: Page content with title
    - Access: Admin/Sub-Admin with permission

77. **PUT /api/admin/content/:pageType** - Update content page
    - Input: pageType, title, content
    - Output: Updated page
    - Access: Admin/Sub-Admin with permission

---

### **DAY 38 - Email Notifications Setup**

#### **Frontend (Next.js):**
- [ ] No specific UI needed (backend-focused day)
- [ ] Create email templates as React components (for email rendering)
- [ ] Setup email preview functionality (optional - for admin to preview)

#### **Backend (Node.js):**
- [ ] Setup email service properly (Nodemailer with Gmail/SendGrid/AWS SES)
- [ ] Create email templates for all notification types:
  - **Buyer:**
    - Account created
    - Forgot password (OTP)
    - PO status updated
  - **MAN User:**
    - Account created
    - Forgot password
    - New PO generated
  - **Admin:**
    - Forgot password
    - Query raised by user (Contact Us)
    - Contact Us query closed
    - Low product stock alert
- [ ] Create email sending service with template support
- [ ] Implement email queue (optional but recommended - using Bull or similar)
- [ ] Add email logging to EmailLogs model
- [ ] Test all email notifications

#### **API Endpoints to Build:**
None (backend service updates)

**Email Notification Implementation Checklist:**
- [ ] Buyer account created → Send credentials email
- [ ] MAN sub-user created → Send credentials email
- [ ] Admin sub-admin created → Send credentials email
- [ ] Forgot password requested → Send OTP email
- [ ] PO status changed → Notify buyer
- [ ] New PO created by buyer/admin → Notify MAN user
- [ ] Contact query submitted → Notify admin
- [ ] Low stock alert triggered → Notify admin

---

### **DAY 39 - Testing & Integration**

#### **Frontend (Next.js):**
- [ ] Complete end-to-end testing for all three portals
- [ ] Test all user flows:
  - Buyer: Login → View POs → View content pages → Contact
  - MAN User: Login → Manage buyers → Create PO → Update status → View reports
  - Admin: Login → Manage all entities → View dashboard → Manage content
- [ ] Test role-based access control
- [ ] Test responsive design on all devices
- [ ] Test cross-browser compatibility
- [ ] Fix UI/UX issues
- [ ] Optimize performance (lazy loading, code splitting)

#### **Backend (Node.js):**
- [ ] Complete API testing for all endpoints
- [ ] Test authentication and authorization
- [ ] Test data validation and error handling
- [ ] Test email notifications
- [ ] Test file uploads
- [ ] Test database queries performance
- [ ] Add database indexing for frequently queried fields
- [ ] Test edge cases and error scenarios
- [ ] Fix all bugs

#### **API Endpoints to Build:**
None (testing day)

---

## PHASE 8: FINAL POLISH & DEPLOYMENT PREPARATION

### **DAY 40 - Security, Optimization & Documentation**

#### **Frontend (Next.js):**
- [ ] Implement security best practices:
  - XSS protection
  - CSRF protection
  - Input sanitization
  - Secure token storage
- [ ] Optimize bundle size
- [ ] Implement caching strategies
- [ ] Add loading states and error boundaries
- [ ] Implement analytics (optional)
- [ ] Create user documentation/help text

#### **Backend (Node.js):**
- [ ] Implement security best practices:
  - Rate limiting
  - Input validation and sanitization
  - SQL injection prevention (using Mongoose properly)
  - Helmet.js configuration
  - CORS configuration
- [ ] Implement API rate limiting
- [ ] Add request logging
- [ ] Setup error tracking (Sentry or similar - optional)
- [ ] Create API documentation (Swagger/Postman collection)
- [ ] Database optimization:
  - Add indexes
  - Optimize queries
  - Setup database backup strategy
- [ ] Environment configuration for production
- [ ] Create deployment checklist

#### **Documentation to Create:**
- [ ] API documentation (all 77 endpoints)
- [ ] Database schema documentation
- [ ] Deployment guide
- [ ] Environment variables guide
- [ ] Admin user manual
- [ ] Developer setup guide

---

### **DAY 41-42 - Pre-Deployment Testing & Fixes**

#### **Frontend (Next.js):**
- [ ] Perform comprehensive regression testing
- [ ] Test all edge cases
- [ ] User acceptance testing (if possible with client)
- [ ] Fix critical bugs
- [ ] Optimize performance bottlenecks
- [ ] Test production build locally
- [ ] Create build scripts

#### **Backend (Node.js):**
- [ ] Load testing (test with large datasets)
- [ ] Security audit
- [ ] Test backup and restore procedures
- [ ] Test deployment scripts
- [ ] Fix critical bugs
- [ ] Create database seeders for initial data
- [ ] Test production configuration

---

### **DAY 43 - Deployment & Go-Live**

#### **Frontend (Next.js):**
- [ ] Build production bundle
- [ ] Deploy to hosting platform (Vercel/Netlify/AWS)
- [ ] Setup custom domain
- [ ] Configure CDN
- [ ] Test live deployment
- [ ] Monitor for errors

#### **Backend (Node.js):**
- [ ] Deploy to production server (AWS EC2/Heroku/DigitalOcean)
- [ ] Setup production database (MongoDB Atlas or self-hosted)
- [ ] Configure environment variables
- [ ] Setup SSL certificates
- [ ] Configure email service
- [ ] Setup monitoring and logging
- [ ] Test all APIs on production
- [ ] Create initial admin user
- [ ] Test end-to-end flows on production

#### **Post-Deployment:**
- [ ] Smoke testing on live environment
- [ ] Monitor logs for errors
- [ ] Setup automated backups
- [ ] Provide access to client
- [ ] Hand over documentation
- [ ] Training session (if required)

---

# API ENDPOINTS COMPLETE LIST (77 Total)

## Authentication APIs (5)
1. POST /api/auth/login
2. POST /api/auth/forgot-password
3. POST /api/auth/verify-otp
4. POST /api/auth/reset-password
5. POST /api/auth/logout

## Profile APIs (3)
6. GET /api/locations/countries
7. GET /api/locations/states/:countryId
8. GET /api/locations/cities/:stateId
9. GET /api/profile
10. PUT /api/profile
11. PUT /api/profile/reset-password

## Content & Contact APIs (2)
12. GET /api/content/:pageType
13. POST /api/contact

## Buyer Portal APIs (2)
14. GET /api/buyer/purchase-orders
15. GET /api/buyer/purchase-orders/:poId

## MAN User - Sub-Users APIs (5)
16. GET /api/man-user/sub-users
17. POST /api/man-user/sub-users
18. GET /api/man-user/sub-users/:userId
19. PUT /api/man-user/sub-users/:userId
20. PATCH /api/man-user/sub-users/:userId/status

## MAN User - Buyers APIs (6)
21. GET /api/man-user/buyers
22. POST /api/man-user/buyers
23. GET /api/man-user/buyers/:buyerId
24. PUT /api/man-user/buyers/:buyerId
25. PATCH /api/man-user/buyers/:buyerId/status
26. GET /api/man-user/buyers/export

## MAN User - Orders APIs (6)
27. GET /api/man-user/purchase-orders
28. POST /api/man-user/purchase-orders
29. GET /api/man-user/purchase-orders/:poId
30. PUT /api/man-user/purchase-orders/:poId/status
31. GET /api/public/purchase-orders/:poId/qr
32. GET /api/man-user/purchase-orders/:poId/qr-code

## MAN User - Reports APIs (2)
33. GET /api/man-user/reports/inventory
34. GET /api/man-user/reports/warehouse-stock

## Admin - Sub-Admins APIs (6)
35. GET /api/admin/sub-admins
36. POST /api/admin/sub-admins
37. GET /api/admin/sub-admins/:userId
38. PUT /api/admin/sub-admins/:userId
39. PATCH /api/admin/sub-admins/:userId/status
40. GET /api/admin/modules

## Admin - Buyers APIs (6)
41. GET /api/admin/buyers
42. POST /api/admin/buyers
43. GET /api/admin/buyers/:buyerId
44. PUT /api/admin/buyers/:buyerId
45. PATCH /api/admin/buyers/:buyerId/status
46. GET /api/admin/buyers/export

## Admin - Product Categories APIs (5)
47. GET /api/admin/product-categories
48. POST /api/admin/product-categories
49. GET /api/admin/product-categories/:categoryId
50. PUT /api/admin/product-categories/:categoryId
51. DELETE /api/admin/product-categories/:categoryId

## Admin - Products APIs (6)
52. POST /api/admin/products/upload-image
53. POST /api/admin/products
54. GET /api/admin/products
55. GET /api/admin/products/:productId
56. GET /api/admin/product-categories/:categoryId/attributes
57. PUT /api/admin/products/:productId

## Admin - Ports APIs (3)
58. GET /api/admin/ports
59. POST /api/admin/ports
60. PUT /api/admin/ports/:portId

## Admin - Warehouses APIs (3)
61. GET /api/admin/warehouses
62. POST /api/admin/warehouses
63. PUT /api/admin/warehouses/:warehouseId

## Admin - Warehouse Stock APIs (6)
64. GET /api/admin/warehouse-stock
65. POST /api/admin/warehouse-stock
66. GET /api/admin/warehouse-stock/:stockId
67. PUT /api/admin/warehouse-stock/:stockId
68. PUT /api/admin/warehouse-stock/:stockId/adjust
69. GET /api/admin/warehouse-stock/low-stock-alerts

## Admin - Reports APIs (2)
70. GET /api/admin/reports/inventory
71. GET /api/admin/reports/warehouse-stock

## Admin - Dashboard APIs (1)
72. GET /api/admin/dashboard/stats

## Admin - Contact Queries APIs (3)
73. GET /api/admin/contact-queries
74. GET /api/admin/contact-queries/:queryId
75. PATCH /api/admin/contact-queries/:queryId/close

## Admin - Content Management APIs (2)
76. GET /api/admin/content/:pageType
77. PUT /api/admin/content/:pageType

---

# DATABASE MODELS (11 Total)

1. **Users** - All users (buyers, MAN users, admins, sub-users)
2. **Buyers** - Buyer profile with company information
3. **Products** - Product catalog with attributes
4. **ProductCategories** - Product categories (hierarchical)
5. **PurchaseOrders** - Purchase orders with products and status
6. **Warehouses** - Warehouse locations
7. **Ports** - Port locations
8. **WarehouseStock** - Stock management per warehouse
9. **ContactQueries** - Contact form submissions
10. **ContentPages** - CMS pages (About, T&C, Privacy, FAQ)
11. **EmailLogs** - Email notification logs

---

# IMPORTANT DEVELOPMENT NOTES

## Dependencies Between Modules

1. **Products depend on ProductCategories** - Create categories first
2. **Warehouse Stock depends on Products and Warehouses** - Create both first
3. **Purchase Orders depend on Products and Buyers** - Create both first
4. **Sub-users depend on Users** - User authentication must be working
5. **Reports depend on Orders and Warehouse Stock** - Create data first for testing

## Critical Features

1. **Role-Based Access Control (RBAC)**
   - Implement early and test thoroughly
   - Sub-admins and MAN sub-users have granular permissions
   - Module-level permissions with CRUD operations

2. **Automated Warehouse Stock Updates**
   - When PO status = "Received into Warehouse" → Increase stock
   - When PO status = "Dispatched from Warehouse" → Decrease stock
   - Test this thoroughly with various scenarios

3. **QR Code Generation**
   - Each PO gets unique QR code
   - QR code links to public read-only PO view
   - Downloadable as PNG

4. **Email Notifications**
   - 11 different email types
   - Use templates for consistency
   - Log all sent emails
   - Test deliverability

5. **Low Stock Alerts**
   - Automatic alerts when stock < restock alert level
   - Show in dashboard
   - Email notification to admin

## Testing Strategy

1. **Unit Testing** - Test individual functions and components
2. **Integration Testing** - Test API endpoints and database interactions
3. **E2E Testing** - Test complete user flows
4. **Security Testing** - Test authentication, authorization, input validation
5. **Performance Testing** - Test with large datasets
6. **User Acceptance Testing** - Get client feedback

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database backup strategy in place
- [ ] SSL certificates installed
- [ ] Email service configured and tested
- [ ] Third-party API keys configured (Country/State/City API)
- [ ] File upload storage configured (local or cloud)
- [ ] Monitoring and logging setup
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Admin user created
- [ ] Documentation handed over

---

# RECOMMENDED TECH STACK DETAILS

## Frontend
- **Framework:** Next.js 14+ (with App Router)
- **Language:** TypeScript
- **UI Library:** Material-UI or Tailwind CSS + Headless UI
- **Forms:** React Hook Form + Zod
- **State Management:** React Query + Context API
- **HTTP Client:** Axios
- **Rich Text Editor:** TinyMCE or Quill
- **Tables:** TanStack Table (React Table)
- **Date Picker:** React DatePicker
- **File Upload:** React Dropzone
- **Charts (optional):** Recharts or Chart.js

## Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript (recommended) or JavaScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** Express Validator
- **File Upload:** Multer
- **Email:** Nodemailer
- **QR Code:** qrcode or qr-image
- **Excel Export:** xlsx or exceljs
- **Security:** Helmet, cors, express-rate-limit
- **Logging:** Winston or Morgan
- **Environment:** dotenv

## Database
- **Primary:** MongoDB (local or MongoDB Atlas)
- **ORM:** Mongoose

## Third-Party Services
- **Location Data:** CountryStateCity API or Geonames
- **Email Service:** SendGrid, AWS SES, or Gmail SMTP
- **File Storage:** Local filesystem or AWS S3/Cloudinary
- **Deployment:** 
  - Frontend: Vercel or Netlify
  - Backend: AWS EC2, Heroku, or DigitalOcean

---

# DEVELOPER TIPS

1. **Start with Authentication** - Get login/logout working first for all roles
2. **Build Reusable Components** - Create shared components early (tables, forms, modals)
3. **Use TypeScript** - Type safety will save debugging time
4. **API Response Format** - Standardize API responses (success, error formats)
5. **Error Handling** - Implement global error handling early
6. **Validation** - Validate on both frontend and backend
7. **Git Workflow** - Commit frequently, use meaningful commit messages
8. **Testing** - Write tests as you develop, not at the end
9. **Documentation** - Document as you build (API endpoints, components)
10. **Code Review** - Review your own code before moving to next task

---

# WHAT NOT TO BUILD (Out of Scope)

Based on the Excel file, DO NOT build:
- ❌ Text/SMS notifications
- ❌ Browser push notifications
- ❌ Multi-language support (English only)
- ❌ Multi-currency support
- ❌ Payment gateway integration
- ❌ Chat/messaging system
- ❌ Advanced analytics/BI dashboards
- ❌ Mobile app
- ❌ Real-time collaboration features
- ❌ Custom email template builder (use default templates)

---

# EXPECTED PROJECT STRUCTURE

## Frontend (Next.js)
```
tsatsaku-frontend/
├── public/
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── forgot-password/
│   │   ├── buyer/
│   │   │   ├── dashboard/
│   │   │   ├── purchase-orders/
│   │   │   ├── profile/
│   │   │   └── layout.tsx
│   │   ├── man-user/
│   │   │   ├── dashboard/
│   │   │   ├── buyers/
│   │   │   ├── orders/
│   │   │   ├── sub-users/
│   │   │   ├── reports/
│   │   │   └── layout.tsx
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── buyers/
│   │   │   ├── sub-admins/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── warehouses/
│   │   │   ├── stock/
│   │   │   ├── reports/
│   │   │   ├── content/
│   │   │   └── layout.tsx
│   │   ├── (public)/
│   │   │   ├── about/
│   │   │   ├── terms/
│   │   │   ├── privacy/
│   │   │   ├── faq/
│   │   │   └── contact/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── shared/
│   │   ├── buyer/
│   │   ├── man-user/
│   │   └── admin/
│   ├── lib/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── types/
│   └── constants/
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Backend (Node.js)
```
tsatsaku-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── email.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Buyer.js
│   │   ├── Product.js
│   │   ├── ProductCategory.js
│   │   ├── PurchaseOrder.js
│   │   ├── Warehouse.js
│   │   ├── Port.js
│   │   ├── WarehouseStock.js
│   │   ├── ContactQuery.js
│   │   └── ContentPage.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── buyerController.js
│   │   ├── manUserController.js
│   │   ├── adminController.js
│   │   └── publicController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── buyer.js
│   │   ├── manUser.js
│   │   ├── admin.js
│   │   └── public.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rbac.js
│   │   ├── validation.js
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── qrService.js
│   │   ├── exportService.js
│   │   ├── locationService.js
│   │   └── stockService.js
│   ├── utils/
│   │   ├── generatePassword.js
│   │   ├── tokenUtils.js
│   │   └── helpers.js
│   ├── validators/
│   │   └── schemas.js
│   └── app.js
├── uploads/
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# QUICK START GUIDE

## Day 1 Morning (2 hours)
1. Create project folders
2. Initialize Next.js project
3. Initialize Node.js project
4. Install dependencies (both frontend and backend)
5. Setup Git repository
6. Create .env files

## Day 1 Afternoon (2-3 hours)
1. Setup MongoDB connection
2. Create folder structures
3. Design database schemas on paper/diagram
4. Create initial models in code
5. Test database connection

**End of Day 1:** You should have both projects initialized, dependencies installed, and database connected.

---

This plan is designed to keep you on track and avoid getting stuck. Follow it day by day, and you'll successfully complete the Tsatsaku Web Application!

**Remember:**
- Work in small, testable increments
- Test each feature before moving to the next
- Commit your code frequently
- Ask for clarification if any requirement is unclear
- Don't add features not mentioned in the Excel file

Good luck with your development! 🚀
