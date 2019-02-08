const Answer = require('../models/Answer');

async function getByThreadId(threadId) {
    return await Answer.find({ thread: threadId })
        .sort({ creationDate: -1 });
}

async function create(body) {
    return await Answer.create(body);
}

async function getByCreator(id) {
    return await Answer.find({ creator: id })
        .sort({ creationDate: -1 });
}

async function removeByThreadId(id) {
    return await Answer.deleteMany({ thread: id });
}

async function removeById(id) {
    return await Answer.findByIdAndRemove(id);
}

async function getById(id) {
    return await Answer.findById(id);
}

module.exports = {
    getByThreadId,
    create,
    getByCreator,
    removeByThreadId,
    removeById,
    getById
};