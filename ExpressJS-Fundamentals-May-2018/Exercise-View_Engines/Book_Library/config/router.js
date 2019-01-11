const handlers = require('../handlers');

module.exports = (app) => {
    app.get('/', handlers.home);

    app.get('/addBook', handlers.book.addBookGet);
    app.post('/addBook', handlers.book.addBookPost);

    app.get('/viewAll', handlers.book.viewAll);
    app.get('/book/details/:id', handlers.book.details);
};