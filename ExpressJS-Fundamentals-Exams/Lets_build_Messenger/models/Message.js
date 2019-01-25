const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userCreator: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    message: { type: mongoose.SchemaTypes.String, require: true },
    isLiked: { type: mongoose.SchemaTypes.Boolean, default: false },
    dateCreation: { type: mongoose.SchemaTypes.Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;