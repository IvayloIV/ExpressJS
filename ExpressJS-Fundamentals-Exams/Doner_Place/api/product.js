const Product = require('../models/Product');
const orderType = {
    'beef': (obj) => obj.beef = true,
    'chicken': (obj) => obj.chicken = true,
    'lamb': (obj) => obj.lamb = true
};

async function create(data) {
    let category = data.category;
    let imageUrl = data.imageUrl;
    let size = data.size;
    let toppings = data.toppings.split(',').map(a => a.trim());

    if (size === '' || isNaN(size)) {
        throw new Error('Invalid data!');
    }
    size = Number(size);
    return await Product.create({ category, imageUrl, size, toppings });
}

async function getById(id) {
    let product = await Product.findById(id);
    orderType[product.category](product);
    return product;
}

async function edit(data, currentProduct) {
    let category = data.category;
    let imageUrl = data.imageUrl;
    let size = data.size;
    let toppings = data.toppings.split(',').map(a => a.trim());

    if (!category || !imageUrl || size === '' || isNaN(size)) {
        throw new Error('Invalid data!');
    }
    size = Number(size);
    currentProduct.category = category;
    currentProduct.imageUrl = imageUrl;
    currentProduct.size = size;
    currentProduct.toppings = toppings;

    return await currentProduct.save();
}

async function remove(id) {
    return await Product.remove({ '_id': id });
}

async function getAll() {
    return await Product.find({});
}

module.exports = {
    create,
    getById,
    edit,
    remove,
    getAll
};