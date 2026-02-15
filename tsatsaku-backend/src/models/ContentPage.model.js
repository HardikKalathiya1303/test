const mongoose = require('mongoose');

const contentPageSchema = new mongoose.Schema({
  pageType: {
    type: String,
    enum: ['about_us', 'terms', 'privacy', 'faq'],
    required: [true, 'Page type is required'],
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [100, 'Meta title cannot exceed 100 characters']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Meta description cannot exceed 300 characters']
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes (pageType already indexed via unique: true)
contentPageSchema.index({ status: 1 });

module.exports = mongoose.model('ContentPage', contentPageSchema);
