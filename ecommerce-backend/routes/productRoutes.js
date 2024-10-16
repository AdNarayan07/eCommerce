const express = require('express');
const { createProduct, getProducts, getProduct, buyProduct, getComments, addOrUpdateComment, updateProduct, deleteProduct } = require('../controllers/productController');
const authentication = require('../middleware/authentication');
const authorisation = require('../middleware/authorisation');
const router = express.Router();

router.get('/', getProducts);
router.get('/bySeller', authentication, authorisation(['seller']), getProducts);
router.get('/:id', getProduct);

router.post('/', authentication, authorisation(['seller']), createProduct);
router.put('/:id', authentication, authorisation(['seller']), updateProduct);
router.delete('/:id', authentication, authorisation(['seller']), deleteProduct);
router.post('/:id/buy', authentication, buyProduct);

router.get('/:id/comments', getComments);
router.put('/:id/comments', authentication, addOrUpdateComment);

module.exports = router;