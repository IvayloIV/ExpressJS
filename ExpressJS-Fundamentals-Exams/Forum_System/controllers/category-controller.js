const apiCategory = require('../api/category');

module.exports = {
    createGet: (req, res) => {
        res.render('category/create');
    },
    createPost: async (req, res) => {
        const { name } = req.body;

        try {
            await apiCategory.create({ name });
            req.session.message = 'Category created!';
            res.redirect('/');
        } catch (err) {
            res.render('category/create', { message: err.message });
        }
    },
    all: async (req, res) => {
        try {
            const categories = await apiCategory.all();
            res.render('category/all', { categories });
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    },
    remove: async (req, res) => {
        const id = req.params.id;

        try {
            await apiCategory.removeById(id);
            req.session.message = 'Successful removed!';
            res.redirect('/category/all');
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    }
};