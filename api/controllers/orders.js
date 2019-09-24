const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all=(req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .populate('product','name price')
        .exec()
        .then(docs => {
            console.log(docs);

            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id,
                        }
                    }
                })
            };

            res.status(200).json(response)

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};

exports.orders_create_order = (req, res, next) => {

    Product.findById(req.body.productId)
        .then(result => {

            if (!result) {
                return res.status(404).json({
                    message: 'product_id is invalid'
                });
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()

        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order created',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id,
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });


};

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('_id product quantity')
        .populate('product','name price')
        .exec()
        .then(order => {
            if (!order){
                return res.status(404).json({
                    message:'Order not found'
                });
            }
            res.status(200).json(order);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_delete_order = (req, res, next) => {
    Order.remove({_id:req.params.orderId})
        .exec()
        .then(result=>{
            res.status(200).json({
                message: 'Order deleted'
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};