const controllers = require('../controllers');
const auth = require('../config/auth');

module.exports = (app) => {
    app.get('/', controllers.home);

    app.get('/users/register', controllers.user.registerGet);
    app.post('/users/register', controllers.user.registerPost);

    app.get('/users/login', controllers.user.loginGet);
    app.post('/users/login', controllers.user.loginPost);

    app.get('/users/logout', controllers.user.logout);

    app.get('/cars/create', auth.isInRole('Admin'), controllers.car.createGet);
    app.post('/cars/create', auth.isInRole('Admin'), controllers.car.createPost);

    app.get('/cars/:page/all', controllers.car.viewAllGet);
    app.post('/cars/all', controllers.car.viewAllPost);

    app.get('/cars/edit/:id', auth.isInRole('Admin'), controllers.car.editCarGet);
    app.post('/cars/edit/:id', auth.isInRole('Admin'), controllers.car.editCarPost);

    app.get('/users/profile/me', auth.isAuthenticated, controllers.user.myProfile);

    app.get('/cars/rent/:id', auth.isAuthenticated, controllers.car.rentGet);
    app.post('/cars/rent/:id', auth.isAuthenticated, controllers.car.rentPost);
};