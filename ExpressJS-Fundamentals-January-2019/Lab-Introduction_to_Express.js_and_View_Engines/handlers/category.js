const Category = require('../models/Category');

module.exports = {
    addGet: (req, res) => {
        res.render('category/add');
    },
    addPost: async (req, res) => {
        let category = req.body;
        await Category.create(category);
        res.redirect('/');
    },
    productByCategory: (req, res) => {
        let categoryName = req.params.category;

        Category.findOne({ name: categoryName })
            .populate('products')
            .then((category) => {
                if (!category) {
                    res.sendStatus(404);
                    return;
                }

                res.render('category/products',  {category});
            });
    }
};