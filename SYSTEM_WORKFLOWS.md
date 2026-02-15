# Tsatsaku Web Application - System Flows & Workflows

## 📊 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    UNIFIED FRONTEND (Next.js)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Single Dashboard Application               │   │
│  │                                                      │   │
│  │  ┌────────────────────────────────────────────┐     │   │
│  │  │  Role-Based Rendering Engine               │     │   │
│  │  │  ├─ Buyer View (if role = buyer)           │     │   │
│  │  │  ├─ MAN User View (if role = man_user)     │     │   │
│  │  │  └─ Admin View (if role = admin)           │     │   │
│  │  └────────────────────────────────────────────┘     │   │
│  │                                                      │   │
│  │  Navigation: Dynamic based on user.role             │   │
│  │  Components: Conditional rendering                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
          └────────────────┼────────────────────┘
                           │
                      REST APIs
                           │
┌─────────────────────────┼────────────────────────────────────┐
│                      BACKEND                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Express.js Server                         │  │
│  │  ┌──────────┐  ┌───────────┐  ┌───────────────────┐  │  │
│  │  │   Auth   │  │   RBAC    │  │  Business Logic   │  │  │
│  │  │Middleware│  │Middleware │  │   Controllers     │  │  │
│  │  └──────────┘  └───────────┘  └───────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                           │                                   │
│  ┌────────────────────────┼────────────────────────────────┐ │
│  │  Services                                                │ │
│  │  ├─ Email Service (Nodemailer)                          │ │
│  │  ├─ QR Code Service                                     │ │
│  │  ├─ Stock Management Service                            │ │
│  │  ├─ Export Service (Excel)                              │ │
│  │  └─ Location Service (3rd Party API)                    │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────┼────────────────────────────────────┘
                            │
                    ┌───────┴────────┐
                    │                │
            ┌───────▼─────┐  ┌──────▼──────┐
            │   MongoDB   │  │  File Store │
            │   Database  │  │  (Uploads)  │
            └─────────────┘  └─────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. POST /api/auth/login
     │    { email, password }
     │
     ▼
┌─────────────────────────┐
│  Backend: Auth Service  │
├─────────────────────────┤
│ 2. Verify email exists  │
│ 3. Compare password     │
│ 4. Check account status │
│ 5. Generate JWT token   │
└────┬────────────────────┘
     │
     │ 6. Return: { token, user, role }
     │
     ▼
┌─────────────────────────┐
│  Frontend: Store token  │
├─────────────────────────┤
│ - Save to localStorage  │
│ - Add to API headers    │
│ - Redirect to dashboard │
└─────────────────────────┘
     │
     │ 7. All subsequent requests include:
     │    Authorization: Bearer <token>
     │
     ▼
┌─────────────────────────┐
│  Protected Routes       │
├─────────────────────────┤
│ - Verify token          │
│ - Extract user data     │
│ - Check permissions     │
│ - Allow/Deny access     │
└─────────────────────────┘
```

---

## 🔄 Purchase Order Creation Flow

### Flow 1: MAN User Creates PO on Behalf of Buyer

```
┌──────────────┐
│  MAN User    │
└──────┬───────┘
       │
       │ 1. Navigate to "Create PO"
       │
       ▼
┌─────────────────────────────────┐
│  Fill PO Form                   │
├─────────────────────────────────┤
│ - Select Buyer (dropdown)       │
│ - Select Products (multi)       │
│   └─ For each: qty, unit        │
│ - Set Delivery Date             │
│ - Enter Delivery Address        │
│ - Fill Additional Fields        │
│ - Submit                        │
└──────┬──────────────────────────┘
       │
       │ 2. POST /api/man-user/purchase-orders
       │
       ▼
┌─────────────────────────────────┐
│  Backend: PO Service            │
├─────────────────────────────────┤
│ 3. Validate buyer exists        │
│ 4. Validate products exist      │
│ 5. Generate unique PO number    │
│ 6. Create PO in database        │
│    - Status: "Pending"          │
│ 7. Generate QR Code             │
│    - Links to public PO view    │
│ 8. Save QR code image           │
│ 9. Send email to:               │
│    - Buyer (PO created)         │
│    - MAN User (confirmation)    │
└──────┬──────────────────────────┘
       │
       │ 10. Return: PO details + QR code URL
       │
       ▼
┌─────────────────────────────────┐
│  Frontend: Show Success         │
├─────────────────────────────────┤
│ - Display PO number             │
│ - Show QR code                  │
│ - Option to download QR         │
│ - Redirect to PO details        │
└─────────────────────────────────┘
```

---

## 📦 Order Status Update Flow (with Stock Automation)

```
┌──────────────┐
│  MAN User    │
└──────┬───────┘
       │
       │ 1. View PO Details
       │ 2. Click "Update Status" button
       │
       ▼
┌─────────────────────────────────────┐
│  Status Options (Context-aware)     │
├─────────────────────────────────────┤
│ Current: Pending                    │
│ Available: → In Production          │
│                                     │
│ Current: In Production              │
│ Available: → Ready for Dispatch     │
│                                     │
│ Current: Ready for Dispatch         │
│ Available: → Dispatched from WH     │
│                                     │
│ (and so on...)                      │
└──────┬──────────────────────────────┘
       │
       │ 3. Select status + add notes (optional)
       │ 4. PUT /api/man-user/purchase-orders/:id/status
       │
       ▼
┌─────────────────────────────────────┐
│  Backend: Status Update Service     │
├─────────────────────────────────────┤
│ 5. Validate status transition       │
│    - Check if valid next status     │
│    - Cannot skip or reverse         │
│ 6. Update PO status                 │
│ 7. Add to status history:           │
│    - status, timestamp, user, notes │
│                                     │
│ 8. CHECK AUTOMATION TRIGGERS:       │
│                                     │
│    IF status = "Received into WH":  │
│      ├─ Get PO products             │
│      ├─ For each product:           │
│      │   ├─ Find warehouse stock    │
│      │   └─ INCREASE quantity       │
│      └─ Update warehouse_stock      │
│                                     │
│    IF status = "Dispatched from WH":│
│      ├─ Get PO products             │
│      ├─ For each product:           │
│      │   ├─ Find warehouse stock    │
│      │   ├─ DECREASE quantity       │
│      │   └─ Check restock alert     │
│      └─ If low stock: send alert    │
│                                     │
│ 9. Send email notification:         │
│    - To Buyer (status updated)      │
│    - To Admin (if low stock)        │
└──────┬──────────────────────────────┘
       │
       │ 10. Return: Updated PO with history
       │
       ▼
┌─────────────────────────────────────┐
│  Frontend: Update UI                │
├─────────────────────────────────────┤
│ - Refresh PO details                │
│ - Show updated timeline             │
│ - Display success message           │
│ - Show next available action        │
└─────────────────────────────────────┘
```

---

## 🏭 Warehouse Stock Management Flow

### Adding Product to Warehouse

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │
     │ 1. Navigate to Warehouse Stock
     │ 2. Click "Add Product to Warehouse"
     │
     ▼
┌────────────────────────────────────┐
│  Fill Form                         │
├────────────────────────────────────┤
│ - Select Product (from master)     │
│ - Select Warehouse(s)              │
│ - Enter Quantity                   │
│ - Select Unit (Litre/Ton/Kg/etc)   │
│ - Set Restock Alert Level          │
│ - Set Status (Active/Inactive)     │
│ - Submit                           │
└────┬───────────────────────────────┘
     │
     │ 3. POST /api/admin/warehouse-stock
     │
     ▼
┌────────────────────────────────────┐
│  Backend: Stock Service            │
├────────────────────────────────────┤
│ 4. Validate product exists         │
│ 5. Validate warehouse(s) exist     │
│ 6. For each warehouse selected:    │
│    ├─ Create warehouse_stock       │
│    └─ Set initial quantity         │
│ 7. Save to database                │
└────┬───────────────────────────────┘
     │
     │ 8. Return: Created stock records
     │
     ▼
┌────────────────────────────────────┐
│  Frontend: Show Success            │
├────────────────────────────────────┤
│ - Display confirmation             │
│ - Refresh stock list               │
└────────────────────────────────────┘
```

### Low Stock Alert Trigger

```
┌────────────────────────────────────┐
│  Triggered by:                     │
│  - PO status update (stock change) │
│  - Manual stock adjustment         │
│  - Scheduled cron job (daily)      │
└────┬───────────────────────────────┘
     │
     ▼
┌────────────────────────────────────┐
│  Stock Service: Check Alerts       │
├────────────────────────────────────┤
│ FOR each warehouse_stock:          │
│   IF quantity < restockAlertLevel: │
│     ├─ Create alert record         │
│     ├─ Send email to admin         │
│     └─ Add to dashboard            │
└────┬───────────────────────────────┘
     │
     │ Admin sees in:
     │ ├─ Dashboard (Low Stock Products widget)
     │ └─ Email notification
     │
     ▼
┌────────────────────────────────────┐
│  Admin Actions                     │
├────────────────────────────────────┤
│ - View low stock products          │
│ - Click to see product details     │
│ - Manually restock                 │
│ - Or create new PO to supplier     │
└────────────────────────────────────┘
```

---

## 👥 User Management Flow

### Admin Creates Sub-Admin with Permissions

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │
     │ 1. Navigate to Sub-Admin Management
     │ 2. Click "Add Sub-Admin"
     │
     ▼
┌────────────────────────────────────────────┐
│  Fill Form                                 │
├────────────────────────────────────────────┤
│ - First Name, Last Name, Email            │
│                                            │
│ - Module Access (Permission Matrix):      │
│                                            │
│   ┌──────────────────────────────────┐    │
│   │ Module          │V│A│E│D│R│       │    │
│   ├────────────────┼─┼─┼─┼─┼─┤       │    │
│   │ Buyer Mgmt     │✓│✓│✓│ │✓│       │    │
│   │ Product Mgmt   │✓│ │✓│ │ │       │    │
│   │ Category Mgmt  │✓│✓│✓│✓│✓│ AUTO  │    │
│   │ Warehouse Mgmt │✓│ │ │ │ │       │    │
│   │ Stock Mgmt     │✓│ │✓│ │ │ AUTO  │    │
│   │ Orders         │✓│ │ │ │ │       │    │
│   │ Dashboard      │✓│ │ │ │ │       │    │
│   └────────────────┴─┴─┴─┴─┴─┘       │    │
│                                            │
│   V=View, A=Add, E=Edit, D=Deactivate,    │
│   R=Reactivate                             │
│                                            │
│   Note: Dependent modules auto-selected   │
│                                            │
│ - Status: Active/Inactive                 │
│ - Submit                                   │
└────┬───────────────────────────────────────┘
     │
     │ 3. POST /api/admin/sub-admins
     │
     ▼
┌────────────────────────────────────────────┐
│  Backend: Sub-Admin Service                │
├────────────────────────────────────────────┤
│ 4. Validate email (unique)                 │
│ 5. Generate random password                │
│    - Min 8 chars, alphanumeric             │
│ 6. Hash password (bcrypt)                  │
│ 7. Create user record:                     │
│    - role: "sub_admin"                     │
│    - moduleAccess: {...permissions}        │
│ 8. Save to database                        │
│ 9. Send email with credentials             │
└────┬───────────────────────────────────────┘
     │
     │ 10. Return: Sub-admin details
     │
     ▼
┌────────────────────────────────────────────┐
│  Frontend: Show Success                    │
├────────────────────────────────────────────┤
│ - Display confirmation                     │
│ - Show generated password (one-time)       │
│ - Refresh sub-admins list                  │
└────────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────┐
│  Sub-Admin Receives Email                  │
├────────────────────────────────────────────┤
│ Subject: Your Tsatsaku Admin Account       │
│                                            │
│ Hello [Name],                              │
│                                            │
│ Your admin account has been created.       │
│                                            │
│ Email: [email]                             │
│ Password: [generated_password]             │
│                                            │
│ Login: [login_url]                         │
│                                            │
│ Please change your password after login.   │
└────────────────────────────────────────────┘
```

### Sub-Admin Login with Restricted Access

```
┌─────────────┐
│ Sub-Admin   │
└──────┬──────┘
       │
       │ 1. Login with credentials
       │
       ▼
┌────────────────────────────────────┐
│  Auth Service                      │
├────────────────────────────────────┤
│ 2. Verify credentials              │
│ 3. Generate JWT with:              │
│    - userId, role, moduleAccess    │
│ 4. Return token                    │
└────┬───────────────────────────────┘
     │
     ▼
┌────────────────────────────────────┐
│  Frontend: Build UI Based on       │
│  Permissions                       │
├────────────────────────────────────┤
│ - Parse moduleAccess from token    │
│ - Show only allowed menu items     │
│ - Hide restricted features         │
│                                    │
│ Example:                           │
│ If moduleAccess.products.view = ✓  │
│   → Show "Products" menu           │
│ If moduleAccess.products.add = ✗   │
│   → Hide "Add Product" button      │
└────────────────────────────────────┘
       │
       │ User tries to access restricted feature
       │
       ▼
┌────────────────────────────────────┐
│  RBAC Middleware (Backend)         │
├────────────────────────────────────┤
│ - Check moduleAccess in JWT        │
│ - Verify required permission       │
│                                    │
│ IF no permission:                  │
│   → Return 403 Forbidden           │
│                                    │
│ IF has permission:                 │
│   → Allow request                  │
└────────────────────────────────────┘
```

---

## 🔍 Product Category Hierarchy

```
┌─────────────────────────────────────────────┐
│  Category Structure (Example)               │
├─────────────────────────────────────────────┤
│                                             │
│  Electronics (parent_id: null)              │
│  ├── Mobile Phones (parent_id: Electronics) │
│  │   ├── Smartphones                        │
│  │   └── Feature Phones                     │
│  ├── Laptops                                │
│  │   ├── Gaming Laptops                     │
│  │   └── Business Laptops                   │
│  └── Accessories                            │
│                                             │
│  Food & Beverages (parent_id: null)         │
│  ├── Beverages                              │
│  │   ├── Soft Drinks                        │
│  │   └── Juices                             │
│  └── Snacks                                 │
│                                             │
└─────────────────────────────────────────────┘

When creating a product:
1. Select category (dropdown shows all categories)
2. If subcategory selected, it shows full path:
   "Electronics > Mobile Phones > Smartphones"
3. Product attributes are loaded based on final category
```

---

## 📧 Email Notification Triggers

```
┌─────────────────────────┐
│  Event Triggers         │
└───────┬─────────────────┘
        │
        ├─► Buyer Account Created
        │   └─► Email to: Buyer
        │       Content: Credentials
        │
        ├─► MAN Sub-User Created
        │   └─► Email to: MAN Sub-User
        │       Content: Credentials
        │
        ├─► Admin Sub-Admin Created
        │   └─► Email to: Sub-Admin
        │       Content: Credentials
        │
        ├─► Forgot Password Requested
        │   └─► Email to: User (any role)
        │       Content: 6-digit OTP
        │
        ├─► PO Status Updated
        │   └─► Email to: Buyer
        │       Content: New status, notes
        │
        ├─► New PO Created
        │   └─► Email to: MAN User
        │       Content: PO details
        │
        ├─► Contact Query Submitted
        │   └─► Email to: Admin
        │       Content: User details, message
        │
        ├─► Contact Query Closed
        │   └─► Email to: Admin
        │       Content: Query details
        │
        └─► Low Stock Alert
            └─► Email to: Admin
                Content: Product, quantity, warehouse
```

---

## 📊 Dashboard Data Aggregation

### Admin Dashboard Stats Calculation

```
┌─────────────────────────────────────────────────┐
│  Dashboard Stat: Total Buyers                   │
├─────────────────────────────────────────────────┤
│  Query: db.buyers.countDocuments()              │
│  Clickable: Links to /admin/buyers              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Dashboard Stat: Orders This Week/Month/Year    │
├─────────────────────────────────────────────────┤
│  Query: db.purchaseOrders.aggregate([           │
│    {                                            │
│      $match: {                                  │
│        createdAt: {                             │
│          $gte: startOfWeek,                     │
│          $lte: endOfWeek                        │
│        }                                        │
│      }                                          │
│    },                                           │
│    { $count: "total" }                          │
│  ])                                             │
│  Repeat for month and year                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Dashboard Stat: Buyers with Most Orders       │
├─────────────────────────────────────────────────┤
│  Query: db.purchaseOrders.aggregate([           │
│    { $group: {                                  │
│        _id: "$buyerId",                         │
│        orderCount: { $sum: 1 }                  │
│      }                                          │
│    },                                           │
│    { $sort: { orderCount: -1 } },              │
│    { $limit: 5 },                               │
│    { $lookup: {                                 │
│        from: "buyers",                          │
│        localField: "_id",                       │
│        foreignField: "_id",                     │
│        as: "buyer"                              │
│      }                                          │
│    }                                            │
│  ])                                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Dashboard Stat: Low Stock Products             │
├─────────────────────────────────────────────────┤
│  Query: db.warehouseStock.find({                │
│    $expr: { $lt: ["$quantity",                  │
│                   "$restockAlertLevel"] }       │
│  })                                             │
│  .populate('productId')                         │
│  .populate('warehouseId')                       │
│  Clickable: Links to product details            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Dashboard Stat: Most/Least Ordered Product    │
├─────────────────────────────────────────────────┤
│  Query: db.purchaseOrders.aggregate([           │
│    { $unwind: "$products" },                    │
│    { $group: {                                  │
│        _id: "$products.productId",              │
│        orderCount: { $sum: 1 }                  │
│      }                                          │
│    },                                           │
│    { $sort: { orderCount: -1 } }, // or 1      │
│    { $limit: 1 },                               │
│    { $lookup: {                                 │
│        from: "products",                        │
│        localField: "_id",                       │
│        foreignField: "_id",                     │
│        as: "product"                            │
│      }                                          │
│    }                                            │
│  ])                                             │
│  Clickable: Links to product details            │
└─────────────────────────────────────────────────┘
```

---

## 🔄 QR Code Scanning Flow

```
┌──────────────┐
│  QR Code     │
│  Generated   │
│  for PO#1234 │
└──────┬───────┘
       │
       │ QR Code contains URL:
       │ https://tsatsaku.com/public/po/1234/qr
       │
       ▼
┌──────────────────────┐
│  User Scans QR Code  │
│  (via phone camera)  │
└──────┬───────────────┘
       │
       │ Opens in browser
       │
       ▼
┌─────────────────────────────────────┐
│  Public Page (No Login Required)    │
│  GET /api/public/purchase-orders/   │
│      1234/qr                         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend: Fetch PO Details          │
├─────────────────────────────────────┤
│ - No authentication required        │
│ - Return PO data (read-only)        │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Display PO Information             │
├─────────────────────────────────────┤
│ - PO Number                         │
│ - Buyer Name                        │
│ - Products Ordered                  │
│ - Quantities                        │
│ - Delivery Address                  │
│ - Current Status                    │
│ - Status Timeline                   │
│                                     │
│ No actions available (view only)   │
└─────────────────────────────────────┘
```

---

## 📈 Inventory Report Generation

### Real-Time Inventory Report

```
┌──────────────────────┐
│  User Request        │
│  (MAN User or Admin) │
└──────┬───────────────┘
       │
       │ GET /api/reports/inventory
       │
       ▼
┌─────────────────────────────────────────┐
│  Backend: Inventory Calculation         │
├─────────────────────────────────────────┤
│                                         │
│  FOR each active product:               │
│                                         │
│  1. Available Stock:                    │
│     ├─ Query: warehouse_stock           │
│     └─ SUM(quantity) where status=active│
│                                         │
│  2. In-Transit Stock:                   │
│     ├─ Query: purchase_orders           │
│     └─ SUM(product qty) where           │
│         status IN ['In Transit']        │
│                                         │
│  3. Dispatched Stock:                   │
│     ├─ Query: purchase_orders           │
│     └─ SUM(product qty) where           │
│         status = 'Dispatched'           │
│                                         │
│  Return: [                              │
│    {                                    │
│      productId,                         │
│      productName,                       │
│      availableStock,                    │
│      inTransitStock,                    │
│      dispatchedStock,                   │
│      totalStock                         │
│    },                                   │
│    ...                                  │
│  ]                                      │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Frontend: Display Report               │
├─────────────────────────────────────────┤
│  Table with columns:                    │
│  - Product Name                         │
│  - Available (number)                   │
│  - In-Transit (number)                  │
│  - Dispatched (number)                  │
│  - Total (number)                       │
│                                         │
│  Features:                              │
│  - Search                               │
│  - Filter                               │
│  - Sort                                 │
│  - Export to Excel                      │
└─────────────────────────────────────────┘
```

### Warehouse-wise Products Report

```
┌──────────────────────┐
│  User Request        │
└──────┬───────────────┘
       │
       │ GET /api/reports/warehouse-stock
       │
       ▼
┌─────────────────────────────────────────┐
│  Backend: Warehouse Stock Calculation   │
├─────────────────────────────────────────┤
│                                         │
│  1. Get all active warehouses           │
│  2. Get all active products             │
│                                         │
│  FOR each product:                      │
│    FOR each warehouse:                  │
│      ├─ Query: warehouse_stock          │
│      └─ Get quantity for this product   │
│          in this warehouse              │
│                                         │
│  Return: [                              │
│    {                                    │
│      productId,                         │
│      productName,                       │
│      warehouseStocks: {                 │
│        "Warehouse A": 100,              │
│        "Warehouse B": 50,               │
│        "Warehouse C": 0                 │
│      },                                 │
│      totalAcrossWarehouses: 150         │
│    },                                   │
│    ...                                  │
│  ]                                      │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Frontend: Display Report               │
├─────────────────────────────────────────┤
│  Dynamic Table:                         │
│  - Fixed column: Product Name           │
│  - Dynamic columns (one per warehouse): │
│    Warehouse A | Warehouse B | WH C ... │
│  - Last column: Total                   │
│                                         │
│  Example:                               │
│  Product A  | 100 | 50  | 0   | 150    │
│  Product B  | 200 | 0   | 100 | 300    │
│                                         │
│  Features: Search, Filter, Export       │
└─────────────────────────────────────────┘
```

---

## 🎨 UI Component Hierarchy

### Buyer Portal Structure

```
BuyerLayout
├── Header
│   ├── Logo
│   ├── Navigation Menu
│   └── User Dropdown (Profile, Logout)
├── Main Content
│   ├── POManagementPage
│   │   ├── POListTable
│   │   │   ├── SearchBar
│   │   │   ├── FilterDropdowns
│   │   │   ├── DataTable
│   │   │   └── Pagination
│   │   └── PODetailsModal
│   │       ├── POInfo
│   │       ├── StatusTimeline
│   │       └── NotesSection
│   ├── ProfilePage
│   │   ├── UserInfoForm
│   │   └── ResetPasswordForm
│   └── ContentPages
│       ├── AboutUs
│       ├── TermsAndConditions
│       ├── PrivacyPolicy
│       ├── FAQ
│       └── ContactUs
└── Footer
```

### Admin Portal Structure

```
AdminLayout
├── Sidebar Navigation
│   ├── Dashboard
│   ├── User Management
│   │   ├── Sub-Admins
│   │   └── Buyers
│   ├── Product Management
│   │   ├── Categories
│   │   ├── Products
│   │   ├── Ports
│   │   └── Warehouses
│   ├── Inventory
│   │   ├── Warehouse Stock
│   │   └── Low Stock Alerts
│   ├── Reports
│   │   ├── Inventory Report
│   │   └── Warehouse Report
│   ├── Content Manager
│   └── Contact Queries
├── TopBar
│   ├── Breadcrumbs
│   ├── Notifications Icon
│   └── User Profile Dropdown
├── Main Content Area
│   └── [Dynamic based on selected menu]
└── Footer
```

---

## 🔒 Security Implementation

### Password Security Flow

```
┌─────────────────────────┐
│  User Registration/     │
│  Account Creation       │
└──────┬──────────────────┘
       │
       │ Password: "MyPass123!"
       │
       ▼
┌─────────────────────────────────┐
│  Password Validation            │
├─────────────────────────────────┤
│ Rules:                          │
│ - Minimum 8 characters          │
│ - At least 1 uppercase letter   │
│ - At least 1 lowercase letter   │
│ - At least 1 number             │
│ - At least 1 special character  │
│                                 │
│ Regex: /^(?=.*[a-z])(?=.*[A-Z])│
│        (?=.*\d)(?=.*[@$!%*?&])  │
│        [A-Za-z\d@$!%*?&]{8,}$/  │
└──────┬──────────────────────────┘
       │
       │ Valid ✓
       │
       ▼
┌─────────────────────────────────┐
│  Password Hashing (bcrypt)      │
├─────────────────────────────────┤
│ const salt = await bcrypt       │
│   .genSalt(10);                 │
│                                 │
│ const hashedPassword = await    │
│   bcrypt.hash(password, salt);  │
│                                 │
│ Result: $2b$10$N9qo8uL...      │
└──────┬──────────────────────────┘
       │
       │ Store hashed password in DB
       │
       ▼
┌─────────────────────────────────┐
│  Database: users collection     │
├─────────────────────────────────┤
│ {                               │
│   email: "user@example.com",    │
│   password: "$2b$10$N9qo8uL...",│
│   ...                           │
│ }                               │
└─────────────────────────────────┘
```

### JWT Token Structure

```
┌─────────────────────────────────────┐
│  JWT Token Components               │
├─────────────────────────────────────┤
│                                     │
│  HEADER:                            │
│  {                                  │
│    "alg": "HS256",                  │
│    "typ": "JWT"                     │
│  }                                  │
│                                     │
│  PAYLOAD:                           │
│  {                                  │
│    "userId": "64f5a1b2c3d4e5f6...", │
│    "email": "user@example.com",     │
│    "role": "admin",                 │
│    "moduleAccess": {                │
│      "buyers": {                    │
│        "view": true,                │
│        "add": true,                 │
│        "edit": false,               │
│        ...                          │
│      },                             │
│      ...                            │
│    },                               │
│    "iat": 1694512345,               │
│    "exp": 1695117145                │
│  }                                  │
│                                     │
│  SIGNATURE:                         │
│  HMACSHA256(                        │
│    base64UrlEncode(header) + "." +  │
│    base64UrlEncode(payload),        │
│    JWT_SECRET                       │
│  )                                  │
└─────────────────────────────────────┘
```

---

## 📁 Module Dependencies Map

```
┌──────────────────────────────────────────────────┐
│  Module Dependency Graph                         │
├──────────────────────────────────────────────────┤
│                                                  │
│  Products                                        │
│    ↓ (depends on)                                │
│  Product Categories ← (must have view access)    │
│                                                  │
│  Warehouse Stock                                 │
│    ↓ (depends on)                                │
│  Products + Warehouses                           │
│                                                  │
│  Purchase Orders                                 │
│    ↓ (depends on)                                │
│  Products + Buyers                               │
│                                                  │
│  Order Status Management                         │
│    ↓ (depends on)                                │
│  Purchase Orders + Warehouse Stock               │
│                                                  │
└──────────────────────────────────────────────────┘

When granting permissions:
- If granting "Manage Products", auto-grant "View Categories"
- If granting "Manage Stock", auto-grant "View Products" and "View Warehouses"
- If granting "Manage Orders", auto-grant "View Products" and "View Buyers"
```

---

## 🎯 Key Implementation Principles

1. **Single Source of Truth**
   - All PO data stored in purchase_orders collection
   - Warehouse stock in warehouse_stock collection
   - Status changes trigger automatic stock updates

2. **Data Consistency**
   - Use transactions for stock updates
   - Validate before status changes
   - Log all critical operations

3. **Audit Trail**
   - Status history in PO
   - Email logs for all notifications
   - User actions tracked (who created/updated)

4. **Performance**
   - Index frequently queried fields
   - Paginate large lists
   - Cache location data
   - Optimize dashboard queries

5. **Security**
   - Validate all inputs
   - Sanitize user data
   - Use parameterized queries
   - Implement rate limiting
   - Never expose sensitive data in API responses

---

This workflow document should help you understand how all the pieces fit together! Refer to this along with the main PROJECT_DEVELOPMENT_PLAN.md as you build the system.
