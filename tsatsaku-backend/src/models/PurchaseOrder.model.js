const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: [true, 'Buyer is required']
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    sku: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      default: 'piece'
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  // Order Totals
  subtotal: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  // Delivery Information
  deliveryAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
    contactPerson: { type: String },
    contactPhone: { type: String }
  },
  expectedDeliveryDate: {
    type: Date
  },
  actualDeliveryDate: {
    type: Date
  },
  // Warehouse Information
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse'
  },
  port: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Port'
  },
  // Status Tracking
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'in_production',
      'ready_for_dispatch',
      'dispatched_from_port',
      'in_transit',
      'arrived_at_port',
      'customs_clearance',
      'received_into_warehouse',
      'dispatched_from_warehouse',
      'delivered',
      'cancelled'
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String
    }
  }],
  // Notes
  internalNotes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  buyerNotes: {
    type: String,
    maxlength: [1000, 'Buyer notes cannot exceed 1000 characters']
  },
  // QR Code
  qrCode: {
    type: String
  },
  // Additional Fields
  paymentTerms: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  // Tracking
  trackingNumber: {
    type: String
  },
  shippingMethod: {
    type: String
  },
  // Audit
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate PO number before saving
purchaseOrderSchema.pre('save', async function() {
  if (this.isNew && !this.poNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await mongoose.model('PurchaseOrder').countDocuments();
    this.poNumber = `PO${year}${month}${String(count + 1).padStart(5, '0')}`;
  }
  
  // Add initial status to history if new
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.createdBy
    });
  }
});

// Indexes (poNumber already indexed via unique: true)
purchaseOrderSchema.index({ buyer: 1 });
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ createdAt: -1 });
purchaseOrderSchema.index({ expectedDeliveryDate: 1 });
purchaseOrderSchema.index({ 'products.product': 1 });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
