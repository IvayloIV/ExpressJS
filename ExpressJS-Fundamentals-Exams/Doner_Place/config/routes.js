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

    app.get('/product/create', restrictedPages.hasRole('Admin'), controllers.product.createGet);
    app.post('/product/create', restrictedPages.hasRole('Admin'), controllers.product.createPost);

    app.get('/order/checkout/:id', restrictedPages.isAuthed, controllers.order.orderGet);
    app.post('/order/checkout/:id', restrictedPages.isAuthed, controllers.order.orderPost);

    app.get('/order/details/:id', restrictedPages.isAuthed, controllers.order.details);
    
    app.get('/order/status', restrictedPages.isAuthed, controllers.order.status);
    app.get('/order/status/admin', restrictedPages.hasRole('Admin'), controllers.order.statusAdminGet);
    app.post('/order/status/admin', restrictedPages.hasRole('Admin'), controllers.order.statusAdminPost);

    app.get('/product/edit/:id', restrictedPages.hasRole('Admin'), controllers.product.editGet);
    app.post('/product/edit/:id', restrictedPages.hasRole('Admin'), controllers.product.editPost);

    app.get('/product/remove/:id', restrictedPages.hasRole('Admin'), controllers.product.deletePost);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};