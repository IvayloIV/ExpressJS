const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String, required: true },
    dateCreation: { type: mongoose.SchemaTypes.Date, default: Date.now },
    images: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Image', default: [] }]
});

tagSchema.virtual('tagName').get(function() {
    return this.name.toLowerCase();
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;