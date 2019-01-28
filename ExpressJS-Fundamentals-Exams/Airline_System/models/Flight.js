const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    origin: { type: mongoose.Schema.Types.String, required: [true, 'Origin is required!'] },
    destination: { type: mongoose.Schema.Types.String, required: [true, 'Destination is required!'] },
    departureDate: { type: mongoose.Schema.Types.Date, required: [true, 'Departure date is required!'] },
    departureTime: { type: mongoose.Schema.Types.String, required: [true, 'Departure time is required!'] },
    imageUrl: { type: mongoose.Schema.Types.String, required: [true, 'ImageUrl is required!'] },
    isPublic: { type: mongoose.Schema.Types.Boolean, default: false }
});

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;