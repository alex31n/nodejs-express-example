const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleeware/check-auth');
const orderController = require('../controllers/orders');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', checkAuth, orderController.orders_get_all);

router.post('/', checkAuth, orderController.orders_create_order);

router.get('/:orderId', checkAuth, orderController.orders_get_order);

router.delete('/:orderId', checkAuth, orderController.orders_delete_order);


module.exports = router;