const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(authenticate);

// Additional middleware to ensure user is ADMIN role
const ensureAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

router.use(ensureAdmin);

// Sub-Admin Management Routes
// GET /api/admin/sub-admins - Get all sub-admins
router.get('/sub-admins', adminController.getSubAdmins);

// POST /api/admin/sub-admins - Create new sub-admin
router.post('/sub-admins', [
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
], adminController.createSubAdmin);

// GET /api/admin/sub-admins/:userId - Get single sub-admin
router.get('/sub-admins/:userId', adminController.getSubAdminById);

// PUT /api/admin/sub-admins/:userId - Update sub-admin
router.put('/sub-admins/:userId', [
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
], adminController.updateSubAdmin);

// PATCH /api/admin/sub-admins/:userId/status - Update sub-admin status
router.patch('/sub-admins/:userId/status', [
  body('status')
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
], adminController.updateSubAdminStatus);

// GET /api/admin/modules - Get available modules for admin
router.get('/modules', adminController.getAdminModules);

// Buyer Management Routes (Admin level)
// GET /api/admin/buyers - Get all buyers in the system
router.get('/buyers', adminController.getAllBuyers);

// POST /api/admin/buyers - Create new buyer
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
], adminController.createAdminBuyer);

// GET /api/admin/buyers/export - Export all buyers
router.get('/buyers/export', adminController.exportAllBuyers);

// GET /api/admin/buyers/:buyerId - Get single buyer
router.get('/buyers/:buyerId', adminController.getAdminBuyerById);

// PUT /api/admin/buyers/:buyerId - Update buyer
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
], adminController.updateAdminBuyer);

// PATCH /api/admin/buyers/:buyerId/status - Update buyer status
router.patch('/buyers/:buyerId/status', [
  body('status')
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
], adminController.updateAdminBuyerStatus);

// Product Categories Management Routes
// GET /api/admin/product-categories - Get all product categories
router.get('/product-categories', adminController.getProductCategories);

// POST /api/admin/product-categories - Create new product category
router.post('/product-categories', [
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2-100 characters'),
  body('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Parent category must be a valid ID'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
], adminController.createProductCategory);

// GET /api/admin/product-categories/:categoryId - Get single product category
router.get('/product-categories/:categoryId', adminController.getProductCategoryById);

// PUT /api/admin/product-categories/:categoryId - Update product category
router.put('/product-categories/:categoryId', [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2-100 characters'),
  body('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Parent category must be a valid ID'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
], adminController.updateProductCategory);

// DELETE /api/admin/product-categories/:categoryId - Delete product category
router.delete('/product-categories/:categoryId', adminController.deleteProductCategory);

// === PRODUCT MANAGEMENT ROUTES ===

// GET /api/admin/products - Get all products with filtering and pagination
router.get('/products', adminController.getProducts);

// POST /api/admin/products - Create new product
router.post('/products', [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2-200 characters'),
  body('sku')
    .notEmpty()
    .withMessage('SKU is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('SKU must be between 2-50 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('shortDescription')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Short description must not exceed 500 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Category must be a valid ID'),
  body('brand')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Brand must not exceed 100 characters'),
  body('manufacturer')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Manufacturer must not exceed 100 characters'),
  body('pricing.basePrice')
    .notEmpty()
    .withMessage('Base price is required')
    .isNumeric()
    .withMessage('Base price must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Base price cannot be negative');
      }
      return true;
    }),
  body('pricing.currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-character code'),
  body('pricing.taxRate')
    .optional()
    .isNumeric()
    .withMessage('Tax rate must be a number')
    .custom((value) => {
      if (value < 0 || value > 100) {
        throw new Error('Tax rate must be between 0-100');
      }
      return true;
    }),
  body('pricing.discountPercentage')
    .optional()
    .isNumeric()
    .withMessage('Discount percentage must be a number')
    .custom((value) => {
      if (value < 0 || value > 100) {
        throw new Error('Discount percentage must be between 0-100');
      }
      return true;
    }),
  body('stockSettings.minOrderQuantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Minimum order quantity must be at least 1'),
  body('stockSettings.maxOrderQuantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum order quantity must be at least 1'),
  body('stockSettings.unit')
    .optional()
    .isIn(['piece', 'kg', 'litre', 'ton', 'box', 'carton', 'pallet'])
    .withMessage('Invalid unit type'),
  body('stockSettings.reorderLevel')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Reorder level must be 0 or greater'),
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1-50 characters'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'draft'])
    .withMessage('Status must be active, inactive, or draft'),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean')
], adminController.createProduct);

// GET /api/admin/products/stats - Get product statistics
router.get('/products/stats', adminController.getProductStats);

// GET /api/admin/products/:productId - Get single product by ID
router.get('/products/:productId', adminController.getProductById);

// PUT /api/admin/products/:productId - Update product
router.put('/products/:productId', [
  body('name')
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2-200 characters'),
  body('sku')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('SKU must be between 2-50 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('shortDescription')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Short description must not exceed 500 characters'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Category must be a valid ID'),
  body('brand')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Brand must not exceed 100 characters'),
  body('manufacturer')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Manufacturer must not exceed 100 characters'),
  body('pricing.basePrice')
    .optional()
    .isNumeric()
    .withMessage('Base price must be a number')
    .custom((value) => {
      if (value !== undefined && value < 0) {
        throw new Error('Base price cannot be negative');
      }
      return true;
    }),
  body('pricing.currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-character code'),
  body('pricing.taxRate')
    .optional()
    .isNumeric()
    .withMessage('Tax rate must be a number')
    .custom((value) => {
      if (value !== undefined && (value < 0 || value > 100)) {
        throw new Error('Tax rate must be between 0-100');
      }
      return true;
    }),
  body('pricing.discountPercentage')
    .optional()
    .isNumeric()
    .withMessage('Discount percentage must be a number')
    .custom((value) => {
      if (value !== undefined && (value < 0 || value > 100)) {
        throw new Error('Discount percentage must be between 0-100');
      }
      return true;
    }),
  body('stockSettings.minOrderQuantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Minimum order quantity must be at least 1'),
  body('stockSettings.maxOrderQuantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum order quantity must be at least 1'),
  body('stockSettings.unit')
    .optional()
    .isIn(['piece', 'kg', 'litre', 'ton', 'box', 'carton', 'pallet'])
    .withMessage('Invalid unit type'),
  body('stockSettings.reorderLevel')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Reorder level must be 0 or greater'),
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1-50 characters'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'draft'])
    .withMessage('Status must be active, inactive, or draft'),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean')
], adminController.updateProduct);

// DELETE /api/admin/products/:productId - Delete product
router.delete('/products/:productId', adminController.deleteProduct);

// POST /api/admin/products/bulk-status - Bulk update product status
router.post('/products/bulk-status', [
  body('productIds')
    .isArray({ min: 1 })
    .withMessage('Product IDs must be a non-empty array'),
  body('productIds.*')
    .isMongoId()
    .withMessage('Each product ID must be a valid MongoDB ObjectId'),
  body('status')
    .isIn(['active', 'inactive', 'draft'])
    .withMessage('Status must be active, inactive, or draft')
], adminController.bulkUpdateProductStatus);

// === PORT MANAGEMENT ROUTES ===

// GET /api/admin/ports - Get all ports with filtering and pagination
router.get('/ports', adminController.getPorts);

// POST /api/admin/ports - Create new port
router.post('/ports', [
  body('name')
    .notEmpty()
    .withMessage('Port name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Port name must be between 2-200 characters'),
  body('code')
    .notEmpty()
    .withMessage('Port code is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('Port code must be between 2-20 characters'),
  body('type')
    .notEmpty()
    .withMessage('Port type is required')
    .isIn(['sea', 'air', 'land'])
    .withMessage('Port type must be sea, air, or land'),
  body('address.city')
    .optional()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),
  body('address.state')
    .optional()
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters'),
  body('address.country')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
  body('contactInfo.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('contactInfo.website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive')
], adminController.createPort);

// GET /api/admin/ports/:portId - Get single port by ID
router.get('/ports/:portId', adminController.getPortById);

// PUT /api/admin/ports/:portId - Update port
router.put('/ports/:portId', [
  body('name')
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage('Port name must be between 2-200 characters'),
  body('code')
    .optional()
    .isLength({ min: 2, max: 20 })
    .withMessage('Port code must be between 2-20 characters'),
  body('type')
    .optional()
    .isIn(['sea', 'air', 'land'])
    .withMessage('Port type must be sea, air, or land'),
  body('address.city')
    .optional()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),
  body('address.state')
    .optional()
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters'),
  body('address.country')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
  body('contactInfo.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('contactInfo.website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive')
], adminController.updatePort);

// DELETE /api/admin/ports/:portId - Delete port
router.delete('/ports/:portId', adminController.deletePort);

// === WAREHOUSE MANAGEMENT ROUTES ===

// GET /api/admin/warehouses - Get all warehouses with filtering and pagination
router.get('/warehouses', adminController.getWarehouses);

// POST /api/admin/warehouses - Create new warehouse
router.post('/warehouses', [
  body('name')
    .notEmpty()
    .withMessage('Warehouse name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Warehouse name must be between 2-200 characters'),
  body('code')
    .notEmpty()
    .withMessage('Warehouse code is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('Warehouse code must be between 2-20 characters'),
  body('address.street')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Street must not exceed 200 characters'),
  body('address.city')
    .optional()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),
  body('address.state')
    .optional()
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters'),
  body('address.country')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
  body('address.postalCode')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Postal code must not exceed 20 characters'),
  body('contactPerson.name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Contact person name must not exceed 100 characters'),
  body('contactPerson.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('contactPerson.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('capacity.total')
    .optional()
    .isNumeric()
    .withMessage('Total capacity must be a number')
    .custom((value) => {
      if (value !== undefined && value < 0) {
        throw new Error('Total capacity cannot be negative');
      }
      return true;
    }),
  body('capacity.unit')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Capacity unit must not exceed 20 characters'),
  body('operatingHours.open')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Opening hours must be in HH:MM format'),
  body('operatingHours.close')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Closing hours must be in HH:MM format'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive')
], adminController.createWarehouse);

// GET /api/admin/warehouses/:warehouseId - Get single warehouse by ID
router.get('/warehouses/:warehouseId', adminController.getWarehouseById);

// PUT /api/admin/warehouses/:warehouseId - Update warehouse
router.put('/warehouses/:warehouseId', [
  body('name')
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage('Warehouse name must be between 2-200 characters'),
  body('code')
    .optional()
    .isLength({ min: 2, max: 20 })
    .withMessage('Warehouse code must be between 2-20 characters'),
  body('address.street')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Street must not exceed 200 characters'),
  body('address.city')
    .optional()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),
  body('address.state')
    .optional()
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters'),
  body('address.country')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
  body('address.postalCode')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Postal code must not exceed 20 characters'),
  body('contactPerson.name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Contact person name must not exceed 100 characters'),
  body('contactPerson.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('contactPerson.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('capacity.total')
    .optional()
    .isNumeric()
    .withMessage('Total capacity must be a number')
    .custom((value) => {
      if (value !== undefined && value < 0) {
        throw new Error('Total capacity cannot be negative');
      }
      return true;
    }),
  body('capacity.unit')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Capacity unit must not exceed 20 characters'),
  body('operatingHours.open')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Opening hours must be in HH:MM format'),
  body('operatingHours.close')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Closing hours must be in HH:MM format'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive')
], adminController.updateWarehouse);

// DELETE /api/admin/warehouses/:warehouseId - Delete warehouse
router.delete('/warehouses/:warehouseId', adminController.deleteWarehouse);

// === WAREHOUSE STOCK MANAGEMENT ROUTES ===

// GET /api/admin/warehouse-stocks - Get all warehouse stocks with filtering and pagination
router.get('/warehouse-stocks', adminController.getWarehouseStocks);

// POST /api/admin/warehouse-stocks - Create new warehouse stock record
router.post('/warehouse-stocks', [
  body('warehouse')
    .notEmpty()
    .withMessage('Warehouse is required')
    .isMongoId()
    .withMessage('Warehouse must be a valid ID'),
  body('product')
    .notEmpty()
    .withMessage('Product is required')
    .isMongoId()
    .withMessage('Product must be a valid ID'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('unit')
    .optional()
    .isIn(['piece', 'kg', 'litre', 'ton', 'box', 'carton', 'pallet'])
    .withMessage('Invalid unit type'),
  body('restockAlertLevel')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Restock alert level must be a non-negative integer'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive')
], adminController.createWarehouseStock);

// GET /api/admin/warehouse-stocks/stats - Get warehouse stock statistics
router.get('/warehouse-stocks/stats', adminController.getStockStats);

// GET /api/admin/warehouse-stocks/low-stock - Get low stock alerts
router.get('/warehouse-stocks/low-stock', adminController.getLowStockAlerts);

// GET /api/admin/warehouse-stocks/:stockId - Get single warehouse stock by ID
router.get('/warehouse-stocks/:stockId', adminController.getWarehouseStockById);

// PUT /api/admin/warehouse-stocks/:stockId - Update warehouse stock
router.put('/warehouse-stocks/:stockId', [
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('unit')
    .optional()
    .isIn(['piece', 'kg', 'litre', 'ton', 'box', 'carton', 'pallet'])
    .withMessage('Invalid unit type'),
  body('restockAlertLevel')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Restock alert level must be a non-negative integer'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive')
], adminController.updateWarehouseStock);

// DELETE /api/admin/warehouse-stocks/:stockId - Delete warehouse stock
router.delete('/warehouse-stocks/:stockId', adminController.deleteWarehouseStock);

// POST /api/admin/warehouse-stocks/:stockId/update-quantity - Update stock quantity (in/out/adjustment)
router.post('/warehouse-stocks/:stockId/update-quantity', [
  body('type')
    .notEmpty()
    .withMessage('Update type is required')
    .isIn(['in', 'out', 'adjustment'])
    .withMessage('Type must be in, out, or adjustment'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isFloat({ min: 0.01 })
    .withMessage('Quantity must be greater than 0'),
  body('reference')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Reference must not exceed 200 characters')
], adminController.updateStockQuantity);

// GET /api/admin/warehouse-stocks/:stockId/history - Get stock update history
router.get('/warehouse-stocks/:stockId/history', adminController.getStockHistory);

// === DASHBOARD AND REPORTS ROUTES ===

// GET /api/admin/dashboard/stats - Get comprehensive dashboard statistics
router.get('/dashboard/stats', adminController.getDashboardStats);

// GET /api/admin/dashboard/analytics - Get analytics data for charts
router.get('/dashboard/analytics', adminController.getAnalyticsData);

// === CONTACT QUERIES MANAGEMENT ROUTES ===

// GET /api/admin/contact-queries - Get all contact queries with filtering and pagination
router.get('/contact-queries', adminController.getContactQueries);

// GET /api/admin/contact-queries/:queryId - Get single contact query by ID
router.get('/contact-queries/:queryId', adminController.getContactQueryById);

// PUT /api/admin/contact-queries/:queryId - Update contact query
router.put('/contact-queries/:queryId', [
  body('status')
    .optional()
    .isIn(['read', 'unread', 'responded'])
    .withMessage('Status must be read, unread, or responded'),
  body('response')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Response must not exceed 2000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high')
], adminController.updateContactQuery);

// DELETE /api/admin/contact-queries/:queryId - Delete contact query
router.delete('/contact-queries/:queryId', adminController.deleteContactQuery);

// POST /api/admin/contact-queries/bulk-update - Bulk update contact queries
router.post('/contact-queries/bulk-update', [
  body('queryIds')
    .isArray({ min: 1 })
    .withMessage('Query IDs must be a non-empty array'),
  body('queryIds.*')
    .isMongoId()
    .withMessage('Each query ID must be a valid MongoDB ObjectId'),
  body('status')
    .isIn(['read', 'unread', 'responded'])
    .withMessage('Status must be read, unread, or responded')
], adminController.bulkUpdateContactQueries);

// === CONTENT MANAGEMENT ROUTES ===

// GET /api/admin/content - Get all content pages
router.get('/content', adminController.getContentPages);

// GET /api/admin/content/:identifier - Get single content page by ID or pageType
router.get('/content/:identifier', adminController.getContentPage);

// POST /api/admin/content - Create or update content page
router.post('/content', [
  body('pageType')
    .notEmpty()
    .withMessage('Page type is required')
    .isIn(['about_us', 'terms', 'privacy', 'faq'])
    .withMessage('Page type must be about_us, terms, privacy, or faq'),
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2-200 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  body('metaTitle')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Meta title must not exceed 100 characters'),
  body('metaDescription')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Meta description must not exceed 300 characters'),
  body('status')
    .optional()
    .isIn(['published', 'draft'])
    .withMessage('Status must be published or draft')
], adminController.upsertContentPage);

// PUT /api/admin/content/:identifier - Update content page (alias for POST)
router.put('/content/:identifier', [
  body('pageType')
    .optional()
    .isIn(['about_us', 'terms', 'privacy', 'faq'])
    .withMessage('Page type must be about_us, terms, privacy, or faq'),
  body('title')
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2-200 characters'),
  body('content')
    .optional(),
  body('metaTitle')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Meta title must not exceed 100 characters'),
  body('metaDescription')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Meta description must not exceed 300 characters'),
  body('status')
    .optional()
    .isIn(['published', 'draft'])
    .withMessage('Status must be published or draft')
], adminController.upsertContentPage);

// DELETE /api/admin/content/:id - Delete content page
router.delete('/content/:id', adminController.deleteContentPage);

// === EMAIL MANAGEMENT ROUTES ===

// GET /api/admin/emails - Get all email logs with filtering and pagination
router.get('/emails', adminController.getEmailLogs);

// GET /api/admin/emails/stats - Get email statistics
router.get('/emails/stats', adminController.getEmailStats);

// POST /api/admin/emails/resend - Resend failed emails
router.post('/emails/resend', [
  body('emailIds')
    .isArray({ min: 1 })
    .withMessage('Email IDs must be a non-empty array'),
  body('emailIds.*')
    .isMongoId()
    .withMessage('Each email ID must be a valid MongoDB ObjectId')
], adminController.resendFailedEmails);

// POST /api/admin/emails/clear-old - Clear old email logs
router.post('/emails/clear-old', [
  body('days')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Days must be between 1-365')
], adminController.clearOldEmailLogs);

module.exports = router;