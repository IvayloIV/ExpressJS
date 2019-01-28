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

    app.get('/flight/create', restrictedPages.hasRole('Admin'), controllers.flight.createGet);
    app.post('/flight/create', restrictedPages.hasRole('Admin'), controllers.flight.creatPost);

    app.get('/flight/details/:id', controllers.flight.details);
    app.get('/flight/public/:id', restrictedPages.hasRole('Admin'), controllers.flight.public);

    app.post('/seat/create/:id', restrictedPages.hasRole('Admin'), controllers.seat.create);
    app.get('/seat/remove/:id', restrictedPages.hasRole('Admin'), controllers.seat.remove);

    app.get('/flight/edit/:id', restrictedPages.hasRole('Admin'), controllers.flight.editGet);
    app.post('/flight/edit/:id', restrictedPages.hasRole('Admin'), controllers.flight.editPost);

    app.post('/seat/buy/:seatId/:flightId', restrictedPages.isAuthed, controllers.seat.buy);

    app.get('/cart/items', restrictedPages.isAuthed, controllers.cart.items);
    app.get('/cart/remove/:id', restrictedPages.isAuthed, controllers.cart.remove);
    app.get('/cart/checkout', restrictedPages.isAuthed, controllers.cart.checkout);

    app.get('/flight/my', restrictedPages.isAuthed, controllers.flight.myFlight);
    app.post('/flight/search', restrictedPages.hasRole('Admin'), controllers.flight.search);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};