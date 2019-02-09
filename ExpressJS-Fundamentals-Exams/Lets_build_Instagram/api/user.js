const User = require('../models/User');

async function addNewImageInfo(user, imageId) {
    user.images.push(imageId);
    return await user.save();
}

async function getById(id) {
    return await User.findById(id); 
}

async function createAdmin(id) {
    const user = await getById(id);
    user.roles.push('Admin');
    return await user.save();
}

module.exports = {
    addNewImageInfo,
    getById,
    createAdmin
};