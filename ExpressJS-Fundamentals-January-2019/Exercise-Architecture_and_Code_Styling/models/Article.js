const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: mongoose.SchemaTypes.String, required: true },
    content: { type: mongoose.SchemaTypes.String, required: true },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    date: { type: mongoose.SchemaTypes.Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;