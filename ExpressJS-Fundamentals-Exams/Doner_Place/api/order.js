const Order = require('../models/Order');

const status = {
    'Pending': (obj) => obj.isPending = true,
    'In Progress': (obj) => obj.isInProgress = true,
    'In Transit': (obj) => obj.isInTransit = true,
    'Delivered': (obj) => obj.isDelivered = true
};

async function getById(id) {
    let order = await Order.findById(id).populate('product');
    status[order.status](order);
    order.currentDate = order.date.toLocaleString();
    return order;
}

async function create(data, product, userId) {
    let toppings = [];
    for (let topping of product.toppings) {
        if (data.hasOwnProperty(topping)) {
            toppings.push(topping);
        }
    }

    return await Order.create({
        creator: userId,
        product: product._id,
        toppings: toppings
    });
}

async function getAll() {
    let orders = await Order.find({}).populate('product');
    for (let order of orders) {
        order.currentDate = order.date.toLocaleString();
        status[order.status](order);
    }
    return orders;
}

async function saveAll(data, orders) {
    for (let order of orders) {
        if (data.hasOwnProperty(order._id)) {
            order.status = data[order._id];
        }
    }

    return await Order.create(orders);
}

module.exports = {
    getById,
    create,
    getAll,
    saveAll
};