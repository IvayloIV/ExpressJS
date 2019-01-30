const Category = require('../models/Category');

async function add(body) {
    return await Category.create({
        name: body.name
    });
}

async function getAll() {
    return await Category.find({});
}

async function getById(id) {
    return await Category.findById(id);
}

async function removeById(id) {
    return await Category.findByIdAndRemove(id);
}

module.exports = {
    add,
    getAll,
    getById,
    removeById
};