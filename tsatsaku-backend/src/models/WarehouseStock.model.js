const mongoose = require('mongoose');

const warehouseStockSchema = new mongoose.Schema({
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: [true, 'Warehouse is required']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    enum: ['piece', 'kg', 'litre', 'ton', 'box', 'carton', 'pallet'],
    default: 'piece'
  },
  restockAlertLevel: {
    type: Number,
    default: 10
  },
  isLowStock: {
    type: Boolean,
    default: false
  },
  lastStockUpdate: {
    type: Date,
    default: Date.now
  },
  stockHistory: [{
    type: {
      type: String,
      enum: ['in', 'out', 'adjustment'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    reference: {
      type: String // PO Number or adjustment reason
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId
    },
    previousQuantity: {
      type: Number
    },
    newQuantity: {
      type: Number
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Check low stock before saving
warehouseStockSchema.pre('save', function(next) {
  this.isLowStock = this.quantity <= this.restockAlertLevel;
  this.lastStockUpdate = new Date();
  next();
});

// Compound unique index for warehouse-product combination
warehouseStockSchema.index({ warehouse: 1, product: 1 }, { unique: true });
warehouseStockSchema.index({ isLowStock: 1 });
warehouseStockSchema.index({ status: 1 });

// Static method to update stock
warehouseStockSchema.statics.updateStock = async function(warehouseId, productId, quantity, type, reference, userId) {
  const stock = await this.findOne({ warehouse: warehouseId, product: productId });
  
  if (!stock) {
    throw new Error('Stock record not found');
  }
  
  const previousQuantity = stock.quantity;
  
  if (type === 'in') {
    stock.quantity += quantity;
  } else if (type === 'out') {
    if (stock.quantity < quantity) {
      throw new Error('Insufficient stock');
    }
    stock.quantity -= quantity;
  } else if (type === 'adjustment') {
    stock.quantity = quantity;
  }
  
  stock.stockHistory.push({
    type,
    quantity,
    reference,
    previousQuantity,
    newQuantity: stock.quantity,
    updatedBy: userId
  });
  
  await stock.save();
  return stock;
};

module.exports = mongoose.model('WarehouseStock', warehouseStockSchema);
