const User = require('../models/User.model');
const Buyer = require('../models/Buyer.model');
const PurchaseOrder = require('../models/PurchaseOrder.model');
const Product = require('../models/Product.model');
const ProductCategory = require('../models/ProductCategory.model');
const Port = require('../models/Port.model');
const Warehouse = require('../models/Warehouse.model');
const WarehouseStock = require('../models/WarehouseStock.model');
const ContactQuery = require('../models/ContactQuery.model');
const ContentPage = require('../models/ContentPage.model');
const { successResponse, errorResponse } = require('../utils/response.utils');
const { validationResult } = require('express-validator');
const xlsx = require('xlsx');

// Module access definitions with dependencies for Admin sub-admins
const ADMIN_MODULE_ACCESS = {
  buyers: { name: 'Buyers Management', dependencies: [] },
  sub_admins: { name: 'Sub-Admins Management', dependencies: [] },
  products: { name: 'Products Management', dependencies: [] },
  categories: { name: 'Product Categories', dependencies: ['products'] },
  warehouses: { name: 'Warehouses Management', dependencies: [] },
  stock: { name: 'Stock Management', dependencies: ['products', 'warehouses'] },
  reports: { name: 'Reports', dependencies: ['stock'] },
  contact_queries: { name: 'Contact Queries', dependencies: [] },
  content_manager: { name: 'Content Manager', dependencies: [] }
};

// SUB-ADMIN MANAGEMENT FUNCTIONS

// Get all sub-admins for the current admin
const getSubAdmins = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Get all users created by this admin with admin role
    const subAdmins = await User.find({
      createdBy: adminId,
      role: 'admin'
    }).select('-password').sort({ createdAt: -1 });

    return successResponse(res, 200, 'Sub-admins retrieved successfully', subAdmins);
  } catch (error) {
    console.error('Error getting sub-admins:', error);
    return errorResponse(res, 500, 'Failed to retrieve sub-admins');
  }
};

// Create new sub-admin
const createSubAdmin = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      moduleAccess,
      status = 'active'
    } = req.body;

    const adminId = req.user._id;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 409, 'User with this email already exists');
    }

    // Validate module access dependencies
    const validatedModuleAccess = validateAdminModuleAccess(moduleAccess);
    if (!validatedModuleAccess.isValid) {
      return errorResponse(res, 400, 'Invalid module access', validatedModuleAccess.errors);
    }

    // Create new sub-admin
    const newSubAdmin = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: 'admin',
      moduleAccess: validatedModuleAccess.moduleAccess,
      status,
      createdBy: adminId,
      isSubUser: true
    });

    await newSubAdmin.save();

    // Return user without password
    const subAdmin = await User.findById(newSubAdmin._id).select('-password');

    return successResponse(res, 201, 'Sub-admin created successfully', subAdmin);
  } catch (error) {
    console.error('Error creating sub-admin:', error);
    return errorResponse(res, 500, 'Failed to create sub-admin');
  }
};

// Get single sub-admin by ID
const getSubAdminById = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user._id;

    const subAdmin = await User.findOne({
      _id: userId,
      createdBy: adminId,
      role: 'admin'
    }).select('-password');

    if (!subAdmin) {
      return errorResponse(res, 404, 'Sub-admin not found');
    }

    return successResponse(res, 200, 'Sub-admin retrieved successfully', subAdmin);
  } catch (error) {
    console.error('Error getting sub-admin:', error);
    return errorResponse(res, 500, 'Failed to retrieve sub-admin');
  }
};

// Update sub-admin
const updateSubAdmin = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { userId } = req.params;
    const adminId = req.user._id;
    const {
      firstName,
      lastName,
      email,
      phone,
      moduleAccess,
      status
    } = req.body;

    // Find sub-admin
    const subAdmin = await User.findOne({
      _id: userId,
      createdBy: adminId,
      role: 'admin'
    });

    if (!subAdmin) {
      return errorResponse(res, 404, 'Sub-admin not found');
    }

    // Check if email already exists (excluding current user)
    if (email && email !== subAdmin.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return errorResponse(res, 409, 'User with this email already exists');
      }
    }

    // Validate module access if provided
    let validatedModuleAccess = { isValid: true, moduleAccess: subAdmin.moduleAccess };
    if (moduleAccess) {
      validatedModuleAccess = validateAdminModuleAccess(moduleAccess);
      if (!validatedModuleAccess.isValid) {
        return errorResponse(res, 400, 'Invalid module access', validatedModuleAccess.errors);
      }
    }

    // Update fields
    if (firstName) subAdmin.firstName = firstName;
    if (lastName) subAdmin.lastName = lastName;
    if (email) subAdmin.email = email;
    if (phone) subAdmin.phone = phone;
    if (moduleAccess) subAdmin.moduleAccess = validatedModuleAccess.moduleAccess;
    if (status) subAdmin.status = status;

    await subAdmin.save();

    // Return updated user without password
    const updatedSubAdmin = await User.findById(userId).select('-password');

    return successResponse(res, 200, 'Sub-admin updated successfully', updatedSubAdmin);
  } catch (error) {
    console.error('Error updating sub-admin:', error);
    return errorResponse(res, 500, 'Failed to update sub-admin');
  }
};

// Update sub-admin status
const updateSubAdminStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    const adminId = req.user._id;

    if (!['active', 'inactive'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status. Must be active or inactive');
    }

    const subAdmin = await User.findOneAndUpdate(
      {
        _id: userId,
        createdBy: adminId,
        role: 'admin'
      },
      { status },
      { new: true }
    ).select('-password');

    if (!subAdmin) {
      return errorResponse(res, 404, 'Sub-admin not found');
    }

    return successResponse(res, 200, 'Sub-admin status updated successfully', subAdmin);
  } catch (error) {
    console.error('Error updating sub-admin status:', error);
    return errorResponse(res, 500, 'Failed to update sub-admin status');
  }
};

// Get available modules for admin
const getAdminModules = async (req, res) => {
  try {
    return successResponse(res, 200, 'Admin modules retrieved successfully', ADMIN_MODULE_ACCESS);
  } catch (error) {
    console.error('Error getting admin modules:', error);
    return errorResponse(res, 500, 'Failed to retrieve admin modules');
  }
};

// BUYER MANAGEMENT FUNCTIONS (Admin level - can see all buyers)

// Get all buyers (Admin can see all buyers in the system)
const getAllBuyers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;

    // Build query - Admin can see all buyers
    const query = {};

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactPersonName: { $regex: search, $options: 'i' } },
        { contactPersonEmail: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const buyers = await Buyer.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Buyer.countDocuments(query);

    return successResponse(res, 200, 'Buyers retrieved successfully', {
      buyers,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        pages: Math.ceil(total / limit),
        count: buyers.length,
        totalCount: total
      }
    });
  } catch (error) {
    console.error('Error getting buyers:', error);
    return errorResponse(res, 500, 'Failed to retrieve buyers');
  }
};

// Create new buyer (Admin)
const createAdminBuyer = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const {
      // User details
      firstName,
      lastName,
      email,
      password,

      // Company details
      companyName,
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone,
      businessType,
      registrationNumber,
      taxId,

      // Address details
      address,
      city,
      state,
      country,
      postalCode,

      status = 'active'
    } = req.body;

    const adminId = req.user._id;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 409, 'User with this email already exists');
    }

    // Create user account for buyer
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'buyer',
      status,
      createdBy: adminId
    });

    await newUser.save();

    // Create buyer profile
    const newBuyer = new Buyer({
      userId: newUser._id,
      companyName,
      contactPersonName,
      contactPersonEmail: contactPersonEmail || email,
      contactPersonPhone,
      businessType,
      registrationNumber,
      taxId,
      address,
      city,
      state,
      country,
      postalCode,
      status,
      createdBy: adminId
    });

    await newBuyer.save();

    // Return buyer with user details
    const buyer = await Buyer.findById(newBuyer._id)
      .populate('userId', 'firstName lastName email role status')
      .populate('createdBy', 'firstName lastName email role');

    return successResponse(res, 201, 'Buyer created successfully', buyer);
  } catch (error) {
    console.error('Error creating buyer:', error);
    return errorResponse(res, 500, 'Failed to create buyer');
  }
};

// Get single buyer by ID (Admin)
const getAdminBuyerById = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const buyer = await Buyer.findById(buyerId)
      .populate('userId', 'firstName lastName email role status')
      .populate('createdBy', 'firstName lastName email role');

    if (!buyer) {
      return errorResponse(res, 404, 'Buyer not found');
    }

    // Get buyer's order statistics
    const orderStats = await PurchaseOrder.aggregate([
      { $match: { buyerId: buyer.userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const stats = {
      totalOrders: 0,
      totalAmount: 0,
      pending: 0,
      processing: 0,
      completed: 0
    };

    orderStats.forEach(stat => {
      stats.totalOrders += stat.count;
      stats.totalAmount += stat.totalAmount;
      if (stat._id === 'pending') stats.pending = stat.count;
      if (stat._id === 'processing') stats.processing = stat.count;
      if (stat._id === 'completed') stats.completed = stat.count;
    });

    return successResponse(res, 200, 'Buyer retrieved successfully', {
      buyer,
      orderStats: stats
    });
  } catch (error) {
    console.error('Error getting buyer:', error);
    return errorResponse(res, 500, 'Failed to retrieve buyer');
  }
};

// Update buyer (Admin)
const updateAdminBuyer = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { buyerId } = req.params;
    const updateData = req.body;

    // Find buyer
    const buyer = await Buyer.findById(buyerId).populate('userId');

    if (!buyer) {
      return errorResponse(res, 404, 'Buyer not found');
    }

    // Update user details if provided
    if (updateData.firstName || updateData.lastName || updateData.email) {
      const userUpdateData = {};
      if (updateData.firstName) userUpdateData.firstName = updateData.firstName;
      if (updateData.lastName) userUpdateData.lastName = updateData.lastName;
      if (updateData.email) {
        // Check if email already exists (excluding current user)
        const existingUser = await User.findOne({
          email: updateData.email,
          _id: { $ne: buyer.userId }
        });
        if (existingUser) {
          return errorResponse(res, 409, 'User with this email already exists');
        }
        userUpdateData.email = updateData.email;
      }

      await User.findByIdAndUpdate(buyer.userId, userUpdateData);
    }

    // Update buyer details
    const buyerUpdateData = { ...updateData };
    delete buyerUpdateData.firstName;
    delete buyerUpdateData.lastName;
    delete buyerUpdateData.email;
    delete buyerUpdateData.password;

    const updatedBuyer = await Buyer.findByIdAndUpdate(
      buyerId,
      buyerUpdateData,
      { new: true }
    ).populate('userId', 'firstName lastName email role status')
      .populate('createdBy', 'firstName lastName email role');

    return successResponse(res, 200, 'Buyer updated successfully', updatedBuyer);
  } catch (error) {
    console.error('Error updating buyer:', error);
    return errorResponse(res, 500, 'Failed to update buyer');
  }
};

// Update buyer status (Admin)
const updateAdminBuyerStatus = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status. Must be active or inactive');
    }

    const buyer = await Buyer.findById(buyerId);
    if (!buyer) {
      return errorResponse(res, 404, 'Buyer not found');
    }

    // Update both buyer and user status
    await Promise.all([
      Buyer.findByIdAndUpdate(buyerId, { status }),
      User.findByIdAndUpdate(buyer.userId, { status })
    ]);

    const updatedBuyer = await Buyer.findById(buyerId)
      .populate('userId', 'firstName lastName email role status')
      .populate('createdBy', 'firstName lastName email role');

    return successResponse(res, 200, 'Buyer status updated successfully', updatedBuyer);
  } catch (error) {
    console.error('Error updating buyer status:', error);
    return errorResponse(res, 500, 'Failed to update buyer status');
  }
};

// Export all buyers to Excel/CSV (Admin)
const exportAllBuyers = async (req, res) => {
  try {
    const { format = 'xlsx' } = req.query;

    const buyers = await Buyer.find({})
      .populate('userId', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email role')
      .sort({ createdAt: -1 });

    // Prepare data for export
    const exportData = buyers.map(buyer => ({
      'Company Name': buyer.companyName,
      'Contact Person': buyer.contactPersonName,
      'Email': buyer.contactPersonEmail,
      'Phone': buyer.contactPersonPhone,
      'Business Type': buyer.businessType,
      'Registration Number': buyer.registrationNumber,
      'Tax ID': buyer.taxId,
      'Address': buyer.address,
      'City': buyer.city,
      'State': buyer.state,
      'Country': buyer.country,
      'Postal Code': buyer.postalCode,
      'Status': buyer.status,
      'Created By': buyer.createdBy ? `${buyer.createdBy.firstName} ${buyer.createdBy.lastName} (${buyer.createdBy.role})` : '',
      'Created Date': buyer.createdAt.toLocaleDateString()
    }));

    // Create workbook
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(exportData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'All Buyers');

    // Set response headers
    const filename = `all-buyers-export-${new Date().toISOString().split('T')[0]}.${format}`;
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      const csv = xlsx.utils.sheet_to_csv(worksheet);
      return res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      return res.send(buffer);
    }
  } catch (error) {
    console.error('Error exporting buyers:', error);
    return errorResponse(res, 500, 'Failed to export buyers');
  }
};

// Helper function to validate admin module access with dependencies
const validateAdminModuleAccess = (moduleAccess) => {
  const errors = [];
  const validatedAccess = {};

  // Ensure all selected modules have their dependencies
  for (const [module, hasAccess] of Object.entries(moduleAccess)) {
    if (hasAccess && ADMIN_MODULE_ACCESS[module]) {
      // Add the module
      validatedAccess[module] = true;

      // Ensure dependencies are also enabled
      const dependencies = ADMIN_MODULE_ACCESS[module].dependencies;
      dependencies.forEach(dep => {
        if (!moduleAccess[dep]) {
          errors.push(`Module '${module}' requires '${dep}' to be enabled`);
        } else {
          validatedAccess[dep] = true;
        }
      });
    } else if (!hasAccess) {
      validatedAccess[module] = false;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    moduleAccess: validatedAccess
  };
};

// PRODUCT CATEGORY MANAGEMENT FUNCTIONS

// Get all product categories with hierarchy
const getProductCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status = 'all', format = 'paginated' } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (status !== 'all') {
      query.status = status;
    }

    if (format === 'tree') {
      // Return tree structure
      const categories = await ProductCategory.find(query)
        .populate('parentCategory', 'name')
        .sort({ level: 1, name: 1 });

      return successResponse(res, 200, 'Product categories retrieved successfully', { categories });
    } else {
      // Return paginated results
      const skip = (page - 1) * limit;

      const [categories, totalCategories] = await Promise.all([
        ProductCategory.find(query)
          .populate('parentCategory', 'name')
          .populate('createdBy', 'firstName lastName email')
          .sort({ level: 1, name: 1 })
          .skip(skip)
          .limit(parseInt(limit)),
        ProductCategory.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCategories / limit);

      return successResponse(res, 200, 'Product categories retrieved successfully', {
        categories,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCategories,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    }
  } catch (error) {
    console.error('Error getting product categories:', error);
    return errorResponse(res, 500, 'Failed to retrieve product categories');
  }
};

// Create new product category
const createProductCategory = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { name, parentCategory, status = 'active', description } = req.body;
    const adminId = req.user._id;

    // Check if category name already exists
    const existingCategory = await ProductCategory.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existingCategory) {
      return errorResponse(res, 409, 'Product category with this name already exists');
    }

    // If parent category is specified, validate it exists and is active
    if (parentCategory) {
      const parent = await ProductCategory.findById(parentCategory);
      if (!parent) {
        return errorResponse(res, 404, 'Parent category not found');
      }
      if (parent.status !== 'active') {
        return errorResponse(res, 400, 'Cannot assign inactive parent category');
      }
    }

    // Calculate level
    let level = 0;
    if (parentCategory) {
      const parent = await ProductCategory.findById(parentCategory);
      level = parent.level + 1;
    }

    // Create new category
    const newCategory = new ProductCategory({
      name,
      parentCategory: parentCategory || null,
      level,
      status,
      description,
      createdBy: adminId
    });

    await newCategory.save();

    // Populate references before returning
    const category = await ProductCategory.findById(newCategory._id)
      .populate('parentCategory', 'name')
      .populate('createdBy', 'firstName lastName email');

    return successResponse(res, 201, 'Product category created successfully', category);
  } catch (error) {
    console.error('Error creating product category:', error);
    return errorResponse(res, 500, 'Failed to create product category');
  }
};

// Get single product category by ID
const getProductCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await ProductCategory.findById(categoryId)
      .populate('parentCategory', 'name level')
      .populate('createdBy', 'firstName lastName email');

    if (!category) {
      return errorResponse(res, 404, 'Product category not found');
    }

    // Get children categories
    const children = await ProductCategory.find({ parentCategory: categoryId })
      .select('name status level')
      .sort({ name: 1 });

    // Get products count in this category (if Product model has category reference)
    let productsCount = 0;
    try {
      productsCount = await Product.countDocuments({ categoryId: categoryId });
    } catch (error) {
      // Product model might not exist yet, ignore error
      console.log('Product count not available:', error.message);
    }

    const categoryWithDetails = {
      ...category.toObject(),
      children,
      productsCount
    };

    return successResponse(res, 200, 'Product category details retrieved successfully', categoryWithDetails);
  } catch (error) {
    console.error('Error getting product category:', error);
    return errorResponse(res, 500, 'Failed to retrieve product category');
  }
};

// Update product category
const updateProductCategory = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { categoryId } = req.params;
    const { name, parentCategory, status, description } = req.body;

    const category = await ProductCategory.findById(categoryId);
    if (!category) {
      return errorResponse(res, 404, 'Product category not found');
    }

    // Check if new name conflicts with existing (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await ProductCategory.findOne({
        name: { $regex: `^${name}$`, $options: 'i' },
        _id: { $ne: categoryId }
      });
      if (existingCategory) {
        return errorResponse(res, 409, 'Product category with this name already exists');
      }
    }

    // Validate parent category change to prevent circular reference
    if (parentCategory && parentCategory !== category.parentCategory?.toString()) {
      // Check if new parent exists and is active
      const newParent = await ProductCategory.findById(parentCategory);
      if (!newParent) {
        return errorResponse(res, 404, 'Parent category not found');
      }
      if (newParent.status !== 'active') {
        return errorResponse(res, 400, 'Cannot assign inactive parent category');
      }

      // Check for circular reference - new parent cannot be a descendant of current category
      const descendants = await ProductCategory.find({
        $or: [
          { parentCategory: categoryId },
          // Add recursive check for deeper levels if needed
        ]
      });

      if (descendants.some(desc => desc._id.toString() === parentCategory)) {
        return errorResponse(res, 400, 'Cannot create circular reference - selected parent is a descendant of this category');
      }
    }

    // Calculate new level if parent changes
    let newLevel = category.level;
    if (parentCategory !== category.parentCategory?.toString()) {
      if (parentCategory) {
        const parent = await ProductCategory.findById(parentCategory);
        newLevel = parent.level + 1;
      } else {
        newLevel = 0;
      }
    }

    // Update category
    const updatedCategory = await ProductCategory.findByIdAndUpdate(
      categoryId,
      {
        ...(name && { name }),
        ...(parentCategory !== undefined && { parentCategory: parentCategory || null }),
        ...(status && { status }),
        ...(description !== undefined && { description }),
        level: newLevel
      },
      { new: true, runValidators: true }
    ).populate('parentCategory', 'name')
      .populate('createdBy', 'firstName lastName email');

    // If parent changed, update levels of all descendants
    if (parentCategory !== category.parentCategory?.toString()) {
      await updateDescendantLevels(categoryId, newLevel);
    }

    return successResponse(res, 200, 'Product category updated successfully', updatedCategory);
  } catch (error) {
    console.error('Error updating product category:', error);
    return errorResponse(res, 500, 'Failed to update product category');
  }
};

// Delete product category (soft delete)
const deleteProductCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await ProductCategory.findById(categoryId);
    if (!category) {
      return errorResponse(res, 404, 'Product category not found');
    }

    // Check if category has children
    const childrenCount = await ProductCategory.countDocuments({ parentCategory: categoryId });
    if (childrenCount > 0) {
      return errorResponse(res, 400, 'Cannot delete category with child categories. Please delete or reassign child categories first.');
    }

    // Check if category has products (if Product model exists)
    let productsCount = 0;
    try {
      productsCount = await Product.countDocuments({ categoryId: categoryId });
    } catch (error) {
      console.log('Product count check not available:', error.message);
    }

    if (productsCount > 0) {
      return errorResponse(res, 400, `Cannot delete category with ${productsCount} associated products. Please reassign or delete products first.`);
    }

    // Soft delete - set status to inactive
    await ProductCategory.findByIdAndUpdate(categoryId, { status: 'inactive' });

    return successResponse(res, 200, 'Product category deleted successfully');
  } catch (error) {
    console.error('Error deleting product category:', error);
    return errorResponse(res, 500, 'Failed to delete product category');
  }
};

// PRODUCT MANAGEMENT FUNCTIONS

// Get all products with filtering and pagination
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status, brand, featured } = req.query;

    // Build query
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Brand filter
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .populate('createdBy', 'firstname lastname email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    return successResponse(res, 200, 'Products retrieved successfully', {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error getting products:', error);
    return errorResponse(res, 500, 'Failed to retrieve products');
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      description,
      shortDescription,
      category,
      brand,
      manufacturer,
      specifications,
      pricing,
      stockSettings,
      images,
      customAttributes,
      tags,
      status = 'active',
      isFeatured = false
    } = req.body;

    // Check if SKU already exists
    const existingSku = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingSku) {
      return errorResponse(res, 400, 'Product with this SKU already exists');
    }

    // Verify category exists
    const categoryDoc = await ProductCategory.findOne({ _id: category, status: 'active' });
    if (!categoryDoc) {
      return errorResponse(res, 400, 'Invalid or inactive product category');
    }

    // Create product
    const product = new Product({
      name,
      sku: sku.toUpperCase(),
      description,
      shortDescription,
      category,
      brand,
      manufacturer,
      specifications,
      pricing,
      stockSettings,
      images,
      customAttributes,
      tags,
      status,
      isFeatured,
      createdBy: req.user._id
    });

    await product.save();

    // Populate the product before returning
    await product.populate('category', 'name');
    await product.populate('createdBy', 'firstname lastname email');

    return successResponse(res, 201, 'Product created successfully', product);

  } catch (error) {
    console.error('Error creating product:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return errorResponse(res, 400, `Product with this ${field} already exists`);
    }
    return errorResponse(res, 500, 'Failed to create product');
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('category', 'name parentCategory level')
      .populate('createdBy', 'firstname lastname email');

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    return successResponse(res, 200, 'Product retrieved successfully', product);

  } catch (error) {
    console.error('Error getting product by ID:', error);
    return errorResponse(res, 500, 'Failed to retrieve product');
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return errorResponse(res, 404, 'Product not found');
    }

    // If SKU is being updated, check for uniqueness
    if (updateData.sku && updateData.sku.toUpperCase() !== existingProduct.sku) {
      const existingSku = await Product.findOne({
        sku: updateData.sku.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingSku) {
        return errorResponse(res, 400, 'Product with this SKU already exists');
      }
      updateData.sku = updateData.sku.toUpperCase();
    }

    // Verify category if being updated
    if (updateData.category) {
      const categoryDoc = await ProductCategory.findOne({
        _id: updateData.category,
        status: 'active'
      });
      if (!categoryDoc) {
        return errorResponse(res, 400, 'Invalid or inactive product category');
      }
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name')
      .populate('createdBy', 'firstname lastname email');

    return successResponse(res, 200, 'Product updated successfully', product);

  } catch (error) {
    console.error('Error updating product:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return errorResponse(res, 400, `Product with this ${field} already exists`);
    }
    return errorResponse(res, 500, 'Failed to update product');
  }
};

// Delete product (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    // Check if product is used in any purchase orders (you might need to add this check)
    // For now, we'll just delete the product

    // Soft delete by setting status to inactive
    await Product.findByIdAndUpdate(id, { status: 'inactive' });

    return successResponse(res, 200, 'Product deleted successfully');

  } catch (error) {
    console.error('Error deleting product:', error);
    return errorResponse(res, 500, 'Failed to delete product');
  }
};

// Bulk operations
const bulkUpdateProductStatus = async (req, res) => {
  try {
    const { productIds, status } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return errorResponse(res, 400, 'Product IDs array is required');
    }

    if (!['active', 'inactive', 'draft'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status value');
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { status }
    );

    return successResponse(res, 200, `${result.modifiedCount} products updated successfully`);

  } catch (error) {
    console.error('Error bulk updating products:', error);
    return errorResponse(res, 500, 'Failed to update products');
  }
};

// Get product statistics
const getProductStats = async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      draftProducts,
      inactiveProducts,
      featuredProducts,
      recentProducts
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ status: 'draft' }),
      Product.countDocuments({ status: 'inactive' }),
      Product.countDocuments({ isFeatured: true, status: 'active' }),
      Product.find({ status: 'active' })
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    // Get products by category
    const productsByCategory = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'productcategories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          categoryName: '$category.name',
          count: 1
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return successResponse(res, 200, 'Product statistics retrieved successfully', {
      totalProducts,
      activeProducts,
      draftProducts,
      inactiveProducts,
      featuredProducts,
      productsByCategory,
      recentProducts
    });

  } catch (error) {
    console.error('Error getting product stats:', error);
    return errorResponse(res, 500, 'Failed to retrieve product statistics');
  }
};

// PORT MANAGEMENT FUNCTIONS

// Get all ports with filtering and pagination
const getPorts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, type, status } = req.query;

    // Build query
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    // Type filter
    if (type && type !== 'all') {
      query.type = type;
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [ports, total] = await Promise.all([
      Port.find(query)
        .populate('createdBy', 'firstname lastname email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Port.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    return successResponse(res, 200, 'Ports retrieved successfully', {
      ports,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error getting ports:', error);
    return errorResponse(res, 500, 'Failed to retrieve ports');
  }
};

// Create new port
const createPort = async (req, res) => {
  try {
    const {
      name,
      code,
      type,
      address,
      contactInfo,
      status = 'active'
    } = req.body;

    // Check if code already exists
    const existingCode = await Port.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return errorResponse(res, 400, 'Port with this code already exists');
    }

    // Create port
    const port = new Port({
      name,
      code: code.toUpperCase(),
      type,
      address,
      contactInfo,
      status,
      createdBy: req.user._id
    });

    await port.save();

    // Populate the port before returning
    await port.populate('createdBy', 'firstname lastname email');

    return successResponse(res, 201, 'Port created successfully', port);

  } catch (error) {
    console.error('Error creating port:', error);
    if (error.code === 11000) {
      return errorResponse(res, 400, 'Port with this code already exists');
    }
    return errorResponse(res, 500, 'Failed to create port');
  }
};

// Get single port by ID
const getPortById = async (req, res) => {
  try {
    const { id } = req.params;

    const port = await Port.findById(id)
      .populate('createdBy', 'firstname lastname email');

    if (!port) {
      return errorResponse(res, 404, 'Port not found');
    }

    return successResponse(res, 200, 'Port retrieved successfully', port);

  } catch (error) {
    console.error('Error getting port by ID:', error);
    return errorResponse(res, 500, 'Failed to retrieve port');
  }
};

// Update port
const updatePort = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if port exists
    const existingPort = await Port.findById(id);
    if (!existingPort) {
      return errorResponse(res, 404, 'Port not found');
    }

    // If code is being updated, check for uniqueness
    if (updateData.code && updateData.code.toUpperCase() !== existingPort.code) {
      const existingCode = await Port.findOne({
        code: updateData.code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingCode) {
        return errorResponse(res, 400, 'Port with this code already exists');
      }
      updateData.code = updateData.code.toUpperCase();
    }

    // Update port
    const port = await Port.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstname lastname email');

    return successResponse(res, 200, 'Port updated successfully', port);

  } catch (error) {
    console.error('Error updating port:', error);
    if (error.code === 11000) {
      return errorResponse(res, 400, 'Port with this code already exists');
    }
    return errorResponse(res, 500, 'Failed to update port');
  }
};

// Delete port
const deletePort = async (req, res) => {
  try {
    const { id } = req.params;

    const port = await Port.findById(id);
    if (!port) {
      return errorResponse(res, 404, 'Port not found');
    }

    // Soft delete by setting status to inactive
    await Port.findByIdAndUpdate(id, { status: 'inactive' });

    return successResponse(res, 200, 'Port deleted successfully');

  } catch (error) {
    console.error('Error deleting port:', error);
    return errorResponse(res, 500, 'Failed to delete port');
  }
};

// WAREHOUSE MANAGEMENT FUNCTIONS

// Get all warehouses with filtering and pagination
const getWarehouses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, city } = req.query;

    // Build query
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // City filter
    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [warehouses, total] = await Promise.all([
      Warehouse.find(query)
        .populate('createdBy', 'firstname lastname email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Warehouse.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    return successResponse(res, 200, 'Warehouses retrieved successfully', {
      warehouses,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error getting warehouses:', error);
    return errorResponse(res, 500, 'Failed to retrieve warehouses');
  }
};

// Create new warehouse
const createWarehouse = async (req, res) => {
  try {
    const {
      name,
      code,
      address,
      contactPerson,
      capacity,
      operatingHours,
      status = 'active'
    } = req.body;

    // Check if code already exists
    const existingCode = await Warehouse.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return errorResponse(res, 400, 'Warehouse with this code already exists');
    }

    // Create warehouse
    const warehouse = new Warehouse({
      name,
      code: code.toUpperCase(),
      address,
      contactPerson,
      capacity,
      operatingHours,
      status,
      createdBy: req.user._id
    });

    await warehouse.save();

    // Populate the warehouse before returning
    await warehouse.populate('createdBy', 'firstname lastname email');

    return successResponse(res, 201, 'Warehouse created successfully', warehouse);

  } catch (error) {
    console.error('Error creating warehouse:', error);
    if (error.code === 11000) {
      return errorResponse(res, 400, 'Warehouse with this code already exists');
    }
    return errorResponse(res, 500, 'Failed to create warehouse');
  }
};

// Get single warehouse by ID
const getWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await Warehouse.findById(id)
      .populate('createdBy', 'firstname lastname email');

    if (!warehouse) {
      return errorResponse(res, 404, 'Warehouse not found');
    }

    return successResponse(res, 200, 'Warehouse retrieved successfully', warehouse);

  } catch (error) {
    console.error('Error getting warehouse by ID:', error);
    return errorResponse(res, 500, 'Failed to retrieve warehouse');
  }
};

// Update warehouse
const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if warehouse exists
    const existingWarehouse = await Warehouse.findById(id);
    if (!existingWarehouse) {
      return errorResponse(res, 404, 'Warehouse not found');
    }

    // If code is being updated, check for uniqueness
    if (updateData.code && updateData.code.toUpperCase() !== existingWarehouse.code) {
      const existingCode = await Warehouse.findOne({
        code: updateData.code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingCode) {
        return errorResponse(res, 400, 'Warehouse with this code already exists');
      }
      updateData.code = updateData.code.toUpperCase();
    }

    // Update warehouse
    const warehouse = await Warehouse.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstname lastname email');

    return successResponse(res, 200, 'Warehouse updated successfully', warehouse);

  } catch (error) {
    console.error('Error updating warehouse:', error);
    if (error.code === 11000) {
      return errorResponse(res, 400, 'Warehouse with this code already exists');
    }
    return errorResponse(res, 500, 'Failed to update warehouse');
  }
};

// Delete warehouse
const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      return errorResponse(res, 404, 'Warehouse not found');
    }

    // Check if warehouse has any stock (you might need to add this check)
    // For now, we'll just delete the warehouse

    // Soft delete by setting status to inactive
    await Warehouse.findByIdAndUpdate(id, { status: 'inactive' });

    return successResponse(res, 200, 'Warehouse deleted successfully');

  } catch (error) {
    console.error('Error deleting warehouse:', error);
    return errorResponse(res, 500, 'Failed to delete warehouse');
  }
};

// WAREHOUSE STOCK MANAGEMENT FUNCTIONS

// Get all stock records with filtering and pagination
const getWarehouseStocks = async (req, res) => {
  try {
    const { page = 1, limit = 10, warehouse, product, lowStock, status } = req.query;

    // Build query
    let query = {};

    // Warehouse filter
    if (warehouse) {
      query.warehouse = warehouse;
    }

    // Product filter
    if (product) {
      query.product = product;
    }

    // Low stock filter
    if (lowStock === 'true') {
      query.isLowStock = true;
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [stocks, total] = await Promise.all([
      WarehouseStock.find(query)
        .populate('warehouse', 'name code')
        .populate('product', 'name sku')
        .populate('createdBy', 'firstname lastname email')
        .sort({ lastStockUpdate: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      WarehouseStock.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    return successResponse(res, 200, 'Warehouse stocks retrieved successfully', {
      stocks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error getting warehouse stocks:', error);
    return errorResponse(res, 500, 'Failed to retrieve warehouse stocks');
  }
};

// Create new stock record
const createWarehouseStock = async (req, res) => {
  try {
    const {
      warehouse,
      product,
      quantity = 0,
      unit = 'piece',
      restockAlertLevel = 10,
      status = 'active'
    } = req.body;

    // Check if stock record already exists
    const existingStock = await WarehouseStock.findOne({ warehouse, product });
    if (existingStock) {
      return errorResponse(res, 400, 'Stock record already exists for this warehouse-product combination');
    }

    // Verify warehouse and product exist
    const [warehouseDoc, productDoc] = await Promise.all([
      Warehouse.findOne({ _id: warehouse, status: 'active' }),
      Product.findOne({ _id: product, status: 'active' })
    ]);

    if (!warehouseDoc) {
      return errorResponse(res, 400, 'Invalid or inactive warehouse');
    }

    if (!productDoc) {
      return errorResponse(res, 400, 'Invalid or inactive product');
    }

    // Create stock record
    const stock = new WarehouseStock({
      warehouse,
      product,
      quantity,
      unit,
      restockAlertLevel,
      status,
      createdBy: req.user._id
    });

    // Add initial stock entry to history if quantity > 0
    if (quantity > 0) {
      stock.stockHistory.push({
        type: 'in',
        quantity,
        reference: 'Initial Stock',
        previousQuantity: 0,
        newQuantity: quantity,
        updatedBy: req.user._id
      });
    }

    await stock.save();

    // Populate the stock before returning
    await stock.populate('warehouse', 'name code');
    await stock.populate('product', 'name sku');
    await stock.populate('createdBy', 'firstname lastname email');

    return successResponse(res, 201, 'Warehouse stock created successfully', stock);

  } catch (error) {
    console.error('Error creating warehouse stock:', error);
    if (error.code === 11000) {
      return errorResponse(res, 400, 'Stock record already exists for this warehouse-product combination');
    }
    return errorResponse(res, 500, 'Failed to create warehouse stock');
  }
};

// Get single stock record by ID
const getWarehouseStockById = async (req, res) => {
  try {
    const { id } = req.params;

    const stock = await WarehouseStock.findById(id)
      .populate('warehouse', 'name code address')
      .populate('product', 'name sku category')
      .populate('createdBy', 'firstname lastname email')
      .populate('stockHistory.updatedBy', 'firstname lastname');

    if (!stock) {
      return errorResponse(res, 404, 'Stock record not found');
    }

    return successResponse(res, 200, 'Warehouse stock retrieved successfully', stock);

  } catch (error) {
    console.error('Error getting warehouse stock by ID:', error);
    return errorResponse(res, 500, 'Failed to retrieve warehouse stock');
  }
};

// Update stock record
const updateWarehouseStock = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if stock exists
    const existingStock = await WarehouseStock.findById(id);
    if (!existingStock) {
      return errorResponse(res, 404, 'Stock record not found');
    }

    // Update stock record
    const stock = await WarehouseStock.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('warehouse', 'name code')
      .populate('product', 'name sku')
      .populate('createdBy', 'firstname lastname email');

    return successResponse(res, 200, 'Warehouse stock updated successfully', stock);

  } catch (error) {
    console.error('Error updating warehouse stock:', error);
    return errorResponse(res, 500, 'Failed to update warehouse stock');
  }
};

// Delete stock record
const deleteWarehouseStock = async (req, res) => {
  try {
    const { id } = req.params;

    const stock = await WarehouseStock.findById(id);
    if (!stock) {
      return errorResponse(res, 404, 'Stock record not found');
    }

    // Soft delete by setting status to inactive
    await WarehouseStock.findByIdAndUpdate(id, { status: 'inactive' });

    return successResponse(res, 200, 'Warehouse stock deleted successfully');

  } catch (error) {
    console.error('Error deleting warehouse stock:', error);
    return errorResponse(res, 500, 'Failed to delete warehouse stock');
  }
};

// Update stock quantity (stock in/out/adjustment)
const updateStockQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, quantity, reference } = req.body;

    if (!['in', 'out', 'adjustment'].includes(type)) {
      return errorResponse(res, 400, 'Invalid stock update type');
    }

    if (!quantity || quantity <= 0) {
      return errorResponse(res, 400, 'Quantity must be greater than 0');
    }

    const stock = await WarehouseStock.findById(id);
    if (!stock) {
      return errorResponse(res, 404, 'Stock record not found');
    }

    // Use the static method to update stock
    const updatedStock = await WarehouseStock.updateStock(
      stock.warehouse,
      stock.product,
      quantity,
      type,
      reference || `Manual ${type}`,
      req.user._id
    );

    // Populate the stock before returning
    await updatedStock.populate('warehouse', 'name code');
    await updatedStock.populate('product', 'name sku');

    return successResponse(res, 200, 'Stock quantity updated successfully', updatedStock);

  } catch (error) {
    console.error('Error updating stock quantity:', error);
    if (error.message === 'Stock record not found' || error.message === 'Insufficient stock') {
      return errorResponse(res, 400, error.message);
    }
    return errorResponse(res, 500, 'Failed to update stock quantity');
  }
};

// Get stock history for a specific stock record
const getStockHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const stock = await WarehouseStock.findById(id);
    if (!stock) {
      return errorResponse(res, 404, 'Stock record not found');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalHistory = stock.stockHistory.length;

    // Get paginated history (sorted by most recent first)
    const history = stock.stockHistory
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(skip, skip + parseInt(limit));

    const totalPages = Math.ceil(totalHistory / parseInt(limit));

    return successResponse(res, 200, 'Stock history retrieved successfully', {
      history,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total: totalHistory,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error getting stock history:', error);
    return errorResponse(res, 500, 'Failed to retrieve stock history');
  }
};

// Get low stock alerts
const getLowStockAlerts = async (req, res) => {
  try {
    const { warehouse } = req.query;

    const query = { isLowStock: true, status: 'active' };

    if (warehouse) {
      query.warehouse = warehouse;
    }

    const lowStockItems = await WarehouseStock.find(query)
      .populate('warehouse', 'name code')
      .populate('product', 'name sku')
      .sort({ quantity: 1 }); // Sort by lowest quantity first

    return successResponse(res, 200, 'Low stock alerts retrieved successfully', {
      lowStockItems,
      count: lowStockItems.length
    });

  } catch (error) {
    console.error('Error getting low stock alerts:', error);
    return errorResponse(res, 500, 'Failed to retrieve low stock alerts');
  }
};

// Get stock statistics
const getStockStats = async (req, res) => {
  try {
    const [
      totalStockRecords,
      activeStockRecords,
      lowStockCount,
      outOfStockCount
    ] = await Promise.all([
      WarehouseStock.countDocuments(),
      WarehouseStock.countDocuments({ status: 'active' }),
      WarehouseStock.countDocuments({ isLowStock: true, status: 'active' }),
      WarehouseStock.countDocuments({ quantity: 0, status: 'active' })
    ]);

    // Get stock by warehouse
    const stockByWarehouse = await WarehouseStock.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$warehouse',
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          lowStockItems: {
            $sum: {
              $cond: ['$isLowStock', 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'warehouses',
          localField: '_id',
          foreignField: '_id',
          as: 'warehouse'
        }
      },
      { $unwind: '$warehouse' },
      {
        $project: {
          warehouseName: '$warehouse.name',
          warehouseCode: '$warehouse.code',
          totalItems: 1,
          totalQuantity: 1,
          lowStockItems: 1
        }
      },
      { $sort: { totalItems: -1 } }
    ]);

    return successResponse(res, 200, 'Stock statistics retrieved successfully', {
      totalStockRecords,
      activeStockRecords,
      lowStockCount,
      outOfStockCount,
      stockByWarehouse
    });

  } catch (error) {
    console.error('Error getting stock stats:', error);
    return errorResponse(res, 500, 'Failed to retrieve stock statistics');
  }
};

// DASHBOARD AND REPORTS FUNCTIONS

// Get comprehensive dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // Default to last 30 days
    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Users and Buyers Statistics
    const [
      totalUsers,
      activeUsers,
      totalBuyers,
      activeBuyers,
      recentUsers,
      recentBuyers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      Buyer.countDocuments(),
      Buyer.countDocuments({ status: 'active' }),
      User.countDocuments({ createdAt: { $gte: startDate } }),
      Buyer.countDocuments({ createdAt: { $gte: startDate } })
    ]);

    // Products and Categories Statistics
    const [
      totalProducts,
      activeProducts,
      totalCategories,
      activeCategories,
      featuredProducts,
      lowStockProducts
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      ProductCategory.countDocuments(),
      ProductCategory.countDocuments({ status: 'active' }),
      Product.countDocuments({ isFeatured: true, status: 'active' }),
      WarehouseStock.countDocuments({ isLowStock: true, status: 'active' })
    ]);

    // Warehouses and Ports Statistics
    const [
      totalWarehouses,
      activeWarehouses,
      totalPorts,
      activePorts,
      totalStockRecords,
      outOfStockItems
    ] = await Promise.all([
      Warehouse.countDocuments(),
      Warehouse.countDocuments({ status: 'active' }),
      Port.countDocuments(),
      Port.countDocuments({ status: 'active' }),
      WarehouseStock.countDocuments({ status: 'active' }),
      WarehouseStock.countDocuments({ quantity: 0, status: 'active' })
    ]);

    // Purchase Orders Statistics (if available)
    const [
      totalPurchaseOrders,
      pendingOrders,
      recentOrders
    ] = await Promise.all([
      PurchaseOrder.countDocuments().catch(() => 0),
      PurchaseOrder.countDocuments({ status: 'pending' }).catch(() => 0),
      PurchaseOrder.countDocuments({ createdAt: { $gte: startDate } }).catch(() => 0)
    ]);

    // Contact Queries Statistics
    const [
      totalContactQueries,
      unreadQueries,
      recentQueries
    ] = await Promise.all([
      ContactQuery.countDocuments().catch(() => 0),
      ContactQuery.countDocuments({ status: 'unread' }).catch(() => 0),
      ContactQuery.countDocuments({ createdAt: { $gte: startDate } }).catch(() => 0)
    ]);

    // Content Pages Statistics
    const [
      totalContentPages,
      publishedPages
    ] = await Promise.all([
      ContentPage.countDocuments().catch(() => 0),
      ContentPage.countDocuments({ status: 'published' }).catch(() => 0)
    ]);

    // Growth analytics (compared to previous period)
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - periodDays);

    const [
      prevUsers,
      prevBuyers,
      prevProducts,
      prevOrders
    ] = await Promise.all([
      User.countDocuments({
        createdAt: { $gte: prevStartDate, $lt: startDate }
      }),
      Buyer.countDocuments({
        createdAt: { $gte: prevStartDate, $lt: startDate }
      }),
      Product.countDocuments({
        createdAt: { $gte: prevStartDate, $lt: startDate }
      }),
      PurchaseOrder.countDocuments({
        createdAt: { $gte: prevStartDate, $lt: startDate }
      }).catch(() => 0)
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const growth = {
      users: calculateGrowth(recentUsers, prevUsers),
      buyers: calculateGrowth(recentBuyers, prevBuyers),
      products: calculateGrowth(
        await Product.countDocuments({ createdAt: { $gte: startDate } }),
        prevProducts
      ),
      orders: calculateGrowth(recentOrders, prevOrders)
    };

    // Recent activities
    const recentActivities = await Promise.all([
      User.find({ createdAt: { $gte: startDate } })
        .select('firstname lastname email createdAt')
        .limit(5)
        .sort({ createdAt: -1 }),
      Buyer.find({ createdAt: { $gte: startDate } })
        .select('companyName contactName email createdAt')
        .limit(5)
        .sort({ createdAt: -1 }),
      Product.find({ createdAt: { $gte: startDate } })
        .select('name sku createdAt')
        .limit(5)
        .sort({ createdAt: -1 })
    ]);

    return successResponse(res, 200, 'Dashboard statistics retrieved successfully', {
      overview: {
        users: { total: totalUsers, active: activeUsers, recent: recentUsers },
        buyers: { total: totalBuyers, active: activeBuyers, recent: recentBuyers },
        products: { total: totalProducts, active: activeProducts, featured: featuredProducts },
        categories: { total: totalCategories, active: activeCategories },
        warehouses: { total: totalWarehouses, active: activeWarehouses },
        ports: { total: totalPorts, active: activePorts },
        stock: {
          totalRecords: totalStockRecords,
          lowStock: lowStockProducts,
          outOfStock: outOfStockItems
        },
        orders: { total: totalPurchaseOrders, pending: pendingOrders, recent: recentOrders },
        queries: { total: totalContactQueries, unread: unreadQueries, recent: recentQueries },
        content: { total: totalContentPages, published: publishedPages }
      },
      growth,
      recentActivities: {
        users: recentActivities[0],
        buyers: recentActivities[1],
        products: recentActivities[2]
      },
      period: periodDays
    });

  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return errorResponse(res, 500, 'Failed to retrieve dashboard statistics');
  }
};

// Get analytics data for charts
const getAnalyticsData = async (req, res) => {
  try {
    const { period = '30', type = 'overview' } = req.query;
    const periodDays = parseInt(period);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    let analyticsData = {};

    if (type === 'overview' || type === 'users') {
      // User registration trends
      const userTrends = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);

      analyticsData.userTrends = userTrends;
    }

    if (type === 'overview' || type === 'buyers') {
      // Buyer registration trends
      const buyerTrends = await Buyer.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);

      analyticsData.buyerTrends = buyerTrends;
    }

    if (type === 'overview' || type === 'products') {
      // Products by category
      const productsByCategory = await Product.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'productcategories',
            localField: '_id',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: '$category' },
        {
          $project: {
            categoryName: '$category.name',
            count: 1
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      analyticsData.productsByCategory = productsByCategory;
    }

    if (type === 'overview' || type === 'stock') {
      // Stock levels by warehouse
      const stockByWarehouse = await WarehouseStock.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: '$warehouse',
            totalItems: { $sum: 1 },
            totalQuantity: { $sum: '$quantity' },
            lowStockItems: {
              $sum: { $cond: ['$isLowStock', 1, 0] }
            }
          }
        },
        {
          $lookup: {
            from: 'warehouses',
            localField: '_id',
            foreignField: '_id',
            as: 'warehouse'
          }
        },
        { $unwind: '$warehouse' },
        {
          $project: {
            warehouseName: '$warehouse.name',
            warehouseCode: '$warehouse.code',
            totalItems: 1,
            totalQuantity: 1,
            lowStockItems: 1
          }
        },
        { $sort: { totalItems: -1 } }
      ]);

      analyticsData.stockByWarehouse = stockByWarehouse;
    }

    return successResponse(res, 200, 'Analytics data retrieved successfully', analyticsData);

  } catch (error) {
    console.error('Error getting analytics data:', error);
    return errorResponse(res, 500, 'Failed to retrieve analytics data');
  }
};

// CONTACT QUERIES MANAGEMENT

// Get all contact queries with filtering and pagination
const getContactQueries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, startDate, endDate } = req.query;

    // Build query
    let query = {};

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [queries, total] = await Promise.all([
      ContactQuery.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ContactQuery.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    return successResponse(res, 200, 'Contact queries retrieved successfully', {
      queries,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error getting contact queries:', error);
    return errorResponse(res, 500, 'Failed to retrieve contact queries');
  }
};

// Get single contact query by ID
const getContactQueryById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = await ContactQuery.findById(id);
    if (!query) {
      return errorResponse(res, 404, 'Contact query not found');
    }

    // Mark as read if it was unread
    if (query.status === 'unread') {
      query.status = 'read';
      query.readAt = new Date();
      await query.save();
    }

    return successResponse(res, 200, 'Contact query retrieved successfully', query);

  } catch (error) {
    console.error('Error getting contact query by ID:', error);
    return errorResponse(res, 500, 'Failed to retrieve contact query');
  }
};

// Update contact query status/response
const updateContactQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response, priority } = req.body;

    const query = await ContactQuery.findById(id);
    if (!query) {
      return errorResponse(res, 404, 'Contact query not found');
    }

    const updateData = {};

    if (status) {
      updateData.status = status;
      if (status === 'read' && query.status === 'unread') {
        updateData.readAt = new Date();
      }
    }

    if (response !== undefined) {
      updateData.response = response;
      updateData.respondedAt = response ? new Date() : null;
      updateData.respondedBy = response ? req.user._id : null;
    }

    if (priority) {
      updateData.priority = priority;
    }

    const updatedQuery = await ContactQuery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return successResponse(res, 200, 'Contact query updated successfully', updatedQuery);

  } catch (error) {
    console.error('Error updating contact query:', error);
    return errorResponse(res, 500, 'Failed to update contact query');
  }
};

// Delete contact query
const deleteContactQuery = async (req, res) => {
  try {
    const { id } = req.params;

    const query = await ContactQuery.findById(id);
    if (!query) {
      return errorResponse(res, 404, 'Contact query not found');
    }

    await ContactQuery.findByIdAndDelete(id);

    return successResponse(res, 200, 'Contact query deleted successfully');

  } catch (error) {
    console.error('Error deleting contact query:', error);
    return errorResponse(res, 500, 'Failed to delete contact query');
  }
};

// Bulk update contact queries
const bulkUpdateContactQueries = async (req, res) => {
  try {
    const { queryIds, status } = req.body;

    if (!Array.isArray(queryIds) || queryIds.length === 0) {
      return errorResponse(res, 400, 'Query IDs array is required');
    }

    if (!['read', 'unread', 'responded'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status value');
    }

    const updateData = { status };

    if (status === 'read') {
      updateData.readAt = new Date();
    }

    const result = await ContactQuery.updateMany(
      { _id: { $in: queryIds } },
      updateData
    );

    return successResponse(res, 200, `${result.modifiedCount} contact queries updated successfully`);

  } catch (error) {
    console.error('Error bulk updating contact queries:', error);
    return errorResponse(res, 500, 'Failed to update contact queries');
  }
};

// CONTENT MANAGEMENT FUNCTIONS

// Get all content pages
const getContentPages = async (req, res) => {
  try {
    const { status, pageType } = req.query;

    // Build query
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (pageType) {
      query.pageType = pageType;
    }

    const contentPages = await ContentPage.find(query)
      .populate('lastUpdatedBy', 'firstname lastname email')
      .sort({ updatedAt: -1 });

    return successResponse(res, 200, 'Content pages retrieved successfully', { contentPages });

  } catch (error) {
    console.error('Error getting content pages:', error);
    return errorResponse(res, 500, 'Failed to retrieve content pages');
  }
};

// Get single content page by ID or pageType
const getContentPage = async (req, res) => {
  try {
    const { identifier } = req.params; // Can be ID or pageType

    let contentPage;

    // Check if identifier is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      contentPage = await ContentPage.findById(identifier)
        .populate('lastUpdatedBy', 'firstname lastname email');
    } else {
      // Try to find by pageType
      contentPage = await ContentPage.findOne({ pageType: identifier })
        .populate('lastUpdatedBy', 'firstname lastname email');
    }

    if (!contentPage) {
      return errorResponse(res, 404, 'Content page not found');
    }

    return successResponse(res, 200, 'Content page retrieved successfully', contentPage);

  } catch (error) {
    console.error('Error getting content page:', error);
    return errorResponse(res, 500, 'Failed to retrieve content page');
  }
};

// Create or update content page
const upsertContentPage = async (req, res) => {
  try {
    const {
      pageType,
      title,
      content,
      metaTitle,
      metaDescription,
      status = 'published'
    } = req.body;

    // Check if page already exists
    const existingPage = await ContentPage.findOne({ pageType });

    if (existingPage) {
      // Update existing page
      existingPage.title = title;
      existingPage.content = content;
      existingPage.metaTitle = metaTitle;
      existingPage.metaDescription = metaDescription;
      existingPage.status = status;
      existingPage.lastUpdatedBy = req.user._id;

      await existingPage.save();

      await existingPage.populate('lastUpdatedBy', 'firstname lastname email');

      return successResponse(res, 200, 'Content page updated successfully', existingPage);
    } else {
      // Create new page
      const contentPage = new ContentPage({
        pageType,
        title,
        content,
        metaTitle,
        metaDescription,
        status,
        lastUpdatedBy: req.user._id
      });

      await contentPage.save();

      await contentPage.populate('lastUpdatedBy', 'firstname lastname email');

      return successResponse(res, 201, 'Content page created successfully', contentPage);
    }

  } catch (error) {
    console.error('Error upserting content page:', error);
    if (error.code === 11000) {
      return errorResponse(res, 400, 'Content page with this type already exists');
    }
    return errorResponse(res, 500, 'Failed to save content page');
  }
};

// Delete content page
const deleteContentPage = async (req, res) => {
  try {
    const { id } = req.params;

    const contentPage = await ContentPage.findById(id);
    if (!contentPage) {
      return errorResponse(res, 404, 'Content page not found');
    }

    await ContentPage.findByIdAndDelete(id);

    return successResponse(res, 200, 'Content page deleted successfully');

  } catch (error) {
    console.error('Error deleting content page:', error);
    return errorResponse(res, 500, 'Failed to delete content page');
  }
};

// EMAIL NOTIFICATIONS AND LOGS MANAGEMENT

// Get all email logs with filtering and pagination
const getEmailLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, templateType, recipient, startDate, endDate } = req.query;

    // Build query
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (templateType) {
      query.templateType = templateType;
    }

    if (recipient) {
      query.$or = [
        { recipient: { $regex: recipient, $options: 'i' } },
        { recipientName: { $regex: recipient, $options: 'i' } }
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [emailLogs, total] = await Promise.all([
      EmailLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      EmailLog.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    return successResponse(res, 200, 'Email logs retrieved successfully', {
      emailLogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error getting email logs:', error);
    return errorResponse(res, 500, 'Failed to retrieve email logs');
  }
};

// Get email statistics
const getEmailStats = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const [
      totalEmails,
      sentEmails,
      pendingEmails,
      failedEmails,
      recentEmails
    ] = await Promise.all([
      EmailLog.countDocuments(),
      EmailLog.countDocuments({ status: 'sent' }),
      EmailLog.countDocuments({ status: 'pending' }),
      EmailLog.countDocuments({ status: 'failed' }),
      EmailLog.countDocuments({ createdAt: { $gte: startDate } })
    ]);

    // Email stats by template type
    const emailsByTemplate = await EmailLog.aggregate([
      {
        $group: {
          _id: '$templateType',
          count: { $sum: 1 },
          sent: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Email trends
    const emailTrends = await EmailLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          sent: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    return successResponse(res, 200, 'Email statistics retrieved successfully', {
      overview: {
        total: totalEmails,
        sent: sentEmails,
        pending: pendingEmails,
        failed: failedEmails,
        recent: recentEmails
      },
      emailsByTemplate,
      emailTrends,
      period: periodDays
    });

  } catch (error) {
    console.error('Error getting email stats:', error);
    return errorResponse(res, 500, 'Failed to retrieve email statistics');
  }
};

// Resend failed emails
const resendFailedEmails = async (req, res) => {
  try {
    const { emailIds } = req.body;

    if (!Array.isArray(emailIds) || emailIds.length === 0) {
      return errorResponse(res, 400, 'Email IDs array is required');
    }

    // Find failed emails
    const failedEmails = await EmailLog.find({
      _id: { $in: emailIds },
      status: 'failed'
    });

    if (failedEmails.length === 0) {
      return errorResponse(res, 404, 'No failed emails found to resend');
    }

    // Reset status to pending for resending
    const result = await EmailLog.updateMany(
      { _id: { $in: emailIds }, status: 'failed' },
      {
        status: 'pending',
        errorMessage: null,
        sentAt: null
      }
    );

    // Here you would trigger your email queue processor
    // For now, we'll just return success

    return successResponse(res, 200, `${result.modifiedCount} emails queued for resending`);

  } catch (error) {
    console.error('Error resending failed emails:', error);
    return errorResponse(res, 500, 'Failed to resend emails');
  }
};

// Clear old email logs
const clearOldEmailLogs = async (req, res) => {
  try {
    const { days = 90 } = req.body; // Default to 90 days

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const result = await EmailLog.deleteMany({
      createdAt: { $lt: cutoffDate },
      status: 'sent' // Only delete sent emails, keep failed for analysis
    });

    return successResponse(res, 200, `${result.deletedCount} old email logs cleared`);

  } catch (error) {
    console.error('Error clearing old email logs:', error);
    return errorResponse(res, 500, 'Failed to clear old email logs');
  }
};

// Helper function to update descendant levels recursively
const updateDescendantLevels = async (parentId, parentLevel) => {
  const children = await ProductCategory.find({ parentCategory: parentId });

  for (const child of children) {
    const newChildLevel = parentLevel + 1;
    await ProductCategory.findByIdAndUpdate(child._id, { level: newChildLevel });
    await updateDescendantLevels(child._id, newChildLevel);
  }
};

module.exports = {
  getSubAdmins,
  createSubAdmin,
  getSubAdminById,
  updateSubAdmin,
  updateSubAdminStatus,
  getAdminModules,
  getAllBuyers,
  createAdminBuyer,
  getAdminBuyerById,
  updateAdminBuyer,
  updateAdminBuyerStatus,
  exportAllBuyers,
  // Product Category Management
  getProductCategories,
  createProductCategory,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
  // Product Management
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkUpdateProductStatus,
  getProductStats,
  // Port Management
  getPorts,
  createPort,
  getPortById,
  updatePort,
  deletePort,
  // Warehouse Management
  getWarehouses,
  createWarehouse,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
  // Warehouse Stock Management
  getWarehouseStocks,
  createWarehouseStock,
  getWarehouseStockById,
  updateWarehouseStock,
  deleteWarehouseStock,
  updateStockQuantity,
  getStockHistory,
  getLowStockAlerts,
  getStockStats,
  // Dashboard and Reports
  getDashboardStats,
  getAnalyticsData,
  // Contact Queries Management
  getContactQueries,
  getContactQueryById,
  updateContactQuery,
  deleteContactQuery,
  bulkUpdateContactQueries,
  // Content Management
  getContentPages,
  getContentPage,
  upsertContentPage,
  deleteContentPage,
  // Email Management
  getEmailLogs,
  getEmailStats,
  resendFailedEmails,
  clearOldEmailLogs
};