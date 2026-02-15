# Unified Dashboard Architecture - Role-Based Access Control

## Overview

The Tsatsaku application uses **ONE unified dashboard** with role-based access control (RBAC), not three separate portals. This approach is more maintainable, efficient, and provides a better user experience.

---

## Key Principles

### ✅ Single Application
- One Next.js application
- One codebase
- One deployment
- One URL

### ✅ Role-Based Rendering
- Same dashboard, different views
- Navigation changes based on user role
- Components conditionally rendered
- Features hidden/shown based on permissions

### ✅ Three User Roles
1. **Buyer** - Limited access, view-only for POs
2. **MAN User** - Moderate access, manage buyers and orders
3. **Admin** - Full access, system administration

---

## How It Works

### Login Flow
```
User logs in → Backend returns JWT with role → Frontend stores role → Dashboard renders based on role
```

### Example:
```javascript
// User object from JWT
{
  userId: "123",
  email: "user@example.com",
  role: "admin",  // or "buyer" or "man_user"
  moduleAccess: {...}  // for sub-admins
}
```

---

## Navigation Menu (Role-Based)

### Buyer Sees:
```
📊 Dashboard (minimal - just welcome)
📦 My Purchase Orders
👤 Profile
ℹ️ About Us
📄 Terms & Conditions
🔒 Privacy Policy
❓ FAQ
✉️ Contact Us
🚪 Logout
```

### MAN User Sees:
```
📊 Dashboard
👥 Buyers Management
📦 Orders Management
👨‍💼 Sub-Users Management
📈 Reports
  ├─ Real-Time Inventory
  └─ Warehouse-wise Products
👤 Profile
🚪 Logout
```

### Admin Sees:
```
📊 Dashboard (full stats)
👥 Buyers Management
👨‍💼 Sub-Admins Management
📦 Products
  ├─ Categories
  ├─ Products
  ├─ Ports
  └─ Warehouses
📦 Stock Management
📈 Reports
  ├─ Real-Time Inventory
  └─ Warehouse-wise Products
💬 Contact Queries
📝 Content Manager
👤 Profile
🚪 Logout
```

---

## Frontend Structure

### Unified Layout Component
```typescript
// components/layouts/DashboardLayout.tsx

export default function DashboardLayout({ children }) {
  const { user } = useAuth(); // Gets user with role
  
  return (
    <div className="dashboard">
      <Sidebar role={user.role} />
      <main>
        <Header user={user} />
        {children}
      </main>
    </div>
  );
}
```

### Dynamic Sidebar
```typescript
// components/layouts/Sidebar.tsx

export default function Sidebar({ role }) {
  const menuItems = getMenuItemsByRole(role);
  
  return (
    <nav>
      {menuItems.map(item => (
        <NavItem key={item.path} {...item} />
      ))}
    </nav>
  );
}

function getMenuItemsByRole(role) {
  switch(role) {
    case 'buyer':
      return buyerMenuItems;
    case 'man_user':
      return manUserMenuItems;
    case 'admin':
      return adminMenuItems;
    default:
      return [];
  }
}
```

### Route Protection
```typescript
// app/dashboard/page.tsx

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Conditional rendering based on role
  if (user.role === 'buyer') {
    return <BuyerDashboard />;
  }
  
  if (user.role === 'man_user') {
    return <ManUserDashboard />;
  }
  
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }
}
```

---

## Folder Structure

```
/src
  /app
    /(auth)
      /login
        page.tsx           # Single login page for all roles
      /forgot-password
        page.tsx
    /dashboard
      page.tsx             # Role-based dashboard
      /buyers              # Accessible by MAN User & Admin
        page.tsx
        /[id]
          page.tsx
      /purchase-orders     # Accessible by Buyer, MAN User & Admin
        page.tsx           # Different views based on role
        /[id]
          page.tsx
      /sub-users           # Accessible by MAN User only
        page.tsx
      /sub-admins          # Accessible by Admin only
        page.tsx
      /products            # Accessible by Admin only
        page.tsx
      /categories          # Accessible by Admin only
        page.tsx
      /warehouses          # Accessible by Admin only
        page.tsx
      /stock               # Accessible by Admin only
        page.tsx
      /reports             # Accessible by MAN User & Admin
        /inventory
          page.tsx
        /warehouse-stock
          page.tsx
      /content             # Accessible by Admin only
        page.tsx
      /queries             # Accessible by Admin only
        page.tsx
    /profile
      page.tsx             # Accessible by all roles
    /(public)
      /about
      /terms
      /privacy
      /faq
      /contact
  /components
    /dashboard
      /buyer
        BuyerDashboard.tsx
        POList.tsx
        PODetails.tsx
      /man-user
        ManUserDashboard.tsx
        BuyerManagement.tsx
        OrderManagement.tsx
        SubUserManagement.tsx
      /admin
        AdminDashboard.tsx
        SubAdminManagement.tsx
        ProductManagement.tsx
        CategoryManagement.tsx
        StockManagement.tsx
        ContentManager.tsx
      /shared              # Components used across roles
        Table.tsx
        Modal.tsx
        Form.tsx
    /layouts
      DashboardLayout.tsx
      Sidebar.tsx
      Header.tsx
    /ui                    # Reusable UI components
      Button.tsx
      Input.tsx
      Card.tsx
  /lib
    /auth
      useAuth.tsx          # Auth hook
      ProtectedRoute.tsx   # Route guard
  /utils
    permissions.ts         # Permission checking utilities
```

---

## Permission System

### Simple Role Check
```typescript
// utils/permissions.ts

export function canAccess(userRole: string, requiredRole: string | string[]) {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(userRole);
}

// Usage
if (canAccess(user.role, ['admin', 'man_user'])) {
  // Show buyer management
}
```

### Granular Permissions (for Sub-Admins)
```typescript
export function hasPermission(
  user: User, 
  module: string, 
  action: 'view' | 'add' | 'edit' | 'deactivate' | 'reactivate'
) {
  // Full admin has all permissions
  if (user.role === 'admin') return true;
  
  // Sub-admin: check module access
  if (user.role === 'sub_admin') {
    return user.moduleAccess?.[module]?.[action] === true;
  }
  
  return false;
}

// Usage
if (hasPermission(user, 'products', 'add')) {
  // Show "Add Product" button
}
```

---

## Component Examples

### Protected Component
```typescript
// components/ProtectedFeature.tsx

interface Props {
  roles: string[];
  children: React.ReactNode;
}

export default function ProtectedFeature({ roles, children }: Props) {
  const { user } = useAuth();
  
  if (!roles.includes(user.role)) {
    return null; // Don't render if user doesn't have access
  }
  
  return <>{children}</>;
}

// Usage
<ProtectedFeature roles={['admin', 'man_user']}>
  <BuyerManagementPage />
</ProtectedFeature>
```

### Conditional Rendering in Components
```typescript
// app/dashboard/purchase-orders/page.tsx

export default function PurchaseOrdersPage() {
  const { user } = useAuth();
  
  return (
    <div>
      <h1>Purchase Orders</h1>
      
      {/* Buyer: See only their POs */}
      {user.role === 'buyer' && (
        <BuyerPOList buyerId={user.buyerId} />
      )}
      
      {/* MAN User & Admin: See all POs */}
      {(user.role === 'man_user' || user.role === 'admin') && (
        <>
          <AllPOList />
          <button>Create New PO</button>
        </>
      )}
    </div>
  );
}
```

---

## Dashboard Variants

### Buyer Dashboard
```typescript
// components/dashboard/buyer/BuyerDashboard.tsx

export default function BuyerDashboard() {
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      
      <div className="stats-grid">
        <StatCard title="Total POs" value={totalPOs} />
        <StatCard title="Pending POs" value={pendingPOs} />
        <StatCard title="Delivered POs" value={deliveredPOs} />
      </div>
      
      <RecentPOsTable limit={5} />
    </div>
  );
}
```

### MAN User Dashboard
```typescript
// components/dashboard/man-user/ManUserDashboard.tsx

export default function ManUserDashboard() {
  return (
    <div>
      <h1>MAN User Dashboard</h1>
      
      <div className="stats-grid">
        <StatCard title="Total Buyers" value={totalBuyers} />
        <StatCard title="Active Orders" value={activeOrders} />
        <StatCard title="Low Stock Products" value={lowStock} />
        <StatCard title="Orders This Month" value={monthlyOrders} />
      </div>
      
      <div className="grid-2">
        <RecentOrdersWidget />
        <LowStockAlertsWidget />
      </div>
    </div>
  );
}
```

### Admin Dashboard
```typescript
// components/dashboard/admin/AdminDashboard.tsx

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <StatCard 
          title="Total Buyers" 
          value={totalBuyers} 
          linkTo="/dashboard/buyers"
        />
        <StatCard title="Orders (Week/Month/Year)" />
        <StatCard title="Low Stock Products" linkTo="/dashboard/stock" />
        <StatCard title="Pending Queries" linkTo="/dashboard/queries" />
      </div>
      
      <div className="grid-3">
        <BuyersWithMostOrders />
        <MostOrderedProduct />
        <LeastOrderedProduct />
      </div>
      
      <LowStockProductsList />
    </div>
  );
}
```

---

## Backend API - Role Validation

### Middleware
```javascript
// middleware/auth.js

const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    // User is attached to req by JWT middleware
    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    next();
  };
};

module.exports = { verifyRole };
```

### Route Protection
```javascript
// routes/buyers.js

const express = require('express');
const router = express.Router();
const { verifyRole } = require('../middleware/auth');

// Only MAN User and Admin can access
router.get(
  '/buyers', 
  verifyRole(['man_user', 'admin']),
  getBuyersList
);

router.post(
  '/buyers', 
  verifyRole(['man_user', 'admin']),
  createBuyer
);

// Only Admin can delete
router.delete(
  '/buyers/:id', 
  verifyRole(['admin']),
  deleteBuyer
);
```

---

## Benefits of Unified Dashboard

### 1. **Easier Maintenance**
- Single codebase to maintain
- Shared components reduce duplication
- Bug fixes apply to all roles

### 2. **Consistent UX**
- Same look and feel for all users
- Familiar interface when role changes
- Smoother onboarding

### 3. **Better Performance**
- One application to load
- Shared resources and caching
- Smaller bundle size

### 4. **Flexible Permissions**
- Easy to add new roles
- Granular control with module access
- Dynamic permission changes

### 5. **Simpler Deployment**
- One build process
- One deployment
- One domain/URL

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Create unified dashboard layout
- [ ] Implement auth context with role
- [ ] Create role-based navigation component
- [ ] Setup route protection middleware

### Phase 2: Components
- [ ] Build role-specific dashboard components
- [ ] Create shared UI components
- [ ] Implement permission checking utilities
- [ ] Build protected feature wrapper

### Phase 3: Features
- [ ] Implement buyer features (PO viewing)
- [ ] Implement MAN user features (buyer mgmt, order mgmt)
- [ ] Implement admin features (full system control)
- [ ] Add granular permissions for sub-admins

### Phase 4: Testing
- [ ] Test each role independently
- [ ] Test permission boundaries
- [ ] Test role switching (if applicable)
- [ ] Test unauthorized access attempts

---

## Security Considerations

### 1. **Never Trust Frontend**
- Always validate permissions on backend
- Frontend hiding is for UX, not security
- Backend must enforce access control

### 2. **JWT Contains Role**
- Role is in JWT token
- Backend validates token on each request
- Tampering with token invalidates it

### 3. **API Protection**
- Every API endpoint checks permissions
- Use middleware for consistent enforcement
- Return 403 for unauthorized access

### 4. **Data Filtering**
- Buyers only see their own POs
- MAN users see all POs
- Admin sees everything
- Filter at database query level

---

## Example: Full Feature Implementation

### Purchase Orders (All Roles Can Access)

#### Frontend
```typescript
// app/dashboard/purchase-orders/page.tsx

export default function PurchaseOrdersPage() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useQuery(
    'purchase-orders',
    () => fetchPurchaseOrders(user.role)
  );
  
  return (
    <div>
      <div className="header">
        <h1>Purchase Orders</h1>
        
        {/* Only MAN User and Admin can create */}
        <ProtectedFeature roles={['man_user', 'admin']}>
          <Button onClick={openCreateModal}>Create PO</Button>
        </ProtectedFeature>
      </div>
      
      {/* Different views based on role */}
      {user.role === 'buyer' ? (
        <BuyerPOTable orders={orders} />
      ) : (
        <AdminPOTable 
          orders={orders} 
          canEdit={user.role === 'man_user' || user.role === 'admin'}
        />
      )}
    </div>
  );
}
```

#### Backend
```javascript
// routes/purchase-orders.js

// GET /api/purchase-orders
router.get('/purchase-orders', authenticate, async (req, res) => {
  const { role, userId, buyerId } = req.user;
  
  let query = {};
  
  // Buyer: Only their POs
  if (role === 'buyer') {
    query.buyerId = buyerId;
  }
  
  // MAN User & Admin: All POs
  // No additional filter needed
  
  const orders = await PurchaseOrder.find(query)
    .populate('buyerId', 'name companyName')
    .populate('products.productId', 'name')
    .sort({ createdAt: -1 });
  
  res.json({ success: true, data: orders });
});

// POST /api/purchase-orders
router.post(
  '/purchase-orders',
  authenticate,
  verifyRole(['man_user', 'admin']), // Only these roles can create
  createPurchaseOrder
);
```

---

## Summary

**Architecture:** Single unified dashboard
**Approach:** Role-based rendering
**Navigation:** Dynamic based on user role
**Components:** Conditional rendering
**Security:** Backend permission validation
**Benefits:** Maintainable, scalable, efficient

This approach gives you **one application** that serves **three different user experiences** based on who's logged in. It's the modern, recommended way to build multi-role applications.

---

**Questions to Consider:**

1. Can a user have multiple roles? (Usually no - one role per user)
2. Can roles change? (Yes - update user record)
3. Can we have role hierarchies? (Yes - admin > man_user > buyer)
4. Can sub-admins have custom permissions? (Yes - use moduleAccess)

All these are handled in the unified dashboard architecture!
