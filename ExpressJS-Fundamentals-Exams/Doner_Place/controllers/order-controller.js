const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const status = {
    'Pending': (obj) => obj.isPending = true,
    'In Progress': (obj) => obj.isInProgress = true,
    'In Transit': (obj) => obj.isInTransit = true,
    'Delivered': (obj) => obj.isDelivered = true
};

module.exports = {
    orderGet: (req, res) => {
        let id = req.params.id;

        Product.findById(id).then((product) => {
            res.render('order/checkout', { doner: product });
        });
    },
    orderPost: (req, res) => {
        let productId = req.params.id;
        let body = req.body;
        console.log();

        Product.findById(productId).then((product) => {
            let toppings = [];
            for (let topping of product.toppings) {
                if (body.hasOwnProperty(topping)) {
                    toppings.push(topping);
                }
            }

            Order.create({
                creator: req.user.id,
                product: productId,
                toppings: toppings
            }).then((order) => {
                req.user.orders.push(order._id);
                req.user.save().then(() => {
                    req.session.message = 'Ordered successful!';
                    res.redirect(`/order/details/${order._id}`);
                });
            });
        });
    },
    details: (req, res) => {
        let idOrder = req.params.id;

        Order.findById(idOrder).populate('product').then((order) => {
            status[order.status](order);
            order.currentDate = order.date.toLocaleString();
            res.render('order/details', { order });
        });
    },
    status: (req, res) => {
        if (req.user.roles.indexOf('Admin') > -1) {
            res.redirect('/order/status/admin');
            return;
        }

        User.findById(req.user.id)
            .populate({
                path: 'orders',
                populate: {
                    path: 'product',
                    model: 'Product'
                }
            })
            .then((user) => {
                for (let order of user.orders) {
                    order.currentDate = order.date.toLocaleString();
                }
                res.render('order/status', { orders: user.orders });
            });
    },
    statusAdminGet: (req, res) => {
        Order.find({}).populate('product').then(orders => {
            for (let order of orders) {
                order.currentDate = order.date.toLocaleString();
                status[order.status](order);
            }

            res.render('order/status-admin', { orders });
        });
    },
    statusAdminPost: (req, res) => {
        let body = req.body;
        
        Order.find({}).then(orders => {
            for(let order of orders) {
                if (body.hasOwnProperty(order._id)) {
                    order.status = body[order._id];
                }
            }

            Order.create(orders).then(() => {
                req.session.message = 'Successful changed!';
                res.redirect('/');
            });
        });
    }
};