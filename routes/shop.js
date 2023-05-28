const express = require('express');
const productsController = require('../controllers/products');
const errorController = require('../controllers/error');
const isauth = require('../auth/isauth');
const router = express.Router();

router.get('/', productsController.indexGet);
router.get('/products', productsController.shopGet);
router.get('/' + 'product' + '/' + ':prodId', productsController.productGet);
router.get('/cart', isauth, productsController.cartGet);
router.post('/cart', isauth, productsController.cartPost);
router.get('/orders', isauth, productsController.ordersGet);
router.post('/create-order', isauth, productsController.ordersPost);

router.get('/500', errorController.serverError)

module.exports = router;
