let mongoose = require('mongoose');

let genreSchema = new mongoose.Schema({
    title: { type: mongoose.SchemaTypes.String, required: true, unique: true },
    memeList: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Meme' }]
});

let Genre = mongoose.model('Genre', genreSchema);
module.exports = Genre;