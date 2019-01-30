const User = require('../models/User');

async function allNormalUsers() {
    return await User.find({})
        .where('roles').nin(['Admin']);
}

async function allAdmins() {
    return await User.find()
        .where('roles').in(['Admin']);
}

async function createAdmin(id) {
    let user = await User.findById(id);
    user.roles.push('Admin');
    return await user.save();
}

module.exports = {
    allNormalUsers,
    createAdmin,
    allAdmins
};