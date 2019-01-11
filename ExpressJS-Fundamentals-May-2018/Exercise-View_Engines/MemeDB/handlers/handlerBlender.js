const homeHandler = require('./homeHandler');
const allMemesHandler = require('./allMemesHandler');
const genreHandler = require('./genreHandler');
const memeHandler = require('./memeHandler');
const searchHandler = require('./searchMeme');

module.exports = {
    home: homeHandler,
    viewAllMemes: allMemesHandler,
    genre: genreHandler,
    meme: memeHandler,
    searchMeme: searchHandler
};