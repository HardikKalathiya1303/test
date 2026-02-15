const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: [true, 'Category is required']
  },
  brand: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  // Product Specifications
  specifications: {
    weight: {
      value: { type: Number },
      unit: { type: String, enum: ['kg', 'g', 'lb', 'oz'] }
    },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
      unit: { type: String, enum: ['cm', 'm', 'in', 'ft'] }
    },
    volume: {
      value: { type: Number },
      unit: { type: String, enum: ['L', 'mL', 'gal'] }
    },
    material: { type: String },
    color: { type: String },
    model: { type: String }
  },
  // Pricing
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'NGN'
    },
    taxRate: {
      type: Number,
      default: 0
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  // Stock Settings
  stockSettings: {
    minOrderQuantity: {
      type: Number,
      default: 1
    },
    maxOrderQuantity: {
      type: Number
    },
    unit: {
      type: String,
      enum: ['piece', 'kg', 'litre', 'ton', 'box', 'carton', 'pallet'],
      default: 'piece'
    },
    reorderLevel: {
      type: Number,
      default: 10
    }
  },
  // Images
  images: [{
    url: { type: String },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  // Custom Attributes (flexible for additional fields)
  customAttributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Virtual for calculated price
productSchema.virtual('finalPrice').get(function() {
  if (this.pricing && this.pricing.basePrice) {
    const discount = this.pricing.discountPercentage || 0;
    return this.pricing.basePrice * (1 - discount / 100);
  }
  return 0;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Indexes
productSchema.index({ sku: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
