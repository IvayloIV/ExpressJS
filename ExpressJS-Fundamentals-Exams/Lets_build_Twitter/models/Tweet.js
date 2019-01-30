const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    message: { type: mongoose.SchemaTypes.String, required: true, maxlength: [140, 'Max length is 140 symbols!'] },
    creationDate: { type: mongoose.SchemaTypes.Date, default: Date.now },
    tags: [{ type: mongoose.SchemaTypes.String, default: [] }],
    connectedUsers: [{ type: mongoose.SchemaTypes.String, default: [] }],
    viewsCount: { type: mongoose.SchemaTypes.Number, default: 0 },
    creator: { type: mongoose.SchemaTypes.String, required: true },
    likes: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User', default: [] }]
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;