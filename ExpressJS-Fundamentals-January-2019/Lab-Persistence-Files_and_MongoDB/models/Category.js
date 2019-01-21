const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String, required: true, unique: true },
    products: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Product'}]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;