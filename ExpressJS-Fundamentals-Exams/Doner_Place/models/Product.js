const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    category: { type: mongoose.SchemaTypes.String, required: true, unique: true },
    size: { type: mongoose.SchemaTypes.Number, required: true, min: 17, max: 24 },
    imageUrl: { type: mongoose.SchemaTypes.String, required: true },
    toppings: [{ type: mongoose.SchemaTypes.String }]
});

let Product = mongoose.model('Product', productSchema);
module.exports = Product;