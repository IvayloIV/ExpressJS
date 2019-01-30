const apiCategory = require('../api/category');
const apiHotel = require('../api/hotel');

module.exports = {
    addGet: (req, res) => {
        res.render('category/add');
    },
    addPost: async (req, res) => {
        let body = req.body;

        try {
            await apiCategory.add(body);
            req.session.message = 'Category added successful!';
            res.redirect('/');
        } catch (err) {
            res.render('category/add', { message: err.message });
        }
    },
    viewAll: async (req, res) => {
        try {
            const categories = await apiCategory.getAll();
            res.render('category/all', { categories });
        } catch (err) {
            console.log(err);
        }
    },
    currentCategory: async (req, res) => {
        let id = req.params.id;

        try {
            const hotels = await apiHotel.getByCategory(id);
            const category = await apiCategory.getById(id);

            res.render('category/hotels', { hotels, name: category.name });
        } catch (err) {
            console.log(err);
        }
    },
    remove: async (req, res) => {
        let id = req.params.id;
        try {
            await apiHotel.removeByCategoryId(id);
            req.session.message = 'Removed successful!';
            res.redirect('/category/all');
        } catch (err) {
            console.log(err);
        }
    }
};