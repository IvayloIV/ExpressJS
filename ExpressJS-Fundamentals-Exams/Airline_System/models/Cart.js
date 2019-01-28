const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    seat: { type: mongoose.Schema.Types.ObjectId, ref: 'Seat' },
    seatsCount: { type: mongoose.Schema.Types.Number, required: [true, 'Seats count is required!'] },
    isPayed: { type: mongoose.Schema.Types.Boolean, default: false },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;