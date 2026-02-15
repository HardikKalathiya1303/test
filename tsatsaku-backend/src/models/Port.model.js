const mongoose = require('mongoose');

const portSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Port name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  code: {
    type: String,
    required: [true, 'Port code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['sea', 'air', 'land'],
    required: [true, 'Port type is required']
  },
  address: {
    city: { type: String },
    state: { type: String },
    country: { type: String }
  },
  contactInfo: {
    phone: { type: String },
    email: { type: String },
    website: { type: String }
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
portSchema.index({ type: 1 });
portSchema.index({ status: 1 });

module.exports = mongoose.model('Port', portSchema);
