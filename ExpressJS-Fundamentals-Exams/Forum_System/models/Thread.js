const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
    title: { type: mongoose.Schema.Types.String, required: [true, 'Title is required!'] },
    description: { type: mongoose.Schema.Types.String, required: [true, 'Description is required!'] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', require: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    lastAnswerDate: { type: mongoose.Schema.Types.Date },
    views: { type: mongoose.Schema.Types.Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;
