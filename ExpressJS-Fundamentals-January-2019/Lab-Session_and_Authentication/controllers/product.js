const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = {
    addGet: (req, res) => {
        Category.find({}).then((categories) => {
            res.render('product/add', { categories });
        });
    },
    addPost: async (req, res) => {
        try {
            let productObj = req.body;
            productObj.image = '\\' + req.file.path;
            productObj.creator = req.user.id;

            let product = await Product.create(productObj);
            let category = await Category.findById(product.category);
            category.products.push(product._id);
            category.save();
            res.redirect('/');
        } catch (err) {
            console.log(err);
        }
    },
    editGet: (req, res) => {
        let id = req.params.id;

        Product.findById(id).then((product) => {
            if (!product) {
                res.sendStatus(404);
                return;
            }

            if (product.buyer) {
                res.redirect(`/?error=${encodeURIComponent('Product was already bought!')}`);
                return;
            }

            if (product.creator.equals(req.user.id) ||
                req.user.roles.indexOf('Admin') >= 0) {
                Category.find({}).then((categories) => {
                    res.render('product/edit', { product, categories });
                });
            } else {
                res.redirect(`/?error=${encodeURIComponent('You are not creator.')}`);
            }
        });
    },
    editPost: async (req, res) => {
        let id = req.params.id;
        let editedProduct = req.body;

        let product = await Product.findById(id);
        if (!product) {
            res.redirect(`/?error=${encodeURIComponent('Product was not found!')}`);
            return;
        }

        if (product.buyer) {
            res.redirect(`/?error=${encodeURIComponent('Product was already bought!')}`);
            return;
        }

        if (!product.creator.equals(req.user.id) &&
            req.user.roles.indexOf('Admin') === -1) {
            res.redirect(`/?error=${encodeURIComponent('You are not creator.')}`);
            return;
        }

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
                    if (index >= 0) {
                        currentCategory.products.splice(index, 1);
                    }
                    currentCategory.save();
                    nextCategory.products.push(product._id);
                    nextCategory.save();
                    product.category = editedProduct.category;

                    product.save().then(() => {
                        res.redirect(`/?success=${encodeURIComponent('Product was edited!')}`);
                    });
                });
            });
        } else {
            product.save().then(() => {
                res.redirect(`/?success=${encodeURIComponent('Product was edited successfully!')}`);
            });
        }
    },
    deleteGet: async (req, res) => {
        let id = req.params.id;

        try {
            let product = await Product.findById(id);

            if (product.buyer) {
                res.redirect(`/?error=${encodeURIComponent('Product was already bought!')}`);
                return;
            }

            if (!product.creator.equals(req.user.id) &&
                req.user.roles.indexOf('Admin') === -1) {
                res.redirect(`/?error=${encodeURIComponent('You are not creator.')}`);
                return;
            }

            res.render('product/delete', { product });
        } catch (err) {
            console.log(err);
        }
    },
    deletePost: async (req, res) => {
        let id = req.params.id;

        try {
            let product = await Product.findById(id);
            let category = await Category.findById(product.category);

            if (product.buyer) {
                res.redirect(`/?error=${encodeURIComponent('Product was already bought!')}`);
                return;
            }

            if (!product.creator.equals(req.user.id) &&
                req.user.roles.indexOf('Admin') === -1) {
                res.redirect(`/?error=${encodeURIComponent('You are not creator.')}`);
                return;
            }

            let index = category.products.indexOf(product._id);
            category.products.splice(index, 1);
            await category.save();

            let imagePath = path.join(__dirname, `../${product.image}`);
            fs.unlink(imagePath, (err) => {
                Product.findByIdAndRemove(id).then(() => {
                    res.redirect(`/?success=${encodeURIComponent('Product was deleted!')}`);
                });
            });
        } catch (err) {
            console.log(err);
        }
    },
    buyGet: async (req, res) => {
        let id = req.params.id;

        try {
            let product = await Product.findById(id);
            res.render('product/buy', { product });
        } catch (err) {
            console.log(err);
        }
    },
    buyPost: (req, res) => {
        let productId = req.params.id;

        Product.findById(productId).then(product => {
            if (product.buyer) {
                let error = `error=${encodeURIComponent('Product was already bought!')}`;
                res.redirect(`/?${error}`);
                return;
            }

            product.buyer = req.user._id;
            product.save().then(() => {
                req.user.boughtProducts.push(productId);
                req.user.save().then(() => {
                    res.redirect('/');
                });
            });
        });
    }
};