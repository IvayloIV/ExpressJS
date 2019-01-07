let mongoose = require('mongoose');

let imageSchema = new mongoose.Schema({
    URL: { type: mongoose.Schema.Types.String, require: true },
    title: { type: mongoose.Schema.Types.String, require: true },
    description: { type: mongoose.Schema.Types.String },
    date: { type: mongoose.Schema.Types.Date, default: Date.now },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
});

let Image = mongoose.model('Image', imageSchema);

module.exports = Image;