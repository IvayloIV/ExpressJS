const Flight = require('../models/Flight');

async function create(body) {
    return await Flight.create({
        origin: body.origin,
        destination: body.destination,
        imageUrl: body.imageUrl,
        departureDate: new Date(body.departureDate),
        departureTime: body.departureTime
    });
}

async function all() {
    return await Flight.find().sort({ departureDate: -1 });
}

async function getPublicFlights() {
    return await Flight.find()
        .where('isPublic').equals(true)
        .sort({ departureDate: -1 });
}

async function getById(id) {
    return await Flight.findById(id);
}

async function publicFlight(id) {
    let flight = await getById(id);
    flight.isPublic = true;
    return await flight.save();
}

async function edit(id, body) {
    let flight = await getById(id);
    flight.origin = body.origin;
    flight.destination = body.destination;
    flight.departureDate = new Date(body.currentDate);
    flight.departureTime = body.departureTime;
    flight.imageUrl = body.imageUrl;
    flight.isPublic = body.isPublic ? true : false;

    return await flight.save();
}

async function search(destination, origin, departureDate) {
    let obj = {};
    if (destination !== '') {
        obj['destination'] = { $regex: destination };
    }

    if (origin !== '') {
        obj['origin'] = { $regex: origin };
    }

    let flight = Flight.find(obj);

    if (departureDate !== '') {
        flight.where('departureDate').gte(new Date(departureDate));
    }

    return await flight;
}

module.exports = {
    create,
    all,
    getPublicFlights,
    getById,
    publicFlight,
    edit,
    search
};