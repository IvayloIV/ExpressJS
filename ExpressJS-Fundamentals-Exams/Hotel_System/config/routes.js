const router = require('../routes');

module.exports = app => {
    app.use('/user', router.user);
    app.use('/hotel', router.hotel);
    app.use('/comment', router.comment);
    app.use('/category', router.category);
    app.use(router.main);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};