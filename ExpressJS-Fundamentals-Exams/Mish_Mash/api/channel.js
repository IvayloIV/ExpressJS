const Channel = require('../models/Channel');

async function create(body) {
    let name = body.name;
    let description = body.description;
    let type = body.type;
    let tags = body.tags.split(',').map(a => a.trim()).filter(a => a !== '');

    return await Channel.create({name, description, type, tags});
}

async function all() {
    return await Channel.find();
}

async function getById(id) {
    return await Channel.findById(id);
}

async function addFollower(articleId, userId) {
    let channel = await getById(articleId);
    channel.followers.push(userId);
    return await channel.save();
}

async function removeFollower(articleId, userId) {
    let channel = await getById(articleId);
    let index = channel.followers.indexOf(userId);
    channel.followers.splice(index, 1);
    return await channel.save();
}

module.exports = {
    create,
    all,
    getById,
    addFollower,
    removeFollower
};