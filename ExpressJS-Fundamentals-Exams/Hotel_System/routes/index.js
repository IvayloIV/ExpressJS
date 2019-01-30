const userRouter = require('../routes/user');
const hotelRouter = require('../routes/hotel');
const commentRouter = require('../routes/comment');
const categoryRouter = require('../routes/category');
const mainRouter = require('../routes/main');

module.exports = {
    user: userRouter,
    hotel: hotelRouter,
    comment: commentRouter,
    category: categoryRouter,
    main: mainRouter
};