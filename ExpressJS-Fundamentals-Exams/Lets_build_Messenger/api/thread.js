const Thread = require('../models/Thread');

async function getAll(userId) {
    return await Thread.find({ userCreator: userId })
        .sort({ 'dateCreation': -1 })
        .populate({
            path: 'connectedThread',
            populate: {
                path: 'userCreator',
                model: 'User'
            }
        });
}

async function getById(id) {
    return await Thread.findById(id).populate('messages');
}

async function create(userId) {
    return await Thread.create({userCreator: userId});
}

async function connect(firstThread, secondThreadId) {
    firstThread.connectedThread = secondThreadId;
    return firstThread.save();
}

async function addMessage(message, threadId) {
    let thread = await getById(threadId);
    thread.messages.push(message);
    return await thread.save();
}

async function block(id) {
    let thread = await getById(id);
    thread.isBlock = true;
    return await thread.save();
}

async function unblock(id) {
    let thread = await  getById(id);
    thread.isBlock = false;
    return await thread.save();
}

module.exports = {
    getAll,
    create,
    connect,
    getById,
    addMessage,
    block,
    unblock
};