const userRouter = require('./user');
const threadRouter = require('./thread');
const categoryRouter = require('./category');
const answerRouter = require('./answer');
const mainRouter = require('./main');

module.exports = {
    user: userRouter,
    answer: answerRouter,
    thread: threadRouter,
    category: categoryRouter,
    main: mainRouter
};