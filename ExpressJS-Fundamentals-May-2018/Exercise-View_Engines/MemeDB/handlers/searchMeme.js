const fs = require('fs');
const Meme = require('../models/Meme');
const Genre = require('../models/Genre');

module.exports.getForm = (req, res) => {
    Genre.find({})
        .then((genres) => {
            res.render('searchMeme', { genres });
        });
};

module.exports.postForm = (req, res) => {
    let params = req.body;
    let title = params.memeTitle;
    let genre = params.genreSelect;

    let findObj = genre === 'all' ? {} : { '_id': genre };

    Genre.find(findObj)
        .then((genres) => {
            let memesId = [];
            for(let genre of genres) {
                for(let memeId of genre.memeList) {
                    memesId.push(memeId);
                }
            }
            
            Meme.find({ '_id': memesId })
                .sort({ 'date': -1 })
                .where('status').equals('on')
                .then((memes) => {
                    if (title !== '') {
                        memes = memes.filter(a => a.title.indexOf(title) !== -1);
                    } 

                    res.render('viewAll', { memes });
                });
        });
};