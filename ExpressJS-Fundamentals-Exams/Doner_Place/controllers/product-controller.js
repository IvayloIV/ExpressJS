const apiProduct = require('../api/product');

module.exports = {
    createGet: (req, res) => {
        let message = req.session.message;
        req.session.message = '';

        res.render('product/create', { message });
    },
    createPost: async (req, res) => {
        try {
            await apiProduct.create(req.body);
            req.session.message = 'Created successful!';
            res.redirect('/');
        } catch (err) {
            res.render('product/create', { product: req.body, message: err });
        }
    },
    editGet: async (req, res) => {
        let id = req.params.id;
        let product = await apiProduct.getById(id);
        res.render('product/edit', { product });
    },
    editPost: async (req, res) => {
        let id = req.params.id;

        try {
            let product = await apiProduct.getById(id);
            await apiProduct.edit(req.body, product);
            req.session.message = 'Edited successful!';
            res.redirect('/');
        } catch (err) {
            req.body._id = id;
            res.render('product/edit', { product: req.body, message: err });
        }
    },
    deletePost: async (req, res) => {
        let id = req.params.id;
        
        try {
            await apiProduct.remove(id);
            req.session.message = 'Successful removed!';
            res.redirect('/');
        } catch (err) {
            res.redirect('/', {message: 'Something wrong happening!'});
        }
    }
};