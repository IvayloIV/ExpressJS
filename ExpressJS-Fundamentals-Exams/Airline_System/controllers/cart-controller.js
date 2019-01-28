const apiCart = require('../api/cart');

module.exports = {
    items: async (req, res) => {
        try {
            let items = await apiCart.getByUserId(req.user.id);
            let totalSum = 0;
            for (let item of items) {
                item.flight.currentDate = item.flight.departureDate.toLocaleDateString();
                totalSum += item.seat.price * item.seatsCount;
            }

            res.render('flight/checkout', { items, totalSum });
        } catch (err) {
            console.log(err);
        }
    },
    remove: async (req, res) => {
        let id = req.params.id;

        try {
            await apiCart.removeById(id);
            req.session.message = 'Removed successful!';
            res.redirect('/cart/items');
        } catch (err) {
            console.log(err);
        }
    },
    checkout: async (req, res) => {
        try {
            await apiCart.checkout(req.user.id);
            req.session.message = 'Checkout successfully!';
            res.redirect('/flight/my');
        } catch (err) {
            res.redirect('/cart/items', { message: err });
        }
    }
};