# Testing All 3 User Roles - Comprehensive Guide

## Overview
This guide provides step-by-step instructions for testing the Tsatsaku platform with all 3 user roles: **Admin**, **MAN_User**, and **Buyer**. Each role has distinct dashboard layouts, features, and permissions.

---

## STEP 1: Database & Backend Setup

### 1.1 Start MongoDB
Ensure MongoDB is running on your system:
```bash
# If using MongoDB Community with Windows Service
net start MongoDB

# OR if using docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 1.2 Seed Database with Test Users
```bash
cd E:\test\tsatsaku-backend
npm install  # if not already done
npm run seed
```

**Expected Output:**
```
Connected to MongoDB...
Admin user created/updated: admin@tsatsaku.com
Database seeded successfully!
```

### 1.3 Start Backend Server
```bash
cd E:\test\tsatsaku-backend
npm run dev
```

**Expected Output:**
```
Server running on port 5000
Connected to MongoDB at mongodb://localhost:27017/tsatsaku
```

---

## STEP 2: Frontend Setup

### 2.1 Install Dependencies & Start Frontend
```bash
cd E:\test\tsatsaku-frontend
npm install  # if not already done
npm run dev
```

**Expected Output:**
```
Local:        http://localhost:3000
```

### 2.2 Access Application
Open browser and navigate to: **http://localhost:3000**

--------------------------------

Admin
Email: admin@tsatsaku.com
Password: Admin@123456
MAN_User
Email: man@tsatsaku.com
Password: ManUser@123
Buyer
Email: buyer@example.com
Password: Buyer@123
---------------------------------

## STEP 3: Testing Admin User Dashboard

### Test Credentials
- **Email:** `admin@tsatsaku.com`
- **Password:** `Admin@123456`
- **Role:** `admin` (Full system access)

### 3.1 Login Test
1. Click **Login** button on home page
2. Enter email: `admin@tsatsaku.com`
3. Enter password: `Admin@123456`
4. Click **Sign In**

**Expected Result:** 
- Redirected to `/admin/dashboard`
- Admin navigation menu visible with all sections

### 3.2 Admin Navigation Menu Should Show:
```
Dashboard
├── Overview
└── Analytics

Products
├── All Products
├── Categories
├── Brands
└── Add Product

Inventory
├── Ports
├── Warehouses
├── Stock Management
└── Stock History

Management
├── Buyers
├── Purchase Orders
├── Contact Queries
└── Email Logs

Content
├── Pages
├── Settings
└── Configuration

Reports
├── Sales Reports
├── Inventory Reports
├── User Activity
└── Email Performance
```

### 3.3 Dashboard Overview Test
**Path:** `/admin/dashboard`

**Check These Statistics Cards:**
- [ ] Total Users (count should be displayed)
- [ ] Active Users (green badge)
- [ ] Total Buyers (count should be displayed)
- [ ] Active Buyers (count)
- [ ] Total Products (count)
- [ ] Low Stock Products (alert count)
- [ ] Total Ports (count)
- [ ] Total Warehouses (count)
- [ ] Pending Purchase Orders (count)
- [ ] Total Revenue (this month)
- [ ] Recent Activities (list of last 10 actions)
- [ ] Growth Metrics (comparison vs last month)

**Test Action:** Click on each card - should show detailed view or filter page

### 3.4 Products Section Test
**Path:** `/admin/products`

**Test Features:**
1. **View All Products:**
   - [ ] Products list displays with pagination
   - [ ] Each product shows: Image, SKU, Category, Price, Status
   - [ ] Pagination shows "10 items per page"

2. **Search Functionality:**
   - [ ] Enter product name in search box
   - [ ] List filters in real-time
   - [ ] Clear search to reset

3. **Filter Tests:**
   - [ ] Filter by Category dropdown
   - [ ] Filter by Status (Active/Draft/Inactive)
   - [ ] Filter by Brand
   - [ ] Filter by Featured (Yes/No)
   - [ ] Combine multiple filters

4. **Statistics:**
   - [ ] "Total Products" card shows count
   - [ ] "Active" card shows active product count
   - [ ] "Draft" card shows draft count
   - [ ] "Inactive" card shows inactive count
   - [ ] "Featured" card shows featured product count

5. **Bulk Operations:**
   - [ ] Select multiple products using checkboxes
   - [ ] Click "Bulk Update Status" button
   - [ ] Change all selected products to "Inactive"
   - [ ] Confirm change - products should show new status

6. **Product Actions:**
   - [ ] Click "View" on a product - opens detail page
   - [ ] Click "Edit" on a product - opens edit form
   - [ ] Click "Delete" on a product - shows confirmation
   - [ ] Confirm delete - product status changes to "Inactive"

### 3.5 Ports Management Test
**Path:** `/admin/ports`

**Test Features:**
- [ ] View all ports list
- [ ] Click "Add Port" button
- [ ] Fill form: Name, Code (unique), Type (Sea/Air/Land), Address, Contact
- [ ] Submit - port should appear in list
- [ ] Click Edit on a port
- [ ] Modify details and save
- [ ] Click Delete - port becomes inactive

### 3.6 Warehouses Management Test
**Path:** `/admin/warehouses`

**Test Features:**
- [ ] View all warehouses list
- [ ] Click "Add Warehouse" button
- [ ] Fill form: Code (unique), Address, Contact Person, Capacity, Hours
- [ ] Submit - warehouse should appear in list
- [ ] Test Edit: Modify warehouse details
- [ ] Test Delete: Warehouse becomes inactive

### 3.7 Warehouse Stock Management Test
**Path:** `/admin/warehouse-stock`

**Test Features:**
1. **View Stock:**
   - [ ] Display all warehouse stock levels
   - [ ] Show Product, Warehouse, Current Quantity, Restock Alert

2. **Stock Operations:**
   - [ ] Click "Stock In" - add quantity with reference
   - [ ] Click "Stock Out" - reduce quantity with reference
   - [ ] Click "Adjust" - adjust inventory with reason
   - [ ] Verify quantity updates in real-time

3. **Low Stock Alerts:**
   - [ ] Products below restock alert threshold highlighted
   - [ ] Alert badge shows count of low-stock items
   - [ ] Filter by "Low Stock Only"

4. **Stock History:**
   - [ ] Click "History" on a stock item
   - [ ] Shows all stock movements
   - [ ] Each entry shows: Date, Type (In/Out/Adjust), Quantity, Reference, User

### 3.8 Contact Queries Management Test
**Path:** `/admin/contact-queries`

**Test Features:**
- [ ] View all submitted contact forms
- [ ] Filter by Status (New/Contacted/Resolved/Spam)
- [ ] Click a query to view details
- [ ] Update status: New → Contacted
- [ ] Add response message
- [ ] Filter by date range
- [ ] Bulk update multiple queries

### 3.9 Content Pages Management Test
**Path:** `/admin/content`

**Test Features:**
- [ ] View dynamic content pages (About Us, Terms, Privacy, FAQ)
- [ ] Click "Edit" on a page
- [ ] Modify content in editor
- [ ] Save changes
- [ ] Verify changes appear on public pages

### 3.10 Email Logs Test
**Path:** `/admin/emails`

**Test Features:**
- [ ] View all email logs
- [ ] Filter by Status (Pending/Sent/Failed)
- [ ] See email statistics: Total Sent, Failed, Pending
- [ ] Click "Resend" on failed emails
- [ ] View email delivery history

---

## STEP 4: Testing MAN_User Dashboard

### Test Credentials
- **Email:** `man@tsatsaku.com`
- **Password:** `ManUser@123`
- **Role:** `man_user` (Limited inventory & product management)

### 4.1 Login as MAN_User
1. Logout from Admin account
2. Click **Login**
3. Enter email: `man@tsatsaku.com`
4. Enter password: `ManUser@123`
5. Click **Sign In**

**Expected Result:**
- Redirected to `/dashboard` (MAN_User dashboard)
- Limited navigation menu (no admin features)

### 4.2 MAN_User Navigation Menu Should Show:
```
Dashboard
├── Overview

Products
├── All Products
└── Add Product (LIMITED - Cannot edit all fields)

Inventory
├── Ports (View Only)
├── Warehouses (View Only)
├── Stock Management
└── Stock History (View Only)

Management
├── My Account
├── Buyers (View Only)
└── Purchase Orders (View Only)
```

**NOTE:** MAN_User cannot access:
- ❌ Contact Queries
- ❌ Email Logs
- ❌ Content Management
- ❌ User Management
- ❌ System Reports

### 4.3 MAN_User Dashboard Test
**Path:** `/dashboard`

**Check These Cards:**
- [ ] My Statistics (assigned products only)
- [ ] My Products Count
- [ ] My Inventory Items
- [ ] My Recent Activities (only own actions)

### 4.4 MAN_User Products Test
**Path:** `/dashboard/products`

**Features:**
- [ ] View only own products (products assigned to this user)
- [ ] Cannot view company-wide products
- [ ] Can add new products
- [ ] Can modify only certain fields (name, price, description)
- [ ] Cannot delete products (send delete request to admin)

### 4.5 MAN_User Stock Management Test
**Path:** `/dashboard/inventory`

**Features:**
- [ ] View only stock for own products
- [ ] Can perform Stock In/Out operations
- [ ] Can view own stock history
- [ ] Cannot view port/warehouse master data (read-only)

### 4.6 MAN_User Account Test
**Path:** `/dashboard/account`

**Features:**
- [ ] View own profile information
- [ ] Edit own name, phone, address
- [ ] Change password
- [ ] View login history
- [ ] Cannot change role or email

---

## STEP 5: Testing Buyer User Dashboard

### Test Credentials
- **Email:** `buyer@example.com` (or similar buyer account)
- **Password:** `Buyer@123`
- **Role:** `buyer` (Purchase orders & order tracking only)

### 5.1 Login as Buyer
1. Logout from MAN_User account
2. Click **Login**
3. Enter email: `buyer@example.com`
4. Enter password: `Buyer@123`
5. Click **Sign In**

**Expected Result:**
- Redirected to `/buyer/dashboard`
- Simple navigation menu (only buyer features)

### 5.2 Buyer Navigation Menu Should Show:
```
Dashboard
├── My Orders
├── Order History
└── Account

Products
└── Browse Products (Read-Only)

Support
├── Contact Us
└── My Queries
```

**NOTE:** Buyer cannot access:
- ❌ Product Management
- ❌ Inventory Control
- ❌ Port/Warehouse Management
- ❌ Admin Panel
- ❌ Email Management
- ❌ Content Editing

### 5.3 Buyer Dashboard Test
**Path:** `/buyer/dashboard`

**Check These Cards:**
- [ ] My Total Orders (count)
- [ ] Pending Orders (count)
- [ ] Completed Orders (count)
- [ ] Total Spent (currency)
- [ ] Recent Orders (last 5 with details)

### 5.4 Buyer Browse Products Test
**Path:** `/buyer/products`

**Features:**
- [ ] View all active products (read-only)
- [ ] Search products
- [ ] Filter by category
- [ ] Filter by price range
- [ ] View product details
- [ ] Add products to cart
- [ ] Proceed to checkout

### 5.5 Buyer Order Management Test
**Path:** `/buyer/orders`

**Features:**
1. **Create Order:**
   - [ ] Click "Create New Order"
   - [ ] Select products from catalog
   - [ ] Set quantities
   - [ ] View unit prices
   - [ ] See total amount calculated
   - [ ] Submit order

2. **View Orders:**
   - [ ] See all submitted orders
   - [ ] Filter by Status (Pending/Confirmed/Shipped/Delivered)
   - [ ] View order date, total amount, status
   - [ ] Click order to see details

3. **Order Details:**
   - [ ] See all line items (products)
   - [ ] See item prices and quantities
   - [ ] View total amount
   - [ ] See order status history
   - [ ] If shipped: See tracking info
   - [ ] If delivered: See receipt

### 5.6 Buyer Account Test
**Path:** `/buyer/account`

**Features:**
- [ ] View profile information
- [ ] Edit name, company, phone
- [ ] Edit delivery address
- [ ] Edit billing address
- [ ] Change password
- [ ] View order history
- [ ] View wishlist (if applicable)

### 5.7 Buyer Contact Support Test
**Path:** `/buyer/support`

**Features:**
- [ ] View "Contact Us" form
- [ ] Submit inquiry: Name, Email, Subject, Message
- [ ] See confirmation message: "Your query has been submitted"
- [ ] View sent queries in "My Queries"

---

## STEP 6: Feature Access Matrix

| Feature | Admin | MAN_User | Buyer |
|---------|:-----:|:--------:|:-----:|
| Dashboard Access | ✅ | ✅ | ✅ |
| View Products | ✅ | ✅ | ✅ (Read-only) |
| Create Products | ✅ | ✅ | ❌ |
| Edit Products | ✅ | ⚠️ (Own only) | ❌ |
| Delete Products | ✅ | ⚠️ (Request only) | ❌ |
| Manage Categories | ✅ | ❌ | ❌ |
| Manage Ports | ✅ | ❌ | ❌ |
| Manage Warehouses | ✅ | ❌ | ❌ |
| Stock In/Out | ✅ | ✅ | ❌ |
| View Stock History | ✅ | ✅ (Own only) | ❌ |
| Manage Buyers | ✅ | ❌ | ❌ |
| Create Orders | ❌ | ❌ | ✅ |
| View Orders | ✅ (All) | ⚠️ (Reports) | ✅ (Own only) |
| Contact Queries | ✅ (Manage) | ❌ | ✅ (Submit) |
| Content Management | ✅ | ❌ | ❌ |
| Email Logs | ✅ | ❌ | ❌ |
| System Reports | ✅ | ❌ | ❌ |

---

## STEP 7: Complete Test Scenario (30-Minute Full Flow)

### Scenario: Complete e-commerce transaction workflow

#### **Phase 1: Admin Setup (10 minutes)**

1. **Login as Admin**
   - Use credentials: admin@tsatsaku.com / Admin@123456
   - Verify: Dashboard loads with all statistics

2. **Create Test Product**
   - Navigate to Products → Add Product
   - Fill: Name: "Test Widget", SKU: "TST-001", Category: "Electronics"
   - Set: Price: 1000, Quantity: 50
   - Save and verify in products list

3. **Verify Stock**
   - Go to Warehouse Stock
   - Verify product added with quantity 50
   - Perform Stock In: Add 20 units with reference "Initial Stock"
   - Verify history shows the transaction

4. **Check Dashboard**
   - Dashboard stats update with new product
   - "Total Products" incremented
   - "Low Stock Products" shows count if below alert threshold

#### **Phase 2: MAN_User Inventory Update (5 minutes)**

1. **Logout and Login as MAN_User**
   - Use credentials: man@tsatsaku.com / ManUser@123
   - Verify: Limited dashboard loads

2. **Stock Movement**
   - Navigate to Inventory → Stock Management
   - Find the test product
   - Perform Stock Out: Remove 5 units with reference "Customer Return"
   - Verify: Quantity changes from 70 to 65
   - Check History: Shows both In/Out transactions

#### **Phase 3: Buyer Order Creation & Tracking (10 minutes)**

1. **Logout and Login as Buyer**
   - Use credentials: buyer@example.com / Buyer@123
   - Verify: Buyer dashboard loads

2. **Browse and Create Order**
   - Navigate to Products
   - Search for "Test Widget"
   - Click product to view details
   - Click "Add to Order"
   - Set quantity: 2
   - Review summary: 2 × 1000 = 2000 total
   - Click "Create Order"
   - Verify: Confirmation message shows

3. **View Order**
   - Navigate to My Orders
   - Find newly created order
   - Click to view details
   - Verify: Shows 2 Test Widgets, total 2000
   - Status shows "Pending"

4. **Contact Support**
   - Click Contact Us
   - Submit: "When will my order ship?"
   - Verify: Confirmation message

#### **Phase 4: Admin Order Management (5 minutes)**

1. **Login as Admin**

2. **Check Contact Query**
   - Navigate to Management → Contact Queries
   - Find buyer's inquiry
   - Update status: New → Contacted
   - Add response: "Your order will ship in 2-3 business days"
   - Save

3. **View Buyer Order**
   - Navigate to Purchase Orders (or Reports)
   - Find buyer's order
   - Update status: Pending → Confirmed
   - Save

4. **Check Stock Impact**
   - Navigate to Warehouse Stock
   - Verify stock quantity decreased: 65 - 2 = 63
   - Check History: Shows order reference

**Expected Test Result:** ✅ Complete workflow without errors

---

## STEP 8: Troubleshooting

### Issue: Login fails with "Invalid Credentials"
**Solution:**
- Verify database was seeded: `npm run seed` in backend folder
- Check email and password exactly match test credentials
- Clear browser cache (Ctrl+F5)
- Check backend console for error messages

### Issue: Dashboard shows "Loading..." indefinitely
**Solution:**
- Check browser console (F12 → Console tab)
- Verify backend server is running on port 5000
- Check network tab to see if API calls are failing
- Verify MongoDB connection in backend logs

### Issue: Products page returns empty
**Solution:**
- Login as Admin and create a test product
- Check database directly:
  ```bash
  # In MongoDB shell
  use tsatsaku
  db.products.find()
  ```
- Verify product status is not "inactive"

### Issue: Stock operations show permission denied
**Solution:**
- Verify logged-in user role is correct
- MAN_User can only manage own products' stock
- Admin can manage all stock
- Check user ID matches product assignment

### Issue: Images not displaying
**Solution:**
- Verify upload folder exists: `tsatsaku-backend/uploads/`
- Check file permissions on upload folder
- Use valid image URL if using external CDN

### Issue: Email-related features not working
**Solution:**
- Email features optional in test environment
- Check .env has SMTP configuration
- Leave email features for later testing
- Focus on core inventory features first

---

## Success Criteria Checklist

### ✅ Admin User Tests Passed:
- [ ] Login successful with correct dashboard
- [ ] All navigation menu items visible
- [ ] Can create, edit, delete products
- [ ] Can manage ports and warehouses
- [ ] Can perform stock operations
- [ ] Can view all orders and buyers
- [ ] Can manage contact queries
- [ ] Dashboard statistics display correctly
- [ ] Bulk operations work
- [ ] Stock history tracks accurately

### ✅ MAN_User Tests Passed:
- [ ] Login successful with limited dashboard
- [ ] Can only see own products
- [ ] Cannot access admin features
- [ ] Can perform stock operations
- [ ] Stock history shows own transactions only
- [ ] Cannot delete products (only request)
- [ ] Account management works
- [ ] Cannot view contact queries or emails

### ✅ Buyer Tests Passed:
- [ ] Login successful with buyer dashboard
- [ ] Can browse active products only
- [ ] Can create purchase orders
- [ ] Can view own orders only
- [ ] Can submit contact queries
- [ ] Cannot access product management
- [ ] Cannot access inventory control
- [ ] Account profile works

### ✅ Workflow Tests Passed:
- [ ] Admin can create products
- [ ] MAN_User can perform stock movements
- [ ] Buyer can create orders
- [ ] Stock decreases when order created
- [ ] Stock history tracked accurately
- [ ] All data persists across transactions
- [ ] Role-based access enforced

### ✅ Data Integrity:
- [ ] No duplicate product SKUs allowed
- [ ] Stock quantities never negative
- [ ] Stock history complete audit trail
- [ ] User role changes affect dashboard immediately
- [ ] Deleted items marked inactive (not removed)

---

## Performance Notes

| Metric | Expected | Acceptable |
|--------|----------|-----------|
| Page Load | < 1s | < 2s |
| Search Filter | < 500ms | < 1s |
| Bulk Operations | < 2s | < 5s |
| Stock Update | < 500ms | < 1s |
| Dashboard Charts | < 1.5s | < 3s |
| Order Creation | < 1s | < 2s |

---

## Security Notes

⚠️ **Testing-Only Security Observations:**
- Test credentials visible in seed.js - NEVER in production
- JWT tokens expire after 24 hours
- Passwords should be minimum 8 characters in production
- API endpoints require valid JWT token
- All sensitive operations audit-logged
- Cross-role data access prevented at middleware level
- SQL injection prevented by MongoDB + ORM

---

## Next Steps After Testing

Once all tests pass successfully:

1. **Frontend Pages to Build:**
   - Ports management UI
   - Warehouses management UI
   - Stock history viewer
   - Contact queries admin panel
   - Email logs dashboard
   - Content pages editor

2. **Integration Testing:**
   - Automated API tests
   - End-to-end Selenium tests
   - Load testing with concurrent users

3. **Production Deployment:**
   - Environment configuration
   - Database backup strategy
   - Error logging and monitoring
   - CDN setup for images

---

## Contact & Support

**For Issues During Testing:**
1. Check browser console (F12) for error messages
2. Check backend logs in terminal window
3. Review MongoDB logs if data issues
4. Verify .env configuration is correct
5. Restart both backend and frontend servers

**Happy Testing! 🚀**

---

**Document Version:** 1.0
**Last Updated:** 2026-02-15
**Platform:** Tsatsaku e-commerce Management System
