const Meme = require('../models/Meme');

module.exports = (req, res) => {
    Meme.find({})
        .sort({ date: -1 })
        .where('status').equals('on')
        .then((memes) => {
            res.render('viewAll', { memes });
        });
};