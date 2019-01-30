const apiTweet = require('../api/tweet');

module.exports = {
    index: async (req, res) => {
        try {
            const tweets = await apiTweet.get(100);
            for (let tweet of tweets) {
                tweet.date = tweet.creationDate.toLocaleString();
                tweet.likesCount = tweet.likes.length;
                if (req.user && tweet.likes.indexOf(req.user.id) > -1) {
                    tweet.isLiked = true;
                }
            }
            res.render('home/index', { tweets });
        }
        catch (e) {
            console.log(e);
        }
    }
};