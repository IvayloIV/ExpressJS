const Book = require('../models/Book');

module.exports.addBookGet = (req, res) => {
    let data = {};

    if (req.query.errorMessage) {
        data.errorMessage = req.query.errorMessage;
    } else if (req.query.successMessage) {
        data.successMessage = req.query.successMessage;
    }

    res.render('addBook', data);
};

module.exports.addBookPost = (req, res) => {
    let body = req.body;

    if (!body.bookTitle || !body.bookPoster) {
        body.errorMessage = 'Please fill all files!';
        res.render('addBook', body);
        return;
    }

    Book.create({
        title: body.bookTitle,
        image: body.bookPoster,
        year: Number(body.bookYear),
        author: body.bookAuthor
    }).then(() => {
        res.redirect(`/addBook/?successMessage=${decodeURIComponent('Book added!')}`);
    });
};

module.exports.viewAll = (req, res) => {
    Book.find({})
        .sort({ year: 1 })
        .then((books) => {
            res.render('viewAll', { books });
        });
};

module.exports.details = (req, res) => {
    let id = req.params.id;

    Book.findById(id).then((book) => {
        res.render('details', { book });
    });
};