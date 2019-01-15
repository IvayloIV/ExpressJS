const Article = require('mongoose').model('Article');

module.exports = {
    index: async (req, res) => {
        let message = req.session.message;
        req.session.message = '';

        try {
            let articles = await Article.find({})
                .sort({ date: -1 });

            if (req.user) {
                for (let article of articles) {
                    article.isOwner = article.creator.equals(req.user.id)
                        || req.user.roles.indexOf('Admin') > -1;
                }
            }

            res.render('home/index', { message, articles });
        }
        catch (e) {
            console.log(e);
        }
    }
};