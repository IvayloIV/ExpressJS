const Comment = require('../models/Comment');

async function getByHotelId(id) {
    return await Comment.find({ 'hotel': id })
        .sort({ 'dateCreation': -1 })
        .populate('creator');
}

async function create(body) {
    return await Comment.create({
        hotel: body.hotelId,
        creator: body.userId,
        title: body.title,
        message: body.message
    });
}

async function getByUserId(id) {
    return await Comment.find({ 'creator': id })
        .sort({ 'creationDate': -1 });
}

async function getById(id) {
    return await Comment.findById(id);
}

async function edit(body, commentId) {
    let comment = await getById(commentId);
    comment.title = body.title;
    comment.message = body.message;

    return await comment.save();
}

async function removeById(id) {
    return await Comment.findByIdAndRemove(id);
}

module.exports = {
    getByHotelId,
    create,
    getByUserId,
    getById,
    edit,
    removeById
};