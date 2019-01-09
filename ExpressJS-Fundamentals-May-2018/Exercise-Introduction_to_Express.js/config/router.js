const handlers = require('../handlers/handlerBlender');
const multer = require('multer');

let upload = multer({ dest: './public/memeStorage' });

module.exports = (app) => {
    app.get('/', handlers.home);

    app.get('/viewAllMemes', handlers.viewAllMemes);

    app.get('/addGenre', handlers.genre.getForm);
    app.post('/addGenre', handlers.genre.postForm);

    app.get('/addMeme', handlers.meme.getForm);
    app.post('/addMeme', upload.single('meme'), handlers.meme.postForm);

    app.get('/getDetails/:id', handlers.meme.getDetails);
    app.get('/searchMeme', handlers.searchMeme.getForm);
    app.post('/searchMeme', handlers.searchMeme.postForm);
};