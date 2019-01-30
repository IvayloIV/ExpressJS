const Hotel = require('../models/Hotel');
const Category = require('../models/Category');
const apiComment = require('../api/comment');
const apiCategory = require('../api/category');

async function create(body) {
    return await Hotel.create({
        title: body.title,
        description: body.description,
        location: body.location,
        imageUrl: body.imageUrl,
        userCreator: body.userId,
        category: body.category
    });
}

async function getAll() {
    return await Hotel.find({})
        .sort({ dateCreation: -1 });
}

async function getById(id) {
    return await Hotel.findById(id);
}

async function getByUserId(id) {
    return await Hotel.find({ userCreator: id })
        .sort({ dateCreation: -1 });
}

async function edit(body, hotelId) {
    let hotel = await getById(hotelId);
    let category = await apiCategory.getById(body.category);
    hotel.title = body.title;
    hotel.description = body.description;
    hotel.location = body.location;
    hotel.imageUrl = body.imageUrl;
    hotel.category = category.id;

    return await hotel.save();
}

async function removeById(hotelId) {
    let comments = await apiComment.getByHotelId(hotelId);
    for (let comment of comments) {
        await apiComment.removeById(comment._id);
    }

    return Hotel.findByIdAndRemove(hotelId);
}

async function get(skipped, taken) {
    return await Hotel.find({})
        .sort({ dateCreation: -1 })
        .skip(skipped)
        .limit(taken);
}

async function count() {
    return await Hotel.count();
}

async function increaseViewCount(hotelId) {
    let hotel = await getById(hotelId);
    hotel.viewsCount++;
    return await hotel.save();
}

async function like(hotelId, userId) {
    let hotel = await getById(hotelId);
    hotel.likes.push(userId);
    return await hotel.save();
}

async function dislike(hotelId, userId) {
    let hotel = await getById(hotelId);
    let index = hotel.likes.indexOf(userId);
    if (index === -1) {
        throw new Error('User not like this hotel.');
    }

    hotel.likes.splice(index, 1);
    return await hotel.save();
}

async function getByCategory(id) {
    return await Hotel.find({ category: id });
}

async function removeByCategoryId(id) {
    let hotels = await getByCategory(id);
    for (let hotel of hotels) {
        await removeById(hotel._id);
    }
    await apiCategory.removeById(id);
    return await Category.findByIdAndRemove(id);
}

module.exports = {
    create,
    getAll,
    getById,
    getByUserId,
    edit,
    removeById,
    get,
    count,
    increaseViewCount,
    like,
    dislike,
    getByCategory,
    removeByCategoryId
};