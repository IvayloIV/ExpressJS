const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
    title: { type: mongoose.SchemaTypes.String, required: [true, 'Title missing!'] },
    memeSrc: { type: mongoose.SchemaTypes.String, unique: true },
    description: { type: mongoose.SchemaTypes.String },
    privacy: { type: mongoose.SchemaTypes.String, default: 'off' },
    dateStamp: { type: mongoose.SchemaTypes.Date, default: Date.now }
});

const Meme = mongoose.model('Meme', memeSchema);

module.exports = Meme;