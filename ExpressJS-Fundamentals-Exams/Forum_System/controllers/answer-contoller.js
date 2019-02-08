const apiAnswer = require('../api/answer');
const apiThread = require('../api/thread');

module.exports = {
    createPost: async (req, res) => {
        const threadId = req.params.id;
        const { message } = req.body;

        if (req.user.isBlocked && req.user.roles.indexOf('Admin') === -1) {
            req.session.message = 'You are blocked!';
            res.redirect(`/thread/details/${threadId}`);
            return;
        }

        try {
            await apiAnswer.create({
                message,
                creator: req.user.id,
                thread: threadId
            });

            await apiThread.updateDate(threadId);
            res.redirect(`/thread/details/${threadId}`);
        } catch (err) {
            console.log(err);
        }
    },
    remove: async (req, res) => {
        const { answerId } = req.params;

        try {
            const answer = await apiAnswer.getById(answerId);
            const id = answer.thread.toString();
            await apiAnswer.removeById(answerId);
            req.session.message = 'Removed successful.';
            res.redirect(`/thread/details/${id}`);
        } catch (err) {
            console.log(err);
        }
    }
};