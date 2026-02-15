const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: [true, 'Recipient email is required'],
    trim: true,
    lowercase: true
  },
  recipientName: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  content: {
    type: String
  },
  templateType: {
    type: String,
    enum: [
      'welcome',
      'password_reset',
      'password_changed',
      'account_created',
      'po_created',
      'po_status_update',
      'low_stock_alert',
      'contact_received',
      'contact_response',
      'sub_user_created',
      'buyer_created'
    ],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  errorMessage: {
    type: String
  },
  sentAt: {
    type: Date
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
emailLogSchema.index({ recipient: 1 });
emailLogSchema.index({ templateType: 1 });
emailLogSchema.index({ status: 1 });
emailLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);
