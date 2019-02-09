const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageUrl: { type: mongoose.Schema.Types.String, required: [true, 'ImageUrl is required!'] },
    description: { type: mongoose.Schema.Types.String, required: true },
    creationDate: { type: mongoose.Schema.Types.Date, default: Date.now },
    tags: [{ type: mongoose.Schema.Types.String }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subscribedUsers: [{ type: mongoose.Schema.Types.String }],
    viewCount: { type: mongoose.Schema.Types.Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }]
});

imageSchema.path('description').validate(function() {
    return this.description.length <= 500;
}, 'Description max length is 500 symbols.');

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
