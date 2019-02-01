const Article = require('../models/Article');

module.exports = {
    index: async (req, res) => {
        try {
            const articles = await Article.find({})
                .populate('author');
            if (req.user) {
                for (let article of articles) {
                    if (req.user.roles.indexOf('Admin') > -1 ||
                        req.user.id === article.author.id) {
                        article.rules = true;
                    }
                }
            }
            res.render('home/index', { articles });
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    }
};