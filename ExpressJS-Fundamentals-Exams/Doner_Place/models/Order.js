const mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    product: { type: mongoose.SchemaTypes.ObjectId, ref: 'Product' },
    date: { type: mongoose.SchemaTypes.Date, default: Date.now },
    toppings: [{ type: mongoose.SchemaTypes.String }],
    status: { type: mongoose.SchemaTypes.String, default: 'Pending' }
});

let Order = mongoose.model('Order', orderSchema);
module.exports = Order;