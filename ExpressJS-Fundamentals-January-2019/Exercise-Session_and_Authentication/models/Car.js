const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    model: { type: mongoose.Schema.Types.String, required: true },
    imageUrl: { type: mongoose.Schema.Types.String, required: true },
    pricePerDay: { type: mongoose.Schema.Types.Number, required: true },
    isRented: { type: mongoose.Schema.Types.Boolean, required: true, default: false }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;