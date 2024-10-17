const express = require('express'); // Import express
const authentication = require('../middleware/authentication'); // Import authentication middleware
const authorisation = require('../middleware/authorisation'); // Import authorisation middleware
const { getOrders, getShopperOrders, getSellerOrders, getOrder, cancelOrder, updateStatus } = require('../controllers/orderController'); // Import order controller functions
const router = express.Router(); // Create a router instance

router.get('/', authentication, authorisation(['admin']), getOrders); // Get all orders (admin only)
router.get('/byShopper', authentication, getShopperOrders); // Get orders by shopper
router.get('/bySeller', authentication, authorisation(['seller']), getSellerOrders); // Get orders by seller

router.get('/:id', authentication, getOrder); // Get a specific order by ID
router.patch('/:id/cancel', authentication, cancelOrder); // Cancel an order by ID
router.patch('/:id/status', authentication, authorisation(['admin']), updateStatus); // Update order status (admin only)

module.exports = router; // Export the router
