const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ContentPage = require('./models/ContentPage.model');
const User = require('./models/User.model');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if admin exists, if not create one
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        email: 'admin@tsatsaku.com',
        password: 'Admin@123456',
        firstName: 'System',
        lastName: 'Admin',
        role: 'admin',
        status: 'active'
      });
      console.log('Admin user created');
      console.log('Email: admin@tsatsaku.com');
      console.log('Password: Admin@123456');
    }

    // Seed content pages
    const contentPages = [
      {
        pageType: 'about_us',
        title: 'About Us',
        content: `
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
        `,
        status: 'published'
      },
      {
        pageType: 'terms',
        title: 'Terms and Conditions',
        content: `
          <h2>Terms and Conditions</h2>
          <p>Last updated: February 2026</p>
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using the Tsatsaku platform, you accept and agree to be bound by the terms and provisions of this agreement.</p>
          <h3>2. Use License</h3>
          <p>Permission is granted to temporarily use the Tsatsaku platform for personal, non-commercial transitory viewing only.</p>
          <h3>3. User Account</h3>
          <p>You are responsible for maintaining the confidentiality of your account and password.</p>
        `,
        status: 'published'
      },
      {
        pageType: 'privacy',
        title: 'Privacy Policy',
        content: `
          <h2>Privacy Policy</h2>
          <p>Last updated: February 2026</p>
          <h3>Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
          <h3>How We Use Your Information</h3>
          <ul>
            <li>To provide and maintain our services</li>
            <li>To process transactions</li>
            <li>To send you technical notices and support messages</li>
          </ul>
        `,
        status: 'published'
      },
      {
        pageType: 'faq',
        title: 'Frequently Asked Questions',
        content: `
          <h2>Frequently Asked Questions</h2>
          <h3>Q: How do I create a purchase order?</h3>
          <p>A: Log in to your dashboard, navigate to "Orders" section, and click "Create New PO".</p>
          <h3>Q: How can I track my order status?</h3>
          <p>A: Go to "My Purchase Orders" in your dashboard. Click on any order to view its detailed status timeline.</p>
          <h3>Q: How do I reset my password?</h3>
          <p>A: Click on "Forgot Password" on the login page and follow the instructions.</p>
        `,
        status: 'published'
      }
    ];

    for (const page of contentPages) {
      await ContentPage.findOneAndUpdate(
        { pageType: page.pageType },
        page,
        { upsert: true, new: true }
      );
    }
    console.log('Content pages seeded');

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
