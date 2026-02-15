const PurchaseOrder = require('../models/PurchaseOrder.model');
const Buyer = require('../models/Buyer.model');
const { successResponse, errorResponse, paginatedResponse, createPagination } = require('../utils/response.utils');

// @desc    Get buyer's purchase orders
// @route   GET /api/buyer/purchase-orders
// @access  Private (Buyer)
exports.getPurchaseOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Get buyer info
    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return errorResponse(res, 'Buyer profile not found', 404);
    }
    
    // Build query
    const query = { buyer: buyer._id };
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { poNumber: { $regex: search, $options: 'i' } },
        { 'products.productName': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [orders, total] = await Promise.all([
      PurchaseOrder.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('warehouse', 'name code')
        .select('poNumber status totalAmount currency expectedDeliveryDate createdAt statusHistory'),
      PurchaseOrder.countDocuments(query)
    ]);
    
    const pagination = createPagination(page, limit, total);
    
    return paginatedResponse(res, orders, pagination, 'Purchase orders fetched successfully');
  } catch (error) {
    console.error('Get purchase orders error:', error);
    return errorResponse(res, error.message || 'Failed to fetch purchase orders', 500);
  }
};

// @desc    Get single purchase order
// @route   GET /api/buyer/purchase-orders/:poId
// @access  Private (Buyer)
exports.getPurchaseOrder = async (req, res) => {
  try {
    const { poId } = req.params;
    
    // Get buyer info
    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return errorResponse(res, 'Buyer profile not found', 404);
    }
    
    const order = await PurchaseOrder.findOne({
      _id: poId,
      buyer: buyer._id
    })
      .populate('warehouse', 'name code address')
      .populate('port', 'name code type')
      .populate('products.product', 'name sku images')
      .populate('statusHistory.updatedBy', 'firstName lastName');
    
    if (!order) {
      return errorResponse(res, 'Purchase order not found', 404);
    }
    
    return successResponse(res, order, 'Purchase order fetched successfully');
  } catch (error) {
    console.error('Get purchase order error:', error);
    return errorResponse(res, error.message || 'Failed to fetch purchase order', 500);
  }
};

// @desc    Get purchase order stats for dashboard
// @route   GET /api/buyer/dashboard-stats
// @access  Private (Buyer)
exports.getDashboardStats = async (req, res) => {
  try {
    // Get buyer info
    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return errorResponse(res, 'Buyer profile not found', 404);
    }
    
    // Get stats
    const [totalOrders, ordersByStatus, recentOrders] = await Promise.all([
      PurchaseOrder.countDocuments({ buyer: buyer._id }),
      PurchaseOrder.aggregate([
        { $match: { buyer: buyer._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      PurchaseOrder.find({ buyer: buyer._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('poNumber status totalAmount currency createdAt')
    ]);
    
    // Calculate totals
    const totalAmount = await PurchaseOrder.aggregate([
      { $match: { buyer: buyer._id } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    // Format status counts
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      in_production: 0,
      delivered: 0,
      cancelled: 0
    };
    
    ordersByStatus.forEach(item => {
      statusCounts[item._id] = item.count;
    });
    
    const stats = {
      totalOrders,
      totalAmount: totalAmount[0]?.total || 0,
      statusCounts,
      recentOrders
    };
    
    return successResponse(res, stats, 'Dashboard stats fetched successfully');
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return errorResponse(res, error.message || 'Failed to fetch dashboard stats', 500);
  }
};
