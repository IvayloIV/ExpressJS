const Cart = require('../models/Cart');

async function buy(body) {
    return await Cart.create({
        flight: body.flight,
        seat: body.seat,
        seatsCount: Number(body.seatsCount),
        creator: body.creator
    });
}

async function getByUserId(userId) {
    return await Cart.find({ creator: userId })
        .where('isPayed').equals(false)
        .populate('flight')
        .populate('seat');
}

async function removeById(id) {
    return await Cart.findByIdAndRemove(id);
}

async function checkout(userId) {
    let items = await getByUserId(userId);
    if (items.length === 0) {
        throw new Error('You cant checkout with empty cart!');
    }

    for (let item of items) {
        item.isPayed = true;
    }

    return await Cart.create(items);
}

async function getAllPayed(userId) {
    return await Cart.find({ creator: userId })
        .where('isPayed').equals(true)
        .populate('flight')
        .populate('seat');
}

module.exports = {
    buy,
    getByUserId,
    removeById,
    checkout,
    getAllPayed
};