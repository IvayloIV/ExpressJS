const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    title: { type: mongoose.Schema.Types.String, required: [true, 'Title is required!'] },
    description: { type: mongoose.Schema.Types.String },
    location: { type: mongoose.Schema.Types.String, require: [true, 'Location is required!'] },
    imageUrl: { type: mongoose.Schema.Types.String, require: [true, 'ImageUrl is required!'] },
    dateCreation: { type: mongoose.Schema.Types.Date, default: Date.now },
    viewsCount: { type: mongoose.Schema.Types.Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    userCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: mongoose.Schema.Types.String, required: true }
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;