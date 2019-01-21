const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String, required: true },
    description: { type: mongoose.SchemaTypes.String },
    price: {
        type: mongoose.SchemaTypes.Number,
        min: 0,
        max: Number.MAX_VALUE,
        default: 0
    },
    image: { type: mongoose.SchemaTypes.String },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
    isBought: { type: mongoose.SchemaTypes.Boolean, default: false }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;