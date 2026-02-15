const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ContentPage = require('./models/ContentPage.model');
const User = require('./models/User.model');
const Buyer = require('./models/Buyer.model');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Create test users for all roles
    console.log('Creating test users...');
    
    // Admin User
    const adminExists = await User.findOne({ email: 'admin@tsatsaku.com' });
    if (!adminExists) {
      await User.create({
        email: 'admin@tsatsaku.com',
        password: 'Admin@123456',
        firstName: 'System',
        lastName: 'Admin',
        role: 'admin',
        status: 'active'
      });
      console.log('✅ Admin user created: admin@tsatsaku.com / Admin@123456');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
    
    // MAN_User
    const manUserExists = await User.findOne({ email: 'man@tsatsaku.com' });
    if (!manUserExists) {
      await User.create({
        email: 'man@tsatsaku.com',
        password: 'ManUser@123',
        firstName: 'Manager',
        lastName: 'User',
        role: 'man_user',
        status: 'active'
      });
      console.log('✅ MAN_User created: man@tsatsaku.com / ManUser@123');
    } else {
      console.log('ℹ️ MAN_User already exists');
    }
    
    // Buyer User
    const buyerExists = await User.findOne({ email: 'buyer@example.com' });
    if (!buyerExists) {
      const buyerUser = await User.create({
        email: 'buyer@example.com',
        password: 'Buyer@123',
        firstName: 'Test',
        lastName: 'Buyer',
        role: 'buyer',
        status: 'active'
      });
      
      // Get admin user for createdBy reference
      const adminUser = await User.findOne({ email: 'admin@tsatsaku.com' });
      
      // Create corresponding Buyer record
      await Buyer.create({
        userId: buyerUser._id,
        companyName: 'Test Import Company',
        companyInfo: {
          industry: 'Import/Export',
          website: 'https://testimport.com'
        },
        contactPerson: {
          name: 'Test Buyer',
          designation: 'Purchasing Manager',
          email: 'buyer@example.com',
          phone: '+1234567890'
        },
        addresses: {
          billing: {
            street: '123 Business Ave',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001'
          },
          shipping: {
            street: '123 Business Ave',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001'
          }
        },
        status: 'active',
        createdBy: adminUser._id
      });
      console.log('✅ Buyer user created: buyer@example.com / Buyer@123');
    } else {
      console.log('ℹ️ Buyer user already exists');
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

    console.log('✅ Database seeding completed successfully!');
    console.log('\n=== TEST CREDENTIALS ===');
    console.log('Admin: admin@tsatsaku.com / Admin@123456');
    console.log('MAN_User: man@tsatsaku.com / ManUser@123');
    console.log('Buyer: buyer@example.com / Buyer@123');
    console.log('========================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();

