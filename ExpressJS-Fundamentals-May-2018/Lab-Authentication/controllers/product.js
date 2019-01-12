const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports.addGet = (req, res) => {
    Category.find({}).then((categories) => {
        res.render('product/add', { categories });
    });
};

module.exports.addPost = (req, res) => {
    let productObj = req.body;
    productObj.image = '\\' + req.file.path;
    productObj.creator = req.user._id;

    Product.create(productObj).then((product) => {
        Category.findById(product.category).then((category) => {
            category.products.push(product._id);
            category.save();
        });
        res.redirect('/');
    });
};

module.exports.editGet = (req, res) => {
    let id = req.params.id;

    Product.findOne({ '_id': id, buyer: null}).then((product) => {
        if (!product) {
            res.sendStatus(404);
            return;
        }

        if (product.creator.equals(req.user._id) || req.user.roles.indexOf('Admin') >= 0) {
            Category.find().then((categories) => {
                res.render('product/edit', { product, categories });
            });
        } else {
            res.redirect('/');
        }
    });
};

module.exports.editPost = (req, res) => {
    let id = req.params.id;
    let editedProduct = req.body;

    Product.findOne({ '_id': id, buyer: null}).then((product) => {
        if (!product) {
            res.redirect(`/?error=${encodeURIComponent('Product was not found!')}`);
            return;
        }

        if (product.creator.equals(req.user._id) || req.user.roles.indexOf('Admin') >= 0) {
            product.name = editedProduct.name;
            product.description = editedProduct.description;
            product.price = editedProduct.price;

            if (req.file) {
                product.image = '\\' + req.file.path;
            }

            if (product.category.toString() !== editedProduct.category) {
                Category.findById(product.category).then((currentCategory) => {
                    Category.findById(editedProduct.category).then((nextCategory) => {
                        let index = currentCategory.products.indexOf(product._id);

                        if (index > 0) {
                            currentCategory.products.splice(index, 1);
                        }
                        currentCategory.save();

                        nextCategory.products.push(product._id);
                        nextCategory.save();

                        product.category = editedProduct.category;
                        product.save().then(() => {
                            res.redirect(`/?success=${encodeURIComponent('Product was updated successfully!')}`);
                        });
                    });
                });
            } else {
                product.save().then(() => {
                    res.redirect(`/?success=${encodeURIComponent('Product was updated successfully!')}`);
                });
            }
        } else {
            res.redirect('/');
        }
    });
};

module.exports.deleteGet = (req, res) => {
    let id = req.params.id;

    Product.findOne({ '_id': id, buyer: null}).then((product) => {
        if (!product) {
            res.sendStatus(404);
            return;
        }

        if (product.creator.equals(req.user._id) || req.user.roles.indexOf('Admin') >= 0) {
            res.render('product/delete', { product });
        } else {
            res.redirect('/');
        }
    });
};

module.exports.deletePost = (req, res) => {
    let id = req.params.id;

    Product.findOne({ '_id': id, buyer: null}).then((product) => {
        if (!product) {
            res.sendStatus(404);
            return;
        }

        if (product.creator.equals(req.user._id) || req.user.roles.indexOf('Admin') >= 0) {
            Category.findById(product.category).then((category) => {
                let index = category.products.indexOf(product._id);
                category.products.splice(index, 1);
                category.save();

                let imagePath = path.join(__dirname, `../${product.image}`);
                fs.unlink(imagePath, () => {
                    Product.deleteOne(product).then(() => {
                        res.redirect(`/?success=${encodeURIComponent('Product was deleted successfully!')}`);
                    });
                });
            });
        } else {
            res.redirect('/');
        }
    });
};

module.exports.buyGet = (req, res) => {
    let id = req.params.id;

    Product.findById(id).then((product) => {
        if (!product) {
            res.sendStatus(404);
            return;
        }

        res.render('product/buy', { product });
    });
};

module.exports.buyPost = (req, res) => {
    let productId = req.params.id;

    Product.findById(productId).then((product) => {
        if (product.buyer) {
            res.redirect(`/?error=${encodeURIComponent('Product was already bought!')}`);
            return;
        }

        product.buyer = req.user._id;
        product.save().then(() => {
            req.user.boughtProducts.push(product);
            req.user.save(() => {
                res.redirect('/');
            });
        });
    });
};