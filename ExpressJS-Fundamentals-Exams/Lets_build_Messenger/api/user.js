const User = require('../models/User');

async function getByName(userName) {
    return await User.findOne({username: userName});
}

async function getById(id) {
    return await User.findById(id);
}

module.exports = {
    getByName,
    getById
};