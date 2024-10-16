const express = require('express');
const authentication = require('../middleware/authentication');
const authorisation = require('../middleware/authorisation');
const { getOrders, getShopperOrders, getSellerOrders, getOrder, cancelOrder, updateStatus } = require('../controllers/orderController');
const router = express.Router();

router.get('/', authentication, authorisation(['admin']), getOrders)
router.get('/byShopper', authentication, getShopperOrders);
router.get('/bySeller', authentication, authorisation(['seller']), getSellerOrders);

router.get('/:id', authentication, getOrder)
router.patch('/:id/cancel', authentication, cancelOrder)
router.patch('/:id/status', authentication, authorisation(['admin']), updateStatus)

module.exports = router;