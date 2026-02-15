const ContentPage = require('../models/ContentPage.model');
const { successResponse, errorResponse } = require('../utils/response.utils');

// @desc    Get content page by type
// @route   GET /api/content/:pageType
// @access  Public
exports.getContentByType = async (req, res) => {
  try {
    const { pageType } = req.params;
    
    const validTypes = ['about_us', 'terms', 'privacy', 'faq'];
    if (!validTypes.includes(pageType)) {
      return errorResponse(res, 'Invalid page type', 400);
    }
    
    let content = await ContentPage.findOne({ pageType, status: 'published' });
    
    // Return default content if not found
    if (!content) {
      content = {
        pageType,
        title: getDefaultTitle(pageType),
        content: getDefaultContent(pageType),
        status: 'published'
      };
    }
    
    return successResponse(res, content, 'Content fetched successfully');
  } catch (error) {
    console.error('Get content error:', error);
    return errorResponse(res, error.message || 'Failed to fetch content', 500);
  }
};

// Default titles
function getDefaultTitle(pageType) {
  const titles = {
    about_us: 'About Us',
    terms: 'Terms and Conditions',
    privacy: 'Privacy Policy',
    faq: 'Frequently Asked Questions'
  };
  return titles[pageType] || pageType;
}

// Default content
function getDefaultContent(pageType) {
  const contents = {
    about_us: `
      <h2>Welcome to Tsatsaku</h2>
      <p>Tsatsaku is a comprehensive inventory and order management platform designed to streamline your business operations.</p>
      <h3>Our Mission</h3>
      <p>To provide businesses with efficient tools to manage their purchase orders, inventory, and buyer relationships seamlessly.</p>
      <h3>What We Offer</h3>
      <ul>
        <li>Real-time inventory tracking</li>
        <li>Purchase order management</li>
        <li>Buyer relationship management</li>
        <li>Comprehensive reporting</li>
        <li>Multi-warehouse support</li>
      </ul>
      <p>Contact us today to learn more about how Tsatsaku can help your business grow.</p>
    `,
    terms: `
      <h2>Terms and Conditions</h2>
      <p>Last updated: February 2026</p>
      <h3>1. Acceptance of Terms</h3>
      <p>By accessing and using the Tsatsaku platform, you accept and agree to be bound by the terms and provisions of this agreement.</p>
      <h3>2. Use License</h3>
      <p>Permission is granted to temporarily use the Tsatsaku platform for personal, non-commercial transitory viewing only.</p>
      <h3>3. User Account</h3>
      <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
      <h3>4. Disclaimer</h3>
      <p>The materials on Tsatsaku's platform are provided on an 'as is' basis. Tsatsaku makes no warranties, expressed or implied.</p>
      <h3>5. Limitations</h3>
      <p>In no event shall Tsatsaku or its suppliers be liable for any damages arising out of the use or inability to use the platform.</p>
    `,
    privacy: `
      <h2>Privacy Policy</h2>
      <p>Last updated: February 2026</p>
      <h3>Information We Collect</h3>
      <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
      <h3>How We Use Your Information</h3>
      <ul>
        <li>To provide and maintain our services</li>
        <li>To process transactions</li>
        <li>To send you technical notices and support messages</li>
        <li>To respond to your comments and questions</li>
      </ul>
      <h3>Data Security</h3>
      <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
      <h3>Contact Us</h3>
      <p>If you have any questions about this Privacy Policy, please contact us.</p>
    `,
    faq: `
      <h2>Frequently Asked Questions</h2>
      
      <div class="faq-item">
        <h3>Q: How do I create a purchase order?</h3>
        <p>A: Log in to your dashboard, navigate to "Orders" section, and click "Create New PO". Fill in the required details and submit.</p>
      </div>
      
      <div class="faq-item">
        <h3>Q: How can I track my order status?</h3>
        <p>A: Go to "My Purchase Orders" in your dashboard. Click on any order to view its detailed status timeline.</p>
      </div>
      
      <div class="faq-item">
        <h3>Q: How do I reset my password?</h3>
        <p>A: Click on "Forgot Password" on the login page. Enter your email and follow the instructions sent to reset your password.</p>
      </div>
      
      <div class="faq-item">
        <h3>Q: Can I export my order data?</h3>
        <p>A: Yes, you can export your order data to Excel format from the Orders page using the Export button.</p>
      </div>
      
      <div class="faq-item">
        <h3>Q: Who do I contact for support?</h3>
        <p>A: You can reach us through the Contact Us page or email us directly at support@tsatsaku.com.</p>
      </div>
    `
  };
  return contents[pageType] || '<p>Content coming soon.</p>';
}
