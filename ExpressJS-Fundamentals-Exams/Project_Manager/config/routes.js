const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/index.html', controllers.home.index);

    app.get('/user/register', restrictedPages.isAnonymous, controllers.user.registerGet);
    app.post('/user/register', restrictedPages.isAnonymous, controllers.user.registerPost);

    app.get('/user/login', restrictedPages.isAnonymous, controllers.user.loginGet);
    app.post('/user/login', restrictedPages.isAnonymous, controllers.user.loginPost);
    
    app.post('/user/logout', restrictedPages.isAuthed, controllers.user.logout);

    app.get('/team/create', restrictedPages.hasRole('Admin'), controllers.team.createGet);
    app.post('/team/create', restrictedPages.hasRole('Admin'), controllers.team.createPost);

    app.get('/project/create', restrictedPages.hasRole('Admin'), controllers.project.createGet);
    app.post('/project/create', restrictedPages.hasRole('Admin'), controllers.project.createPost);

    app.get('/project/manage', restrictedPages.hasRole('Admin'), controllers.project.manageGet);
    app.post('/project/manage', restrictedPages.hasRole('Admin'), controllers.project.managePost);

    app.get('/team/manage', restrictedPages.hasRole('Admin'), controllers.team.manageGet);
    app.post('/team/manage', restrictedPages.hasRole('Admin'), controllers.team.managePost);

    app.get('/project/user', restrictedPages.isAuthed, controllers.project.userProjects);
    app.get('/team/user', restrictedPages.isAuthed, controllers.team.userTeams);

    app.get('/user/my', restrictedPages.isAuthed, controllers.user.myProfile);
    app.post('/team/leave/:id', restrictedPages.isAuthed, controllers.user.leaveTeam);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};