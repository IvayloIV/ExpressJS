const apiTweet = require('../api/tweet');

module.exports = {
    createGet: (req, res) => {
        res.render('tweet/create');
    },
    createPost: async (req, res) => {
        let body = req.body;

        try {
            await apiTweet.create(body, req.user.username);
            req.session.message = 'Created successfully.';
            res.redirect('/');
        } catch (err) {
            res.render('tweet/create', {
                currentMessage: body.message,
                message: err.message
            });
        }
    },
    getByTag: async (req, res) => {
        let name = req.params.name;

        try {
            const tweets = await apiTweet.getByTag(name, req.user.id);
            for (let tweet of tweets) {
                tweet.date = tweet.creationDate.toLocaleString();
                tweet.likesCount = tweet.likes.length;
                if (req.user && tweet.likes.indexOf(req.user.id) > -1) {
                    tweet.isLiked = true;
                }
            }
            res.render('tweet/tag', { tweets, name });
        } catch (err) {
            console.log(err);
        }
    },
    details: async (req, res) => {
        let id = req.params.id;

        try {
            const tweet = await apiTweet.getById(id);
            apiTweet.increaseViewsCount(tweet);
            if (req.user) {
                tweet.isLiked = tweet.likes.indexOf(req.user.id) > -1;
            }
            tweet.likesCount = tweet.likes.length;
            res.render('tweet/details', { tweet });
        } catch (err) {
            console.log(err);
        }
    },
    like: async (req, res) => {
        let id = req.params.id;

        try {
            await apiTweet.like(id, req.user.id);
            res.redirect(`/tweet/details/${id}`);
        } catch (err) {
            console.log(err);
        }
    },
    dislike: async (req, res) => {
        let id = req.params.id;

        try {
            await apiTweet.dislike(id, req.user.id);
            res.redirect(`/tweet/details/${id}`);
        } catch (err) {
            console.log(err);
        }
    },
    editGet: async (req, res) => {
        let id = req.params.id;

        try {
            const tweet = await apiTweet.getById(id);
            res.render('tweet/edit', { tweet });
        } catch (err) {
            console.log(err);
        }
    },
    editPost: async (req, res) => {
        let id = req.params.id;
        let body = req.body;

        try {
            await apiTweet.edit(body, id);
            req.session.message = 'Edited successful';
            res.redirect(`/tweet/details/${id}`);
        } catch (err) {
            const tweet = await apiTweet.getById(id);
            res.render('tweet/edit', { tweet, message: err.message });
        }
    },
    remove: async (req, res) => {
        let id = req.params.id;

        try {
            await apiTweet.remove(id);
            req.session.message = 'Tweet deleted successful!';
            res.redirect('/');
        } catch (err) {
            console.log(err);
        }
    }
};