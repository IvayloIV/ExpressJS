const apiFlight = require('../api/flight');
const apiSeat = require('../api/seat');
const apiCart = require('../api/cart');
const monthNames = ['Jan', 'Feb', 'March', 'April', 'May', 'June',
    'July', 'August', 'Sept', 'October', 'November', 'Dec'];

module.exports = {
    createGet: (req, res) => {
        res.render('flight/create');
    },
    creatPost: async (req, res) => {
        try {
            let body = req.body;
            await apiFlight.create(body);
            req.session.message = 'Created successfully!';
            res.redirect('/');
        } catch (err) {
            res.render('flight/create', { flight: req.body, message: err.message });
        }
    },
    details: async (req, res) => {
        let id = req.params.id;

        try {
            let flight = await apiFlight.getById(id);
            if (!flight.isPublic && (!req.user || req.user.roles.indexOf('Admin') === -1)) {
                req.session.message = 'Flight is not public!';
                res.redirect('/');
                return;
            }

            let date = flight.departureDate;
            flight.currentDate = `${date.getDate()} ${monthNames[date.getMonth()]}`;

            let seats = await apiSeat.getByFlightId(id);
            for (let seat of seats) {
                seat.isAdmin = req.user && req.user.roles.indexOf('Admin') > -1;
            }
            res.render('flight/details', { flight, seats });
        } catch (err) {
            console.log(err);
        }
    },
    public: async (req, res) => {
        let id = req.params.id;

        try {
            let flight = await apiFlight.publicFlight(id);
            req.session.message = 'Flight is public now!';
            res.redirect(`/flight/details/${flight._id}`);
        } catch (err) {
            console.log(err);
        }
    },
    editGet: async (req, res) => {
        let id = req.params.id;

        try {
            let flight = await apiFlight.getById(id);
            flight.currentDate = flight.departureDate.toISOString().slice(0, 10);
            res.render('flight/edit', { flight });
        } catch (err) {
            console.log(err);
        }
    },
    editPost: async (req, res) => {
        let id = req.params.id;

        try {
            await apiFlight.edit(id, req.body);
            req.session.message = 'Edited successful!';
            res.redirect(`/flight/details/${id}`);
        } catch (err) {
            req.body['_id'] = id;
            res.render('flight/edit', { flight: req.body, message: err });
        }
    },
    myFlight: async (req, res) => {
        try {
            let items = await apiCart.getAllPayed(req.user.id);
            for (let item of items) {
                let date = item.flight.departureDate;
                item.flight.currentDate = `${date.getDate()} ${monthNames[date.getMonth()]}`;
            }

            res.render('flight/myFlights', { items });
        } catch (err) {
            console.log(err);
        }
    },
    search: async (req, res) => {
        let { destination, origin, departureDate } = req.body;

        try {
            let flights = await apiFlight.search(destination, origin, departureDate);
            for (let flight of flights) {
                let date = flight.departureDate;
                flight.currentDate = `${date.getDate()} ${monthNames[date.getMonth()]}`;
            }
            res.render('home/index', { flights });
        } catch (err) {
            console.log(err);
        }
    }
};