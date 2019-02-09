const Image = require('../models/Image');

async function create(body) {
    let words = body.description.split(/[.,!?\s]/).filter(a => a !== '');
    let tags = words.filter(a => a.startsWith('#')).map(a => a.toLowerCase().substring(1));
    let handles = words.filter(a => a.startsWith('@')).map(a => a.substring(1));
    handles.push(body.username);
    body.tags = tags;
    body.subscribedUsers = handles;
    return await Image.create(body);
}

async function get100() {
    return await Image.find({})
        .sort({ creationDate: -1 })
        .limit(100);
}

async function getByTagName(name) {
    return await Image.find({})
        .where('tags').in([name])
        .limit(100);
}

async function getByUsername(username) {
    return await Image.find({})
        .where('subscribedUsers').in([username])
        .limit(100);
}

async function getById(id) {
    return await Image.findById(id);
}

async function increaseViewCount(id) {
    let image = await getById(id);
    image.viewCount++;
    return await image.save();
}

async function like(imageId, userId) {
    let image = await getById(imageId);
    if (image.likes.indexOf(userId) !== -1) {
        throw new Error('You already like this image.');
    }

    image.likes.push(userId);
    return await image.save();
}

async function dislike(imageId, userId) {
    let image = await getById(imageId);
    let index = image.likes.indexOf(userId);
    if (index === -1) {
        throw new Error('First you must like this image.');
    }

    image.likes.splice(index, 1);
    return await image.save();
}

async function edit(imageId, body) {
    const image = await Image.findById(imageId).populate('creator');
    let words = body.description.split(/[.,!?\s]/).filter(a => a !== '');
    let tags = words.filter(a => a.startsWith('#')).map(a => a.toLowerCase().substring(1));
    let handles = words.filter(a => a.startsWith('@')).map(a => a.substring(1));
    handles.push(image.creator.username);

    image.imageUrl = body.imageUrl;
    image.description = body.description;
    image.tags = tags;
    image.subscribedUsers = handles;
    return await image.save();
}

async function removeById(imageId) {
    const image = await Image.findById(imageId).populate('creator');
    let user = image.creator;
    let index = user.images.indexOf(image._id);
    user.images.splice(index, 1);
    await user.save();
    return await Image.findByIdAndRemove(imageId);
}

async function search(description) {
    let obj = {};

    if (description !== '') {
        obj['description'] = { '$regex': description };
        obj['description']['$options'] = 'i';
    }

    return await Image.find(obj);
}

module.exports = {
    create,
    get100,
    getByTagName,
    getByUsername,
    getById,
    increaseViewCount,
    like,
    dislike,
    edit,
    removeById,
    search
};