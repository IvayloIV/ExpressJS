const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    price: { type: mongoose.Schema.Types.Number, required: [true, 'Price is required!'] },
    type: { type: mongoose.Schema.Types.String, required: [true, 'Type is required!'] },
    ticketsCount: { type: mongoose.Schema.Types.Number, required: [true, 'Tickets count is required!'] },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' }
});

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;