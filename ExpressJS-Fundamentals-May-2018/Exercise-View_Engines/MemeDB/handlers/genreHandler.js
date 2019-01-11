const Genre = require('../models/Genre');

module.exports.getForm = (req, res) => {
    let data = {};

    if (req.query.message) {
        data.message = req.query.message;
    }

    res.render('addGenre', data);
};

module.exports.postForm = (req, res) => {
    let title = req.body.memeTitle;

    if (title === '') {
        res.redirect(`/addGenre/?message=${encodeURIComponent('Empty title!')}`);
        return;
    }

    Genre.create({
        title,
        memeList: []
    }).then(() => {
        res.redirect(`/addGenre/?message=${encodeURIComponent('Successful created!')}`);
    });
};