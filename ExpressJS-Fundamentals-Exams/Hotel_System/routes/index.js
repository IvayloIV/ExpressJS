const userRouter = require('./user');
const hotelRouter = require('./hotel');
const commentRouter = require('./comment');
const categoryRouter = require('./category');
const mainRouter = require('./main');

module.exports = {
    user: userRouter,
    hotel: hotelRouter,
    comment: commentRouter,
    category: categoryRouter,
    main: mainRouter
};