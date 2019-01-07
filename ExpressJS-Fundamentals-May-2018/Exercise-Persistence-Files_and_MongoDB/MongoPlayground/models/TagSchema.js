const mongoose = require('mongoose');

let tagSchema = new mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: true, unique: true },
    date: { type: mongoose.Schema.Types.Date, required: true, default: Date.now },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
});

tagSchema.virtual('tagName').get(function() {
    return this.name.toLowerCase();
});

let Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;