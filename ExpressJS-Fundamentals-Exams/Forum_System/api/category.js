const Category = require('../models/Category');
const apiThread = require('./thread');

async function create(body) {
    return await Category.create(body);
}

async function all() {
    return await Category.find({});
}

async function removeById(id) {
    let threads = await apiThread.getByCategoryId(id);
    for (let thread of threads) {
        await apiThread.remove(thread._id);
    }
    return await Category.findByIdAndRemove(id);
}

async function getById(id) {
    return await Category.findById(id);
}

module.exports = {
    create,
    all,
    removeById,
    getById
};