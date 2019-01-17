const Product = require('../models/Product');
let orderType = {
    'beef': (obj) => obj.beef = true,
    'chicken': (obj) => obj.chicken = true,
    'lamb': (obj) => obj.lamb = true
};

module.exports = {
    createGet: (req, res) => {
        let message = req.session.message;
        req.session.message = '';
        
        res.render('product/create', { message });
    },
    createPost: (req, res) => {
        let body = req.body;
        let category = body.category;
        let imageUrl = body.imageUrl;
        let size = body.size;
        let toppings = body.toppings.split(',').map(a => a.trim());

        if (!category || !imageUrl || size === '' || isNaN(size)) {
            res.render('product/create', { product: body, message: 'Invalid data!'});
            return;
        }
        size = Number(size);

        Product.create({ category, imageUrl, size, toppings }).then(() => {
            req.session.message = 'Created successful!';
            res.redirect('/');
        }).catch((err) => {
            res.render('product/create', { product: body, message: err.message});
        });
    },
    editGet: (req, res) => {
        let id = req.params.id;

        Product.findById(id).then((product) => {
            orderType[product.category](product);
            res.render('product/edit', { product });
        });
    },
    editPost: (req, res) => {
        let id = req.params.id;
        let body = req.body;
        body._id = id;
        let category = body.category;
        let imageUrl = body.imageUrl;
        let size = body.size;
        let toppings = body.toppings.split(',').map(a => a.trim());

        Product.findById(id).then(product => {
            if (!category || !imageUrl || size === '' || isNaN(size)) {
                orderType[product.category](body);
                res.render('product/edit', { product: body, message: 'Invalid data!'});
                return;
            }
            size = Number(size);
            product.category = category;
            product.imageUrl = imageUrl;
            product.size = size;
            product.toppings = toppings;
    
            product.save().then(() => {
                req.session.message = 'Edited successful!';
                res.redirect('/');
            }).catch((err) => {
                orderType[product.category](body);
                res.render('product/edit', { product: body, message: err.message});
            });
        }).catch((err) => {
            res.render('product/edit', { product: body, message: err.message});
        });
    },
    deletePost: (req, res) => {
        let id  = req.params.id;

        Product.remove({'_id': id}).then(() => {
            req.session.message = 'Successful removed!';
            res.redirect('/');
        });
    }
};