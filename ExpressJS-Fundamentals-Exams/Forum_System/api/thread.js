const Thread = require('../models/Thread');
const apiAnswer = require('./answer');

async function create(body) {
    return await Thread.create(body);
}

async function last20() {
    return await Thread.find({})
        .sort({ lastAnswerDate: -1 })
        .limit(20);
}

async function getById(id) {
    return await Thread.findById(id);
}

async function increaseViews(thread) {
    thread.views++;
    return await thread.save();
}

async function updateDate(id) {
    let thread = await getById(id);
    thread.lastAnswerDate = Date.now();
    return await thread.save();
}

async function get(take, skip) {
    return await Thread.find({})
        .sort({ lastAnswerDate: -1 })
        .skip(skip)
        .limit(take);
}

async function getCount() {
    return await Thread.count();
}

async function edit(id, body) {
    let thread = await getById(id);
    thread.title = body.title;
    thread.description = body.description;
    thread.category = body.category;

    await thread.save();
}

async function remove(id) {
    await apiAnswer.removeByThreadId(id);
    return await Thread.findByIdAndRemove(id);
}

async function getByCategoryId(id) {
    return await Thread.find({ category: id });
}

async function like(id, userId) {
    let thread = await getById(id);
    thread.likes.push(userId);
    return await thread.save();
}

async function unlike(id, userId) {
    let thread = await getById(id);
    let index = thread.likes.indexOf(userId);

    if (index === -1) {
        throw new Error('User not like this thread!');
    }

    thread.likes.splice(index, 1);
    return await thread.save();
}

async function getByCreator(id) {
    return await Thread.find({creator: id});
}

module.exports = {
    create,
    last20,
    getById,
    increaseViews,
    updateDate,
    getByCreator,
    get,
    getCount,
    edit,
    remove,
    getByCategoryId,
    like,
    unlike
};