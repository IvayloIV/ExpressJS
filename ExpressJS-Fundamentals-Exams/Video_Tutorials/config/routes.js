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

    app.get('/course/create', restrictedPages.hasRole('Admin'), controllers.course.createCourseGet);
    app.post('/course/create', restrictedPages.hasRole('Admin'), controllers.course.createCoursePost);

    app.get('/course/edit/:id', restrictedPages.hasRole('Admin'), controllers.course.editCourseGet);
    app.post('/course/edit/:id', restrictedPages.hasRole('Admin'), controllers.course.editCoursePost);
    
    app.get('/course/planer/:id', restrictedPages.hasRole('Admin'), controllers.course.lecturePanel);
    app.post('/lecture/create/:id', restrictedPages.hasRole('Admin'), controllers.lecture.lectureCreatePost);
    app.get('/lecture/remove/:id', restrictedPages.hasRole('Admin'), controllers.lecture.removeLecture);

    app.get('/lecture/play/:id', restrictedPages.isAuthed, controllers.lecture.playVideo);
    
    app.get('/course/details/:id', restrictedPages.isAuthed, controllers.course.courseDetails);
    app.post('/course/enroll/:id', restrictedPages.isAuthed, controllers.course.enroll);

    app.get('/home/admin', restrictedPages.hasRole('Admin'), controllers.home.homeAdmin);
    app.get('/home/user', restrictedPages.isAuthed, controllers.home.homeUser);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};