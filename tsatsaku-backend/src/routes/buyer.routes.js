const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const buyerController = require('../controllers/buyer.controller');

// All routes require authentication and buyer role
router.use(authenticate);
router.use(authorize('buyer'));

// Routes
router.get('/dashboard-stats', buyerController.getDashboardStats);
router.get('/purchase-orders', buyerController.getPurchaseOrders);
router.get('/purchase-orders/:poId', buyerController.getPurchaseOrder);

module.exports = router;
