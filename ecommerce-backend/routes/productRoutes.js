const express = require('express'); // Import express
const { createProduct, getProducts, getProduct, buyProduct, getComments, addOrUpdateComment, updateProduct, deleteProduct } = require('../controllers/productController'); // Import product controller functions
const authentication = require('../middleware/authentication'); // Import authentication middleware
const authorisation = require('../middleware/authorisation'); // Import authorisation middleware
const router = express.Router(); // Create a router instance

router.get('/', getProducts); // Get all products
router.get('/bySeller', authentication, authorisation(['seller']), getProducts); // Get products by seller (authenticated sellers only)
router.get('/:id', getProduct); // Get a specific product by ID

router.post('/', authentication, authorisation(['seller']), createProduct); // Create a new product (authenticated sellers only)
router.put('/:id', authentication, authorisation(['seller']), updateProduct); // Update a product by ID (authenticated sellers only)
router.delete('/:id', authentication, authorisation(['seller']), deleteProduct); // Delete a product by ID (authenticated sellers only)
router.post('/:id/buy', authentication, buyProduct); // Buy a product by ID (authenticated users only)

router.get('/:id/comments', getComments); // Get comments for a specific product
router.put('/:id/comments', authentication, addOrUpdateComment); // Add or update a comment for a specific product (authenticated users only)

module.exports = router; // Export the router
