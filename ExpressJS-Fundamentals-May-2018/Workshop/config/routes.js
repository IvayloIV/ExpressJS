const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);

    app.get('/user/register', controllers.user.registerGet);
    app.post('/user/register', controllers.user.registerPost);

    app.get('/user/login', controllers.user.loginGet);
    app.post('/user/login', controllers.user.loginPost);
    
    app.get('/user/logout', controllers.user.logout);

    app.get('/article/create', restrictedPages.isAuthed, controllers.article.createGet);
    app.post('/article/create', restrictedPages.isAuthed, controllers.article.createPost);

    app.get('/article/details/:id', restrictedPages.isAuthed, controllers.article.details);

    app.get('/article/edit/:id', restrictedPages.isAuthed, controllers.article.editGet);
    app.post('/article/edit/:id', restrictedPages.isAuthed, controllers.article.editPost);

    app.get('/article/delete/:id', restrictedPages.isAuthed, controllers.article.deleteGet);
    app.post('/article/delete/:id', restrictedPages.isAuthed, controllers.article.deletePost);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};