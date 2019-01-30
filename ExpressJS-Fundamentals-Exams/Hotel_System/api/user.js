const User = require('../models/User');

async function allNotAdmin() {
    let users = await User.find({});
    return users.filter(a => a.roles.indexOf('Admin') === -1);
}

async function getById(id) {
    return await User.findById(id);
}

async function createAdminById(id) {
    let user = await getById(id);
    user.roles.push('Admin');
    return await user.save();
}

async function block(id) {
    let user = await getById(id);
    user.isBlocked = true;
    return await user.save();
}

async function unblock(id) {
    let user = await getById(id);
    user.isBlocked = false;
    return await user.save();
}

module.exports = {
    allNotAdmin,
    getById,
    createAdminById,
    block,
    unblock
};