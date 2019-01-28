const apiSeat = require('../api/seat');
const apiCart = require('../api/cart');

module.exports = {
    create: async (req, res) => {
        let flightId = req.params.id;
        let body = req.body;

        try {
            body.flight = flightId;
            await apiSeat.create(body);
            req.session.message = 'Seat created successful!';
            res.redirect(`/flight/details/${flightId}`);
        } catch (err) {
            res.redirect(`/flight/details/${flightId}`, { message: err });
        }
    },
    remove: async (req, res) => {
        let id = req.params.id;

        try {
            let seat = await apiSeat.removeById(id);
            req.session.message = 'Seat removed successful!';
            res.redirect(`/flight/details/${seat.flight}`);
        } catch (err) {
            console.log(err);
        }
    },
    buy: async (req, res) => {
        let seatId = req.params.seatId;
        let flightId = req.params.flightId;

        try {
            req.body.seat = seatId;
            req.body.flight = flightId;
            req.body.creator = req.user.id;
            await apiCart.buy(req.body);
            req.session.message = 'Added to your cart.';
            res.redirect(`/flight/details/${flightId}`);
        } catch (err) {
            console.log(err);
        }
    }
};