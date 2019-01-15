const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: mongoose.Schema.Types.String, required: true },
    content: { type: mongoose.Schema.Types.String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true },
    date: { type: mongoose.Schema.Types.Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;