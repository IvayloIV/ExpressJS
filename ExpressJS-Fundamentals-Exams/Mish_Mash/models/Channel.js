const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: [true, 'Name is required!'] },
    description: { type: mongoose.Schema.Types.String },
    type: { type: mongoose.Schema.Types.String, enum: ['Game', 'Motivation', 'Lessons', 'Radio', 'Other'], required: true },
    tags: [{ type: mongoose.Schema.Types.String }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;