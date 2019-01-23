const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: mongoose.Schema.Types.String, required: [true, 'Title is require.'] },
    isLock: { type: mongoose.Schema.Types.Boolean, default: false },
    edits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Edit', default: [] }],
    dateCreation: { type: mongoose.SchemaTypes.Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;