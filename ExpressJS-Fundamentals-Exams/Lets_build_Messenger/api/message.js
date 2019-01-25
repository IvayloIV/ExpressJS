const Message = require('../models/Message');

async function getById(id) {
    return await Message.findById(id);
}

async function getByIds(messages) {
    return await Message.find({'_id': messages});
}

async function create(message, userId) {
    return await Message.create({message, userCreator: userId});
}

async function like(messageId) {
    let message = await getById(messageId);
    message.isLiked = true;
    return await message.save();
}

async function dislike(messageId) {
    let message = await getById(messageId);
    message.isLiked = false;
    return await message.save();
}

module.exports = {
    getById,
    getByIds,
    create,
    like,
    dislike
};