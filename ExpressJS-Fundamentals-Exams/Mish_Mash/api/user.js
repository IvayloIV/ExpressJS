const User = require('../models/User');

async function getById(id) {
    return await User.findById(id).populate('followedChannels');
}

async function addChannel(user, idChannel) {
    user.followedChannels.push(idChannel);
    await user.save();
}

async function removeChannel(user, idChannel) {
    let index = user.followedChannels.indexOf(idChannel);
    user.followedChannels.splice(index, 1);
    return user.save();
}

module.exports =  {
    getById,
    addChannel,
    removeChannel
};