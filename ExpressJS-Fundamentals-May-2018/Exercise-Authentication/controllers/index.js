const userController = require('./user');
const homeController = require('./home');
const carController = require('./car');

module.exports = {
    user: userController,
    home: homeController,
    car: carController
};