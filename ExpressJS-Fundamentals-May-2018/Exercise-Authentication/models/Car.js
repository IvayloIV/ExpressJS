const mongoose = require('mongoose');

let carSchema = new mongoose.Schema({
    make: { type: mongoose.SchemaTypes.String },
    model: { type: mongoose.SchemaTypes.String, required: true },
    color: { type: mongoose.SchemaTypes.String },
    imageUrl: { type: mongoose.SchemaTypes.String, required: true },
    renter: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' }
});

let Car = mongoose.model('Car', carSchema);
module.exports = Car;