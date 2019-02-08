const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    message: { type: mongoose.Schema.Types.String, required: [true, 'Message is required!'] },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
    creationDate: { type: mongoose.Schema.Types.Date, default: Date.now }
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
