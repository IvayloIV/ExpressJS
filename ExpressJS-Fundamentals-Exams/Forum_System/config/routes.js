const router = require('../routes');

module.exports = app => {
    app.use('/user', router.user);
    app.use('/answer', router.answer);
    app.use('/thread', router.thread);
    app.use('/category', router.category);
    app.use(router.main);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};