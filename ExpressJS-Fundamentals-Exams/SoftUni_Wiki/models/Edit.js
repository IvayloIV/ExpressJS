const mongoose = require('mongoose');

const editSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateCreation: { type: mongoose.Schema.Types.Date, default: Date.now },
    content: { type: mongoose.Schema.Types.String },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true }
});

const Edit = mongoose.model('Edit', editSchema);

module.exports = Edit;