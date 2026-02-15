const User = require('../models/User.model');
const Buyer = require('../models/Buyer.model');
const PurchaseOrder = require('../models/PurchaseOrder.model');
const Product = require('../models/Product.model');
const WarehouseStock = require('../models/WarehouseStock.model');
const Warehouse = require('../models/Warehouse.model');
const { successResponse, errorResponse } = require('../utils/response.utils');
const { validationResult } = require('express-validator');
const xlsx = require('xlsx');
const qrcode = require('qrcode');

// Module access definitions and dependencies
const MODULE_ACCESS = {
  buyers: { name: 'Buyers Management', dependencies: [] },
  orders: { name: 'Orders Management', dependencies: ['buyers'] },
  inventory: { name: 'Inventory Management', dependencies: ['orders'] },
  reports: { name: 'Reports', dependencies: ['inventory'] },
  sub_users: { name: 'Sub Users Management', dependencies: [] }
};

// Get all sub-users for the current MAN user
const getSubUsers = async (req, res) => {
  try {
    const manUserId = req.user.userId;
    
    // Get all users created by this MAN user
    const subUsers = await User.find({ 
      createdBy: manUserId,
      role: 'man_user'
    }).select('-password').sort({ createdAt: -1 });

    return successResponse(res, 200, 'Sub-users retrieved successfully', subUsers);
  } catch (error) {
    console.error('Error getting sub-users:', error);
    return errorResponse(res, 500, 'Failed to retrieve sub-users');
  }
};

// Create new sub-user
const createSubUser = async (req, res) => {
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

    const manUserId = req.user.userId;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 409, 'User with this email already exists');
    }

    // Validate module access dependencies
    const validatedModuleAccess = validateModuleAccess(moduleAccess);
    if (!validatedModuleAccess.isValid) {
      return errorResponse(res, 400, 'Invalid module access', validatedModuleAccess.errors);
    }

    // Create new sub-user
    const newSubUser = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: 'man_user',
      moduleAccess: validatedModuleAccess.moduleAccess,
      status,
      createdBy: manUserId,
      isSubUser: true
    });

    await newSubUser.save();

    // Return user without password
    const subUser = await User.findById(newSubUser._id).select('-password');
    
    return successResponse(res, 201, 'Sub-user created successfully', subUser);
  } catch (error) {
    console.error('Error creating sub-user:', error);
    return errorResponse(res, 500, 'Failed to create sub-user');
  }
};

// Get single sub-user by ID
const getSubUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const manUserId = req.user.userId;

    const subUser = await User.findOne({
      _id: userId,
      createdBy: manUserId,
      role: 'man_user'
    }).select('-password');

    if (!subUser) {
      return errorResponse(res, 404, 'Sub-user not found');
    }

    return successResponse(res, 200, 'Sub-user retrieved successfully', subUser);
  } catch (error) {
    console.error('Error getting sub-user:', error);
    return errorResponse(res, 500, 'Failed to retrieve sub-user');
  }
};

// Update sub-user
const updateSubUser = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { userId } = req.params;
    const manUserId = req.user.userId;
    const {
      firstName,
      lastName,
      email,
      phone,
      moduleAccess,
      status
    } = req.body;

    // Find sub-user
    const subUser = await User.findOne({
      _id: userId,
      createdBy: manUserId,
      role: 'man_user'
    });

    if (!subUser) {
      return errorResponse(res, 404, 'Sub-user not found');
    }

    // Check if email already exists (excluding current user)
    if (email && email !== subUser.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return errorResponse(res, 409, 'User with this email already exists');
      }
    }

    // Validate module access if provided
    let validatedModuleAccess = { isValid: true, moduleAccess: subUser.moduleAccess };
    if (moduleAccess) {
      validatedModuleAccess = validateModuleAccess(moduleAccess);
      if (!validatedModuleAccess.isValid) {
        return errorResponse(res, 400, 'Invalid module access', validatedModuleAccess.errors);
      }
    }

    // Update fields
    if (firstName) subUser.firstName = firstName;
    if (lastName) subUser.lastName = lastName;
    if (email) subUser.email = email;
    if (phone) subUser.phone = phone;
    if (moduleAccess) subUser.moduleAccess = validatedModuleAccess.moduleAccess;
    if (status) subUser.status = status;

    await subUser.save();

    // Return updated user without password
    const updatedSubUser = await User.findById(userId).select('-password');
    
    return successResponse(res, 200, 'Sub-user updated successfully', updatedSubUser);
  } catch (error) {
    console.error('Error updating sub-user:', error);
    return errorResponse(res, 500, 'Failed to update sub-user');
  }
};

// Update sub-user status
const updateSubUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    const manUserId = req.user.userId;

    if (!['active', 'inactive'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status. Must be active or inactive');
    }

    const subUser = await User.findOneAndUpdate(
      {
        _id: userId,
        createdBy: manUserId,
        role: 'man_user'
      },
      { status },
      { new: true }
    ).select('-password');

    if (!subUser) {
      return errorResponse(res, 404, 'Sub-user not found');
    }

    return successResponse(res, 200, 'Sub-user status updated successfully', subUser);
  } catch (error) {
    console.error('Error updating sub-user status:', error);
    return errorResponse(res, 500, 'Failed to update sub-user status');
  }
};

// Get available modules
const getModules = async (req, res) => {
  try {
    return successResponse(res, 200, 'Modules retrieved successfully', MODULE_ACCESS);
  } catch (error) {
    console.error('Error getting modules:', error);
    return errorResponse(res, 500, 'Failed to retrieve modules');
  }
};

// Helper function to validate module access with dependencies
const validateModuleAccess = (moduleAccess) => {
  const errors = [];
  const validatedAccess = {};

  // Handle both formats:
  // Format 1: { buyers: true, orders: false }
  // Format 2: { buyers: { view: true, add: false, edit: true }, orders: { view: true } }
  for (const [module, access] of Object.entries(moduleAccess)) {
    // Determine if this module has access (either boolean true, or object with at least one true permission)
    let hasAccess = false;
    if (typeof access === 'boolean') {
      hasAccess = access;
      validatedAccess[module] = access;
    } else if (typeof access === 'object' && access !== null) {
      hasAccess = !!(access.view || access.add || access.edit || access.deactivate || access.reactivate);
      validatedAccess[module] = access;
    } else {
      validatedAccess[module] = false;
    }

    if (hasAccess && MODULE_ACCESS[module]) {
      // Ensure dependencies are also enabled
      const dependencies = MODULE_ACCESS[module].dependencies;
      dependencies.forEach(dep => {
        const depAccess = moduleAccess[dep];
        const depHasAccess = typeof depAccess === 'boolean' ? depAccess : 
          (typeof depAccess === 'object' && depAccess !== null ? !!(depAccess.view || depAccess.add || depAccess.edit) : false);
        if (!depHasAccess) {
          errors.push(`Module '${module}' requires '${dep}' to be enabled`);
        }
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    moduleAccess: validatedAccess
  };
};

// BUYER MANAGEMENT FUNCTIONS

// Get all buyers for the current MAN user
const getBuyers = async (req, res) => {
  try {
    const manUserId = req.user.userId;
    const { page = 1, limit = 10, search = '', status = '' } = req.query;

    // Build query
    const query = { createdBy: manUserId };
    
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { 'contactPerson.name': { $regex: search, $options: 'i' } },
        { 'contactPerson.email': { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const buyers = await Buyer.find(query)
      .populate('userId', 'firstName lastName email')
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

// Create new buyer
const createBuyer = async (req, res) => {
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

    const manUserId = req.user.userId;

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
      createdBy: manUserId
    });

    await newUser.save();

    // Create buyer profile with nested fields matching Buyer model schema
    const newBuyer = new Buyer({
      userId: newUser._id,
      companyName,
      contactPerson: {
        name: contactPersonName,
        email: contactPersonEmail || email,
        phone: contactPersonPhone
      },
      companyInfo: {
        registrationNumber,
        taxId,
        industry: businessType
      },
      address: {
        street: address,
        city,
        state,
        country,
        postalCode
      },
      status,
      createdBy: manUserId
    });

    await newBuyer.save();

    // Return buyer with user details
    const buyer = await Buyer.findById(newBuyer._id)
      .populate('userId', 'firstName lastName email role status');
    
    return successResponse(res, 201, 'Buyer created successfully', buyer);
  } catch (error) {
    console.error('Error creating buyer:', error);
    return errorResponse(res, 500, 'Failed to create buyer');
  }
};

// Get single buyer by ID
const getBuyerById = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const manUserId = req.user.userId;

    const buyer = await Buyer.findOne({
      _id: buyerId,
      createdBy: manUserId
    }).populate('userId', 'firstName lastName email role status');

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

// Update buyer
const updateBuyer = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { buyerId } = req.params;
    const manUserId = req.user.userId;
    const updateData = req.body;

    // Find buyer
    const buyer = await Buyer.findOne({
      _id: buyerId,
      createdBy: manUserId
    }).populate('userId');

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
    ).populate('userId', 'firstName lastName email role status');

    return successResponse(res, 200, 'Buyer updated successfully', updatedBuyer);
  } catch (error) {
    console.error('Error updating buyer:', error);
    return errorResponse(res, 500, 'Failed to update buyer');
  }
};

// Update buyer status
const updateBuyerStatus = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const { status } = req.body;
    const manUserId = req.user.userId;

    if (!['active', 'inactive'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status. Must be active or inactive');
    }

    const buyer = await Buyer.findOne({
      _id: buyerId,
      createdBy: manUserId
    });

    if (!buyer) {
      return errorResponse(res, 404, 'Buyer not found');
    }

    // Update both buyer and user status
    await Promise.all([
      Buyer.findByIdAndUpdate(buyerId, { status }),
      User.findByIdAndUpdate(buyer.userId, { status })
    ]);

    const updatedBuyer = await Buyer.findById(buyerId)
      .populate('userId', 'firstName lastName email role status');

    return successResponse(res, 200, 'Buyer status updated successfully', updatedBuyer);
  } catch (error) {
    console.error('Error updating buyer status:', error);
    return errorResponse(res, 500, 'Failed to update buyer status');
  }
};

// Export buyers to Excel/CSV
const exportBuyers = async (req, res) => {
  try {
    const manUserId = req.user.userId;
    const { format = 'xlsx' } = req.query;

    const buyers = await Buyer.find({ createdBy: manUserId })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    // Prepare data for export
    const exportData = buyers.map(buyer => ({
      'Company Name': buyer.companyName,
      'Contact Person': buyer.contactPerson?.name || '',
      'Email': buyer.contactPerson?.email || buyer.userId?.email || '',
      'Phone': buyer.contactPerson?.phone || '',
      'Industry': buyer.companyInfo?.industry || '',
      'Registration Number': buyer.companyInfo?.registrationNumber || '',
      'Tax ID': buyer.companyInfo?.taxId || '',
      'Address': buyer.address?.street || '',
      'City': buyer.address?.city || '',
      'State': buyer.address?.state || '',
      'Country': buyer.address?.country || '',
      'Postal Code': buyer.address?.postalCode || '',
      'Status': buyer.status,
      'Created Date': buyer.createdAt ? new Date(buyer.createdAt).toLocaleDateString() : ''
    }));

    // Create workbook
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(exportData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Buyers');

    // Set response headers
    const filename = `buyers-export-${new Date().toISOString().split('T')[0]}.${format}`;
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

// PURCHASE ORDER MANAGEMENT FUNCTIONS

// Get all purchase orders for the current MAN user
const getPurchaseOrders = async (req, res) => {
  try {
    const manUserId = req.user.userId;
    const { page = 1, limit = 10, search = '', status = '', buyerId = '' } = req.query;

    // Build query - get orders where the buyer was created by this MAN user
    const buyerQuery = { createdBy: manUserId };
    const buyers = await Buyer.find(buyerQuery).select('_id');
    const buyerIds = buyers.map(buyer => buyer._id);

    const query = { buyer: { $in: buyerIds } };
    
    if (search) {
      query.$or = [
        { poNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (buyerId) {
      // buyerId parameter refers to User._id, find corresponding Buyer._id
      const buyerDoc = await Buyer.findOne({ userId: buyerId, createdBy: manUserId });
      if (buyerDoc) {
        query.buyer = buyerDoc._id;
      }
    }

    const orders = await PurchaseOrder.find(query)
      .populate({
        path: 'buyer',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .populate('products.product', 'name description')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await PurchaseOrder.countDocuments(query);

    return successResponse(res, 200, 'Purchase orders retrieved successfully', {
      orders,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        pages: Math.ceil(total / limit),
        count: orders.length,
        totalCount: total
      }
    });
  } catch (error) {
    console.error('Error getting purchase orders:', error);
    return errorResponse(res, 500, 'Failed to retrieve purchase orders');
  }
};

// Create new purchase order
const createPurchaseOrder = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const {
      buyerId,
      products,
      deliveryAddress,
      deliveryDate,
      paymentTerms,
      notes,
      priority = 'normal',
      discount = 0,
      taxRate = 0,
      shippingCost = 0
    } = req.body;

    const manUserId = req.user.userId;

    // Verify buyer belongs to this MAN user
    const buyer = await Buyer.findOne({ userId: buyerId, createdBy: manUserId });
    if (!buyer) {
      return errorResponse(res, 404, 'Buyer not found or unauthorized');
    }

    // Validate and calculate products
    let subtotal = 0;
    const validatedProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return errorResponse(res, 404, `Product not found: ${item.productId}`);
      }

      const lineTotal = item.quantity * item.unitPrice;
      subtotal += lineTotal;

      validatedProducts.push({
        product: item.productId,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: lineTotal
      });
    }

    // Calculate total
    const discountAmount = (subtotal * discount) / 100;
    const taxAmount = ((subtotal - discountAmount + shippingCost) * taxRate) / 100;
    const totalAmount = subtotal - discountAmount + taxAmount + shippingCost;

    // Generate order number
    const poNumber = await generateOrderNumber();

    // Create purchase order
    const newPurchaseOrder = new PurchaseOrder({
      poNumber,
      buyer: buyer._id, // Use Buyer._id, not User._id
      products: validatedProducts,
      subtotal,
      discount,
      discountAmount,
      taxAmount,
      shippingCost,
      totalAmount,
      deliveryAddress,
      expectedDeliveryDate: deliveryDate,
      paymentTerms,
      internalNotes: notes,
      priority,
      status: 'pending',
      createdBy: manUserId,
      statusHistory: [{
        status: 'pending',
        updatedBy: manUserId,
        timestamp: new Date(),
        notes: 'Order created'
      }]
    });

    await newPurchaseOrder.save();

    // Generate QR code
    const qrCodeUrl = `${process.env.FRONTEND_URL}/public/purchase-order/${newPurchaseOrder._id}`;
    const qrCodeDataUrl = await qrcode.toDataURL(qrCodeUrl);
    
    newPurchaseOrder.qrCode = qrCodeDataUrl;
    await newPurchaseOrder.save();

    // Return order with populated data
    const order = await PurchaseOrder.findById(newPurchaseOrder._id)
      .populate({
        path: 'buyer',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .populate('products.product', 'name description');
    
    return successResponse(res, 201, 'Purchase order created successfully', order);
  } catch (error) {
    console.error('Error creating purchase order:', error);
    return errorResponse(res, 500, 'Failed to create purchase order');
  }
};

// Get single purchase order by ID
const getPurchaseOrderById = async (req, res) => {
  try {
    const { poId } = req.params;
    const manUserId = req.user.userId;

    // Get order and verify access through buyer
    const order = await PurchaseOrder.findById(poId)
      .populate({
        path: 'buyer',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .populate('products.product', 'name description')
      .populate('statusHistory.updatedBy', 'firstName lastName');

    if (!order) {
      return errorResponse(res, 404, 'Purchase order not found');
    }

    // Verify this MAN user has access to this order
    const buyer = await Buyer.findOne({ _id: order.buyer, createdBy: manUserId });
    if (!buyer) {
      return errorResponse(res, 403, 'Unauthorized access to this purchase order');
    }

    return successResponse(res, 200, 'Purchase order retrieved successfully', order);
  } catch (error) {
    console.error('Error getting purchase order:', error);
    return errorResponse(res, 500, 'Failed to retrieve purchase order');
  }
};

// Update purchase order status
const updatePurchaseOrderStatus = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { poId } = req.params;
    const { status, notes = '' } = req.body;
    const manUserId = req.user.userId;

    const validStatuses = ['pending', 'confirmed', 'in_production', 'ready_for_dispatch', 'dispatched_from_port', 'in_transit', 'arrived_at_port', 'customs_clearance', 'received_into_warehouse', 'dispatched_from_warehouse', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 400, 'Invalid status');
    }

    // Get order and verify access
    const order = await PurchaseOrder.findById(poId);
    if (!order) {
      return errorResponse(res, 404, 'Purchase order not found');
    }

    // Verify access through buyer
    const buyer = await Buyer.findOne({ _id: order.buyer, createdBy: manUserId });
    if (!buyer) {
      return errorResponse(res, 403, 'Unauthorized access to this purchase order');
    }

    // Validate status transition
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['in_production', 'cancelled'],
      in_production: ['ready_for_dispatch', 'cancelled'],
      ready_for_dispatch: ['dispatched_from_port', 'cancelled'],
      dispatched_from_port: ['in_transit', 'cancelled'],
      in_transit: ['arrived_at_port'],
      arrived_at_port: ['customs_clearance'],
      customs_clearance: ['received_into_warehouse'],
      received_into_warehouse: ['dispatched_from_warehouse'],
      dispatched_from_warehouse: ['delivered'],
      delivered: [],
      cancelled: []
    };

    if (!validTransitions[order.status].includes(status)) {
      return errorResponse(res, 400, `Cannot change status from ${order.status} to ${status}`);
    }

    // Update status and add to history
    order.status = status;
    order.statusHistory.push({
      status,
      updatedBy: manUserId,
      timestamp: new Date(),
      notes
    });

    // Handle warehouse stock updates for delivered status
    if (status === 'delivered') {
      await updateWarehouseStock(order);
    }

    await order.save();

    // Return updated order with populated data
    const updatedOrder = await PurchaseOrder.findById(poId)
      .populate({
        path: 'buyer',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .populate('products.product', 'name description')
      .populate('statusHistory.updatedBy', 'firstName lastName');

    return successResponse(res, 200, 'Purchase order status updated successfully', updatedOrder);
  } catch (error) {
    console.error('Error updating purchase order status:', error);
    return errorResponse(res, 500, 'Failed to update purchase order status');
  }
};

// Get QR code for purchase order
const getPurchaseOrderQRCode = async (req, res) => {
  try {
    const { poId } = req.params;
    
    const order = await PurchaseOrder.findById(poId);
    if (!order) {
      return errorResponse(res, 404, 'Purchase order not found');
    }

    if (!order.qrCode) {
      // Generate QR code if it doesn't exist
      const qrCodeUrl = `${process.env.FRONTEND_URL}/public/purchase-order/${poId}`;
      const qrCodeDataUrl = await qrcode.toDataURL(qrCodeUrl);
      
      order.qrCode = qrCodeDataUrl;
      await order.save();
    }

    return successResponse(res, 200, 'QR code retrieved successfully', {
      qrCode: order.qrCode,
      poNumber: order.poNumber
    });
  } catch (error) {
    console.error('Error getting QR code:', error);
    return errorResponse(res, 500, 'Failed to retrieve QR code');
  }
};

// INVENTORY REPORTING FUNCTIONS

// Get dashboard statistics for MAN user
const getDashboardStats = async (req, res) => {
  try {
    const manUserId = req.user.userId;

    // Get buyers created by this MAN user
    const totalBuyers = await Buyer.countDocuments({ createdBy: manUserId });
    const buyers = await Buyer.find({ createdBy: manUserId }).select('_id');
    const buyerIds = buyers.map(buyer => buyer._id);

    // Get purchase orders for these buyers
    const totalOrders = await PurchaseOrder.countDocuments({ buyer: { $in: buyerIds } });
    const pendingOrders = await PurchaseOrder.countDocuments({ buyer: { $in: buyerIds }, status: 'pending' });

    // Calculate total revenue (sum of delivered orders)
    const revenueData = await PurchaseOrder.aggregate([
      { $match: { buyer: { $in: buyerIds }, status: 'delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Get recent orders (last 5)
    const recentOrders = await PurchaseOrder.find({ buyer: { $in: buyerIds } })
      .populate({
        path: 'buyer',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('poNumber status totalAmount createdAt');

    return successResponse(res, 200, 'Dashboard stats retrieved successfully', {
      totalBuyers,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return errorResponse(res, 500, 'Failed to retrieve dashboard statistics');
  }
};

// Get real-time inventory report
const getInventoryReport = async (req, res) => {
  try {
    const manUserId = req.user.userId;

    // Get inventory data - for MAN users, show all inventory they have access to
    const inventory = await WarehouseStock.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'warehouses',
          localField: 'warehouse',
          foreignField: '_id',
          as: 'warehouseInfo'
        }
      },
      {
        $unwind: { path: '$warehouseInfo', preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: '$product',
          productName: { $first: '$productInfo.name' },
          productDescription: { $first: '$productInfo.description' },
          totalQuantity: { $sum: '$quantity' },
          warehouses: {
            $push: {
              warehouseId: '$warehouse',
              warehouseName: '$warehouseInfo.name',
              quantity: '$quantity'
            }
          }
        }
      },
      {
        $sort: { productName: 1 }
      }
    ]);

    return successResponse(res, 200, 'Inventory report retrieved successfully', inventory);
  } catch (error) {
    console.error('Error getting inventory report:', error);
    return errorResponse(res, 500, 'Failed to retrieve inventory report');
  }
};

// Get warehouse-wise products report
const getWarehouseStockReport = async (req, res) => {
  try {
    const manUserId = req.user.userId;
    const { warehouseId } = req.query;

    // Build query
    const query = {};
    if (warehouseId) {
      query.warehouse = warehouseId;
    }

    const warehouseStock = await WarehouseStock.find(query)
      .populate('product', 'name description category')
      .populate('warehouse', 'name location city state')
      .sort({ 'warehouse': 1 });

    // Group by warehouse
    const groupedData = {};
    warehouseStock.forEach(stock => {
      const warehouseKey = stock.warehouse?._id?.toString() || 'unknown';
      if (!groupedData[warehouseKey]) {
        groupedData[warehouseKey] = {
          warehouse: stock.warehouse,
          products: [],
          totalProducts: 0,
          totalQuantity: 0
        };
      }

      groupedData[warehouseKey].products.push({
        product: stock.product,
        quantity: stock.quantity,
        lastUpdated: stock.lastStockUpdate || stock.updatedAt
      });

      groupedData[warehouseKey].totalProducts += 1;
      groupedData[warehouseKey].totalQuantity += stock.quantity || 0;
    });

    const reportData = Object.values(groupedData);

    return successResponse(res, 200, 'Warehouse stock report retrieved successfully', reportData);
  } catch (error) {
    console.error('Error getting warehouse stock report:', error);
    return errorResponse(res, 500, 'Failed to retrieve warehouse stock report');
  }
};

// Helper Functions

// Generate unique order number
const generateOrderNumber = async () => {
  const prefix = 'PO';
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Find the last order number for this month
  const lastOrder = await PurchaseOrder.findOne({
    poNumber: { $regex: `^${prefix}-${year}${month}-` }
  }).sort({ poNumber: -1 });

  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.poNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `${prefix}-${year}${month}-${String(sequence).padStart(4, '0')}`;
};

// Update warehouse stock when order is delivered
const updateWarehouseStock = async (order) => {
  try {
    for (const item of order.products) {
      // Find available stock for this product
      const stockEntry = await WarehouseStock.findOne({
        product: item.product,
        quantity: { $gte: item.quantity }
      });

      if (stockEntry) {
        // Reduce quantity
        stockEntry.quantity -= item.quantity;
        stockEntry.lastStockUpdate = new Date();
        await stockEntry.save();
      }
    }
  } catch (error) {
    console.error('Error updating warehouse stock:', error);
    throw error;
  }
};

module.exports = {
  getSubUsers,
  createSubUser,
  getSubUserById,
  updateSubUser,
  updateSubUserStatus,
  getModules,
  getBuyers,
  createBuyer,
  getBuyerById,
  updateBuyer,
  updateBuyerStatus,
  exportBuyers,
  getPurchaseOrders,
  createPurchaseOrder,
  getPurchaseOrderById,
  updatePurchaseOrderStatus,
  getPurchaseOrderQRCode,
  getDashboardStats,
  getInventoryReport,
  getWarehouseStockReport
};