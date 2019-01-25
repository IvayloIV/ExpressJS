const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/index.html', controllers.home.index);

    app.get('/user/register', controllers.user.registerGet);
    app.post('/user/register', controllers.user.registerPost);

    app.get('/user/login', controllers.user.loginGet);
    app.post('/user/login', controllers.user.loginPost);
    
    app.get('/user/logout', controllers.user.logout);

    app.get('/thread/all', restrictedPages.isAuthed, controllers.thread.all);

    app.post('/thread/find', restrictedPages.isAuthed, controllers.thread.search);
    app.get('/thread/find/:id', restrictedPages.isAuthed, controllers.thread.searchById);
    
    app.post('/message/add', restrictedPages.isAuthed, controllers.message.createPost);

    app.get('/message/like/:threadId/:messageId', restrictedPages.isAuthed, controllers.message.like);
    app.get('/message/dislike/:threadId/:messageId', restrictedPages.isAuthed, controllers.message.dislike);

    app.get('/thread/block/:id', restrictedPages.isAuthed, controllers.thread.block);
    app.get('/thread/unblock/:id', restrictedPages.isAuthed, controllers.thread.unblock);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};