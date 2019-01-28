const apiFlight = require('../api/flight');
const monthNames = ['Jan', 'Feb', 'March', 'April', 'May', 'June',
    'July', 'August', 'Sept', 'October', 'November', 'Dec'];

module.exports = {
    index: async (req, res) => {
        try {
            let flights;
            if (!req.isAuthenticated() || req.user.roles.indexOf('Admin') === -1) {
                flights = await apiFlight.getPublicFlights();
            } else {
                flights = await apiFlight.all();
            }

            for (let flight of flights) {
                let date = flight.departureDate;
                flight.currentDate = `${date.getDate()} ${monthNames[date.getMonth()]}`;
            }

            res.render('home/index', { flights });
        }
        catch (e) {
            console.log(e);
        }
    }
};