const mongoose = require("mongoose");
const Product = require('../models/product');
const multer = require('multer');


exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };
            console.log(docs);
            // if (docs.length >= 0) {
            res.status(200).json(response);
            // }else{
            //     res.status(404).json({
            //         message:'No entries found'
            //     })
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

exports.products_create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
    });

    product.save()
        .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Created product successfully',
                    createdProduct: {
                        name: result.name,
                        price: result.price,
                        _id: result._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + result._id
                        }
                    }
                });
            }
        )
        .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            }
        );

};

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('_id name price productImage')
        .exec()
        .then(doc => {
            console.log('From database', doc);
            if (doc) {
                res.status(200).json(doc)
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

exports.products_update_product=(req, res, next) => {
    const id = req.params.productId;
    const updateObj = {};
    /*for (const ops of req.body) {
        updateObj[ops.propName] = ops.value;
    }*/
    for (const key of Object.keys(req.body)) {
        updateObj[key] = req.body[key];
    }

    Product.update({_id: id}, {$set: updateObj})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
        _id: id
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted successfully'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

/*const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter,
});*/

exports.products_image_upload = ()=>{
    return multer({
        storage: storage,
        limits: {fileSize: 1024 * 1024 * 5},
        fileFilter: fileFilter,
    })
};