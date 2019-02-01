const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = (app) => {
    app.get('/', controllers.home.index);
    app.get('/user/register', restrictedPages.isAnonymous, controllers.user.registerGet);
    app.post('/user/register', restrictedPages.isAnonymous, controllers.user.registerPost);

    app.get('/user/login', restrictedPages.isAnonymous, controllers.user.loginGet);
    app.post('/user/login', restrictedPages.isAnonymous, controllers.user.loginPost);

    app.get('/user/logout', restrictedPages.isAuthed, controllers.user.logout);

    app.get('/article/create', restrictedPages.isAuthed, controllers.article.createGet);
    app.post('/article/create', restrictedPages.isAuthed, controllers.article.createPost);

    app.get('/article/details/:id', controllers.article.details);

    app.get('/article/edit/:id', restrictedPages.isAuthed, controllers.article.editGet);
    app.post('/article/edit/:id', restrictedPages.isAuthed, controllers.article.editPost);

    app.get('/article/delete/:id', restrictedPages.isAuthed, controllers.article.deleteGet);
    app.post('/article/delete/:id', restrictedPages.isAuthed, controllers.article.deletePost);
};

