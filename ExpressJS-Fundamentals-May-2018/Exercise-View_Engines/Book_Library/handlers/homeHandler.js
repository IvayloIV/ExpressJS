const Book = require('../models/Book');

module.exports = (req, res) => {
    Book.count().then((count) => {
        res.render('index', { count });
    });
};