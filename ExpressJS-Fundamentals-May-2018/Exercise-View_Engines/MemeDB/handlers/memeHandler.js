const Meme = require('../models/Meme');
const Genre = require('../models/Genre');

module.exports.getForm = (req, res) => {
    Genre.find({}).then((genres) => {
        let data = { genres };

        if (req.query.message) {
            data.message = req.query.message;
        }

        res.render('addMeme', data);
    });
};

module.exports.postForm = (req, res) => {
    let memeObj = req.body;
    memeObj.url = '\\' + req.file.path;

    Meme.create({
        title: memeObj.memeTitle,
        status: memeObj.status,
        description: memeObj.memeDescription,
        url: memeObj.url,
        genre: memeObj.genreSelect
    }).then((addedMeme) => {
        Genre.findOne({ '_id': addedMeme.genre})
            .then((genre) => {
                genre.memeList.push(addedMeme._id);
                Genre.create(genre)
                    .then(() => {
                        res.redirect(`/addMeme/?message=${encodeURIComponent('Meme was successful created!')}`);
                    });
            });
    });
};

module.exports.getDetails = (req, res) => {
    let id = req.params.id;

    Meme.findOne({ '_id': id})
        .then((meme) => {
            res.render('details', { meme });
        });
};