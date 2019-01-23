const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/index.html', controllers.home.index);

    app.get('/user/register', controllers.user.registerGet);
    app.post('/user/register', controllers.user.registerPost);

    app.get('/user/login', controllers.user.loginGet);
    app.post('/user/login', controllers.user.loginPost);
    
    app.get('/user/logout', restrictedPages.isAuthed, controllers.user.logout);

    app.get('/channel/all', restrictedPages.isAuthed, controllers.channel.all);

    app.get('/channel/create', restrictedPages.hasRole('Admin'), controllers.channel.createGet);
    app.post('/channel/create', restrictedPages.hasRole('Admin'), controllers.channel.createPost);

    app.get('/channel/details/:id', restrictedPages.isAuthed, controllers.channel.details);
    app.get('/channel/my', restrictedPages.isAuthed, controllers.channel.myChannels);

    app.get('/channel/follow/:id', restrictedPages.isAuthed, controllers.channel.follow);
    app.get('/channel/unfollow/:id', restrictedPages.isAuthed, controllers.channel.unfollow);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};