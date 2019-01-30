const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    creationDate: { type: mongoose.Schema.Types.Date, default: Date.now },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: mongoose.Schema.Types.String, required: [true, 'Message is required!'] },
    title: { type: mongoose.Schema.Types.String, required: [true, 'Title is required!'] }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;