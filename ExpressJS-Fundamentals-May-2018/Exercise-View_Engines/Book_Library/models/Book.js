const mongoose = require('mongoose');

let bookSchema = new mongoose.Schema({
    title: { type: mongoose.SchemaTypes.String, required: true },
    image: { type: mongoose.SchemaTypes.String, required: true },
    year: { type: mongoose.SchemaTypes.Number },
    author: { type: mongoose.SchemaTypes.String }
});

let Book = mongoose.model('Book', bookSchema);

module.exports = Book;