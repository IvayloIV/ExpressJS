const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/index.html', controllers.home.index);

    app.get('/user/register', restrictedPages.isAnonymous, controllers.user.registerGet);
    app.post('/user/register', restrictedPages.isAnonymous, controllers.user.registerPost);

    app.get('/user/login', restrictedPages.isAnonymous, controllers.user.loginGet);
    app.post('/user/login', restrictedPages.isAnonymous, controllers.user.loginPost);
    
    app.get('/user/logout', restrictedPages.isAuthed, controllers.user.logout);

    app.get('/tweet/create', restrictedPages.isAuthed, controllers.tweet.createGet);
    app.post('/tweet/create', restrictedPages.isAuthed, controllers.tweet.createPost);

    app.get('/tag/:name', controllers.tweet.getByTag);
    app.get('/tweet/myProfile', restrictedPages.isAuthed, controllers.user.my);

    app.get('/tweet/details/:id', controllers.tweet.details);

    app.get('/tweet/like/:id', restrictedPages.isAuthed, controllers.tweet.like);
    app.get('/tweet/dislike/:id', restrictedPages.isAuthed, controllers.tweet.dislike);

    app.get('/tweet/edit/:id', restrictedPages.hasRole('Admin'), controllers.tweet.editGet);
    app.post('/tweet/edit/:id', restrictedPages.hasRole('Admin'), controllers.tweet.editPost);

    app.get('/tweet/delete/:id', restrictedPages.hasRole('Admin'), controllers.tweet.remove);

    app.get('/user/all', restrictedPages.hasRole('Admin'), controllers.user.allUsers);
    app.get('/user/admin/:id', restrictedPages.hasRole('Admin'), controllers.user.createAdmin);
    app.get('/admin/all', restrictedPages.hasRole('Admin'), controllers.user.allAdmins);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};