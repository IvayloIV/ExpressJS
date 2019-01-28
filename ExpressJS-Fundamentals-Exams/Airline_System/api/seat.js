const Seat = require('../models/Seat');

async function create(body) {
    return await Seat.create({
        price: Number(body.price),
        type: body.type,
        ticketsCount: Number(body.quantity),
        flight: body.flight
    });
}

async function getByFlightId(id) {
    return await Seat.find({ flight: id });
}

async function removeById(id) {
    return await Seat.findByIdAndRemove(id);
}

module.exports = {
    create,
    getByFlightId,
    removeById
};