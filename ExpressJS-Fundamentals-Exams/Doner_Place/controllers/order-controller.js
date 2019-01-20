const User = require('../models/User');
const apiOrder = require('../api/order');
const apiProduct = require('../api/product');

module.exports = {
    orderGet: async (req, res) => {
        let id = req.params.id;

        try {
            let order = await apiProduct.getById(id);
            res.render('order/checkout', { doner: order });
        } catch (err) {
            req.session.message = err.message;
            res.redirect('/');
        }
    },
    orderPost: async (req, res) => {
        let idProduct = req.params.id;
        try {
            let product = await apiProduct.getById(idProduct);
            let order = await apiOrder.create(req.body, product, req.user.id);
            req.user.orders.push(order._id);
            await req.user.save();

            req.session.message = 'Ordered successful!';
            res.redirect(`/order/details/${order._id}`);
        } catch (err) {
            req.session.message = err;
            res.redirect('/');
        }
    },
    details: async (req, res) => {
        let idOrder = req.params.id;

        try {
            let order = await apiOrder.getById(idOrder);
            res.render('order/details', { order });
        } catch (err) {
            req.session.message = err.message;
            res.redirect('/');
        }
    },
    status: async (req, res) => {
        if (req.user.roles.indexOf('Admin') > -1) {
            res.redirect('/order/status/admin');
            return;
        }

        try {
            let user = await User.findById(req.user.id)
                .populate({
                    path: 'orders',
                    populate: {
                        path: 'product',
                        model: 'Product'
                    }
                });
            
            for (let order of user.orders) {
                order.currentDate = order.date.toLocaleString();
            }

            res.render('order/status', { orders: user.orders });
        } catch (err) {
            req.session.message = err.message;
            res.redirect('/');
        }
    },
    statusAdminGet: async (req, res) => {
        let orders = await apiOrder.getAll();
        res.render('order/status-admin', { orders });
    },
    statusAdminPost: async (req, res) => {
        try {
            let orders = await apiOrder.getAll();
            await apiOrder.saveAll(req.body, orders);
            req.session.message = 'Successful changed!';
            res.redirect('/');
        } catch (err) {
            req.session.message = err.message;
            res.redirect('/');
        }
    }
};