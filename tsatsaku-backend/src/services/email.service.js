const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog.model');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Email templates
const emailTemplates = {
  welcome: (data) => ({
    subject: 'Welcome to Tsatsaku',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Welcome to Tsatsaku!</h2>
        <p>Hello ${data.name},</p>
        <p>Your account has been created successfully.</p>
        <p>You can now login to your dashboard and start managing your orders.</p>
        <p>If you have any questions, feel free to contact us.</p>
        <br>
        <p>Best regards,</p>
        <p>The Tsatsaku Team</p>
      </div>
    `
  }),

  password_reset: (data) => ({
    subject: 'Password Reset OTP - Tsatsaku',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Password Reset Request</h2>
        <p>Hello ${data.name},</p>
        <p>You have requested to reset your password. Please use the following OTP:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #0ea5e9; letter-spacing: 5px; margin: 0;">${data.otp}</h1>
        </div>
        <p>This OTP is valid for 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br>
        <p>Best regards,</p>
        <p>The Tsatsaku Team</p>
      </div>
    `
  }),

  password_changed: (data) => ({
    subject: 'Password Changed Successfully - Tsatsaku',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Password Changed</h2>
        <p>Hello ${data.name},</p>
        <p>Your password has been changed successfully.</p>
        <p>If you didn't make this change, please contact us immediately.</p>
        <br>
        <p>Best regards,</p>
        <p>The Tsatsaku Team</p>
      </div>
    `
  }),

  account_created: (data) => ({
    subject: 'Your Account Has Been Created - Tsatsaku',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Account Created</h2>
        <p>Hello ${data.name},</p>
        <p>Your account has been created by an administrator.</p>
        <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0;">
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Temporary Password:</strong> ${data.password}</p>
        </div>
        <p>Please login and change your password immediately.</p>
        <br>
        <p>Best regards,</p>
        <p>The Tsatsaku Team</p>
      </div>
    `
  }),

  po_created: (data) => ({
    subject: `Purchase Order Created - ${data.poNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Purchase Order Created</h2>
        <p>Hello ${data.buyerName},</p>
        <p>A new purchase order has been created for you.</p>
        <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0;">
          <p><strong>PO Number:</strong> ${data.poNumber}</p>
          <p><strong>Total Amount:</strong> ${data.currency} ${data.totalAmount}</p>
          <p><strong>Expected Delivery:</strong> ${data.expectedDeliveryDate}</p>
        </div>
        <p>You can view the details in your dashboard.</p>
        <br>
        <p>Best regards,</p>
        <p>The Tsatsaku Team</p>
      </div>
    `
  }),

  po_status_update: (data) => ({
    subject: `Order Status Updated - ${data.poNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Order Status Updated</h2>
        <p>Hello ${data.buyerName},</p>
        <p>The status of your purchase order has been updated.</p>
        <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0;">
          <p><strong>PO Number:</strong> ${data.poNumber}</p>
          <p><strong>New Status:</strong> ${data.status}</p>
          ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
        </div>
        <p>You can view the details in your dashboard.</p>
        <br>
        <p>Best regards,</p>
        <p>The Tsatsaku Team</p>
      </div>
    `
  }),

  low_stock_alert: (data) => ({
    subject: 'Low Stock Alert - Tsatsaku',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Low Stock Alert</h2>
        <p>This is an automated alert for low stock.</p>
        <div style="background-color: #fef2f2; padding: 20px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <p><strong>Product:</strong> ${data.productName}</p>
          <p><strong>Warehouse:</strong> ${data.warehouseName}</p>
          <p><strong>Current Stock:</strong> ${data.currentStock}</p>
          <p><strong>Restock Level:</strong> ${data.restockLevel}</p>
        </div>
        <p>Please take necessary action to replenish the stock.</p>
        <br>
        <p>Best regards,</p>
        <p>The Tsatsaku System</p>
      </div>
    `
  }),

  buyer_created: (data) => ({
    subject: 'Welcome to Tsatsaku - Your Account Details',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Welcome to Tsatsaku!</h2>
        <p>Hello ${data.name},</p>
        <p>Your buyer account has been created. Here are your login credentials:</p>
        <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0;">
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Password:</strong> ${data.password}</p>
        </div>
        <p>Please login and change your password for security purposes.</p>
        <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Login Now</a>
        <br><br>
        <p>Best regards,</p>
        <p>The Tsatsaku Team</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, templateType, data, recipientName = '') => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates[templateType];
    
    if (!template) {
      throw new Error(`Email template '${templateType}' not found`);
    }
    
    const { subject, html } = template(data);
    
    // Create email log
    const emailLog = new EmailLog({
      recipient: to,
      recipientName,
      subject,
      content: html,
      templateType,
      status: 'pending'
    });
    
    await emailLog.save();
    
    // Send email
    const info = await transporter.sendMail({
      from: `"Tsatsaku" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });
    
    // Update email log
    emailLog.status = 'sent';
    emailLog.sentAt = new Date();
    await emailLog.save();
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    
    // Update email log with error
    try {
      await EmailLog.findOneAndUpdate(
        { recipient: to, templateType, status: 'pending' },
        { status: 'failed', errorMessage: error.message }
      );
    } catch (logError) {
      console.error('Failed to update email log:', logError);
    }
    
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  emailTemplates
};
