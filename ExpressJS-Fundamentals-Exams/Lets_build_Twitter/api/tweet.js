const Tweet = require('../models/Tweet');

async function get(count) {
    let tweets = await Tweet.find({})
        .sort({ creationDate: -1 })
        .limit(count);

    return tweets;
}

async function create(body, username) {
    let message = body.message;
    let words = message.split(/[.,!?\s]+/).filter(a => a !== '');
    let tags = words.filter(a => a.startsWith('#')).map(a => a.slice(1).toLowerCase());
    let usernames = words.filter(a => a.startsWith('@')).map(a => a.slice(1));
    usernames.push(username);

    return await Tweet.create({
        message,
        tags: tags,
        connectedUsers: usernames,
        creator: username
    });
}

async function getByTag(tag) {
    let tweets = await Tweet.find({})
        .where('tags').in([tag])
        .sort({ creationDate: -1 })
        .limit(100);

    return tweets;
}

async function getByUsername(username) {
    let tweets = await Tweet.find({})
        .where('connectedUsers').in([username])
        .sort({ creationDate: -1 })
        .limit(100);

    return tweets;
}

async function getById(id) {
    let tweet = await Tweet.findById(id);
    tweet.date = tweet.creationDate.toLocaleString();
    return tweet;
}

async function increaseViewsCount(tweet) {
    tweet.viewsCount++;
    return await tweet.save();
}

async function like(tweetId, userId) {
    let tweet = await getById(tweetId);
    tweet.likes.push(userId);
    return await tweet.save();
}

async function dislike(tweetId, userId) {
    let tweet = await getById(tweetId);
    let index = tweet.likes.indexOf(userId);
    if (index === -1) {
        throw new Error('User not like this post.');
    }

    tweet.likes.splice(index, 1);
    return await tweet.save();
}

async function edit(body, id) {
    let tweet = await getById(id);
    let words = body.message.split(/[.,!?\s]+/).filter(a => a !== '');
    let tags = words.filter(a => a.startsWith('#')).map(a => a.slice(1).toLowerCase());
    let usernames = words.filter(a => a.startsWith('@')).map(a => a.slice(1));
    usernames.push(tweet.creator);

    tweet.message = body.message;
    tweet.tags = tags;
    tweet.connectedUsers = usernames;
    return await tweet.save();
}

async function remove(id) {
    return await Tweet.findByIdAndRemove(id);
}

module.exports = {
    get,
    create,
    getByTag,
    getByUsername,
    getById,
    increaseViewsCount,
    like,
    dislike,
    edit,
    remove
};