const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const manUserController = require('../controllers/manuser.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(authenticate);

// Additional middleware to ensure user is MAN_USER role
const ensureManUser = (req, res, next) => {
  if (req.user.role !== 'man_user') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. MAN User role required.'
    });
  }
  next();
};

router.use(ensureManUser);

// Dashboard Routes
// GET /api/man-user/dashboard-stats - Get dashboard statistics
router.get('/dashboard-stats', manUserController.getDashboardStats);

// Sub-Users Management Routes
// GET /api/man-user/sub-users - Get all sub-users
router.get('/sub-users', manUserController.getSubUsers);

// POST /api/man-user/sub-users - Create new sub-user
router.post('/sub-users', [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2-50 characters'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2-50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('moduleAccess')
    .isObject()
    .withMessage('Module access must be an object'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
], manUserController.createSubUser);

// GET /api/man-user/sub-users/:userId - Get single sub-user
router.get('/sub-users/:userId', manUserController.getSubUserById);

// PUT /api/man-user/sub-users/:userId - Update sub-user
router.put('/sub-users/:userId', [
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2-50 characters'),
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2-50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('moduleAccess')
    .optional()
    .isObject()
    .withMessage('Module access must be an object'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
], manUserController.updateSubUser);

// PATCH /api/man-user/sub-users/:userId/status - Update sub-user status
router.patch('/sub-users/:userId/status', [
  body('status')
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
], manUserController.updateSubUserStatus);

// GET /api/man-user/modules - Get available modules
router.get('/modules', manUserController.getModules);

// Buyer Management Routes
// GET /api/man-user/buyers - Get all buyers
router.get('/buyers', manUserController.getBuyers);

// POST /api/man-user/buyers - Create new buyer
router.post('/buyers', [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2-50 characters'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2-50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('companyName')
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2-100 characters'),
  body('contactPersonName')
    .notEmpty()
    .withMessage('Contact person name is required'),
  body('contactPersonPhone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('businessType')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Business type must not exceed 100 characters'),
  body('registrationNumber')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Registration number must not exceed 100 characters'),
  body('taxId')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Tax ID must not exceed 50 characters'),
  body('address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Address must not exceed 200 characters'),
  body('city')
    .optional()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),
  body('state')
    .optional()
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters'),
  body('country')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
  body('postalCode')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Postal code must not exceed 20 characters'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
], manUserController.createBuyer);

// GET /api/man-user/buyers/export - Export buyers
router.get('/buyers/export', manUserController.exportBuyers);

// GET /api/man-user/buyers/:buyerId - Get single buyer
router.get('/buyers/:buyerId', manUserController.getBuyerById);

// PUT /api/man-user/buyers/:buyerId - Update buyer
router.put('/buyers/:buyerId', [
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2-50 characters'),
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2-50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('companyName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2-100 characters'),
  body('contactPersonName')
    .optional()
    .notEmpty()
    .withMessage('Contact person name is required'),
  body('contactPersonPhone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('businessType')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Business type must not exceed 100 characters'),
  body('registrationNumber')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Registration number must not exceed 100 characters'),
  body('taxId')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Tax ID must not exceed 50 characters'),
  body('address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Address must not exceed 200 characters'),
  body('city')
    .optional()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),
  body('state')
    .optional()
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters'),
  body('country')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
  body('postalCode')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Postal code must not exceed 20 characters'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
], manUserController.updateBuyer);

// PATCH /api/man-user/buyers/:buyerId/status - Update buyer status
router.patch('/buyers/:buyerId/status', [
  body('status')
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
], manUserController.updateBuyerStatus);

// Purchase Order Management Routes
// GET /api/man-user/purchase-orders - Get all purchase orders
router.get('/purchase-orders', manUserController.getPurchaseOrders);

// POST /api/man-user/purchase-orders - Create new purchase order
router.post('/purchase-orders', [
  body('buyerId')
    .notEmpty()
    .withMessage('Buyer ID is required')
    .isMongoId()
    .withMessage('Invalid buyer ID format'),
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),
  body('products.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  body('products.*.quantity')
    .isInt({ gt: 0 })
    .withMessage('Product quantity must be greater than 0'),
  body('products.*.unitPrice')
    .isFloat({ gt: 0 })
    .withMessage('Unit price must be greater than 0'),
  body('deliveryAddress')
    .notEmpty()
    .withMessage('Delivery address is required')
    .isLength({ max: 500 })
    .withMessage('Delivery address must not exceed 500 characters'),
  body('deliveryDate')
    .isISO8601()
    .withMessage('Please provide a valid delivery date'),
  body('paymentTerms')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Payment terms must not exceed 200 characters'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Priority must be low, normal, high, or urgent'),
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),
  body('taxRate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Tax rate must be between 0 and 100'),
  body('shippingCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Shipping cost must be greater than or equal to 0')
], manUserController.createPurchaseOrder);

// GET /api/man-user/purchase-orders/:poId - Get single purchase order
router.get('/purchase-orders/:poId', manUserController.getPurchaseOrderById);

// PUT /api/man-user/purchase-orders/:poId/status - Update purchase order status
router.put('/purchase-orders/:poId/status', [
  body('status')
    .isIn(['pending', 'confirmed', 'in_production', 'ready_for_dispatch', 'dispatched_from_port', 'in_transit', 'arrived_at_port', 'customs_clearance', 'received_into_warehouse', 'dispatched_from_warehouse', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters')
], manUserController.updatePurchaseOrderStatus);

// GET /api/man-user/purchase-orders/:poId/qr-code - Get QR code for purchase order
router.get('/purchase-orders/:poId/qr-code', manUserController.getPurchaseOrderQRCode);

// Inventory Reports Routes
// GET /api/man-user/reports/inventory - Get real-time inventory report
router.get('/reports/inventory', manUserController.getInventoryReport);

// GET /api/man-user/reports/warehouse-stock - Get warehouse-wise products report
router.get('/reports/warehouse-stock', manUserController.getWarehouseStockReport);

module.exports = router;