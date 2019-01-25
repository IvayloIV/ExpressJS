const apiMessage = require('../api/message');
const apiThread = require('../api/thread');

module.exports = {
    createPost: async (req, res) => {
        try {
            let body = req.body;
            let threadId = body.threadId;
            let messageStr = body.message;

            if (messageStr.length > 1000) {
                req.session.message = 'Message must be between 0 and 1000 symbols!';
                req.session.messageText = messageStr;
                res.redirect(`/thread/find/${threadId}`);
                return;
            }

            let message = await apiMessage.create(messageStr, req.user.id);
            await apiThread.addMessage(message, threadId);

            req.session.message = 'Successful added message!';
            res.redirect(`/thread/find/${threadId}`);
        } catch (err) {
            console.log(err);
        }
    },
    like: async (req, res) => {
        try {
            let threadId = req.params.threadId;
            let messageId = req.params.messageId;

            await apiMessage.like(messageId);
            res.redirect(`/thread/find/${threadId}`);
        } catch (err) {
            console.log(err);
        }
    },
    dislike: async (req, res) => {
        try {
            let threadId = req.params.threadId;
            let messageId = req.params.messageId;

            await apiMessage.dislike(messageId);
            res.redirect(`/thread/find/${threadId}`);
        } catch (err) {
            console.log(err);
        }
    }
};