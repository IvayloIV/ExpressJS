const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageUrl: { type: mongoose.SchemaTypes.String },
    dateCreation: { type: mongoose.SchemaTypes.Date, default: Date.now },
    imageTitle: { type: mongoose.SchemaTypes.String },
    description: { type: mongoose.SchemaTypes.String },
    tags: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Tag', default: [] }]
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;