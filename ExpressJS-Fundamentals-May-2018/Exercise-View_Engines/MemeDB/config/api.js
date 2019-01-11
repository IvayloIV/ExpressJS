const express = require('express');
const Genre = require('../models/Genre');
const Meme = require('../models/Meme');
const api = express.Router();

api.get('/', getMemes);
api.get('/memes', getMemes);
api.get('/memes/:idMeme', getMemeById);
api.delete('/memes/:idMeme', deleteMemeById);

function getMemes(req, res) {
    Meme.find({})
        .then((memes) => {
            res.json(memes);
        });
}

function getMemeById(req, res) {
    let memeId = req.params.idMeme;

    Meme.findOne({ '_id': memeId })
        .then((meme) => {
            res.json(meme);
        })
        .catch(() => {
            res.send('Not exist!');
        });
}

function deleteMemeById(req, res) {
    let memeId = req.params.idMeme;

    Meme.findByIdAndRemove({ '_id': memeId })
        .then((meme) => {
            Genre.findOne({ '_id': meme.genre})
                .then((genre) => {
                    let index = genre.memeList.indexOf(meme._id);
                    genre.memeList.splice(index, 1);
                    Genre.create(genre)
                        .then(() => {
                            res.json(meme);
                        });
                });
        })
        .catch(() => {
            res.send('Not exist!');
        });
}

module.exports = api;