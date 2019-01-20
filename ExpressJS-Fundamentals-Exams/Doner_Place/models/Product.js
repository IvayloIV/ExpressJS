const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    category: { type: mongoose.SchemaTypes.String, required: [true, 'Category is required!'], unique: true },
    size: { type: mongoose.SchemaTypes.Number, required: [true, 'Size is required!'], min: 17, max: 24 },
    imageUrl: { type: mongoose.SchemaTypes.String, required: [true, 'Image is required!'] },
    toppings: [{ type: mongoose.SchemaTypes.String }]
});

let Product = mongoose.model('Product', productSchema);
module.exports = Product;