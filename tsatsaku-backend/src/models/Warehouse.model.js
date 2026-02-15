const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Warehouse name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  code: {
    type: String,
    required: [true, 'Warehouse code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String }
  },
  contactPerson: {
    name: { type: String },
    phone: { type: String },
    email: { type: String }
  },
  capacity: {
    total: { type: Number },
    unit: { type: String, default: 'sqft' }
  },
  operatingHours: {
    open: { type: String },
    close: { type: String }
  },
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

// Indexes
warehouseSchema.index({ status: 1 });
warehouseSchema.index({ 'address.city': 1 });

module.exports = mongoose.model('Warehouse', warehouseSchema);
