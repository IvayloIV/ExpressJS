const controllers = require('../controllers');

module.exports = app => {
    app.get('/', controllers.home.index);
    
    app.get('/about', controllers.home.about);

    app.get('/create', controllers.cube.createGet);
    app.post('/create', controllers.cube.createPost);
    
    app.get('/details/:id', controllers.cube.details);
    app.post('/search', controllers.home.search);
};