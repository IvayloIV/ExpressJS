let mongoose = require('mongoose');

let memeSchema = new mongoose.Schema({
    title: { type: mongoose.SchemaTypes.String, required: true },
    date: { type: mongoose.SchemaTypes.Date, default: Date.now },
    status: { type: mongoose.SchemaTypes.String },
    description: { type: mongoose.SchemaTypes.String },
    url: { type: mongoose.SchemaTypes.String },
    genre: { type: mongoose.SchemaTypes.ObjectId, ref: 'Genre'}
});

let Meme = mongoose.model('Meme', memeSchema);
module.exports = Meme;