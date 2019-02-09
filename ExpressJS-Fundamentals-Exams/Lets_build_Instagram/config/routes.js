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

    app.get('/image/create', restrictedPages.isAuthed, controllers.image.createGet);
    app.post('/image/create', restrictedPages.isAuthed, controllers.image.createPost);

    app.get('/image/tag/:name', controllers.image.viewByTag);

    app.get('/user/profile/:username', restrictedPages.isAuthed, controllers.user.profile);
    app.get('/image/details/:id', controllers.image.details);
    
    app.get('/image/like/:id', restrictedPages.isAuthed, controllers.image.like);
    app.get('/image/dislike/:id', restrictedPages.isAuthed, controllers.image.dislike);

    app.get('/image/edit/:id', restrictedPages.hasRole('Admin'), controllers.image.editGet);
    app.post('/image/edit/:id', restrictedPages.hasRole('Admin'), controllers.image.editPost);

    app.get('/image/delete/:id', restrictedPages.hasRole('Admin'), controllers.image.remove);

    app.get('/user/admins', restrictedPages.hasRole('Admin'), controllers.user.admins);
    app.get('/user/users', restrictedPages.hasRole('Admin'), controllers.user.users);
    
    app.get('/user/create/admin/:id', restrictedPages.hasRole('Admin'), controllers.user.createAdmin);
    app.get('/image/search', controllers.image.search);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};