const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
    messages: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Message', default: [] }],
    isBlock: { type: mongoose.SchemaTypes.Boolean, default: false },
    dateCreation: { type: mongoose.SchemaTypes.Date, default: Date.now },
    userCreator: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    connectedThread: { type: mongoose.SchemaTypes.ObjectId, ref: 'Thread' }
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;