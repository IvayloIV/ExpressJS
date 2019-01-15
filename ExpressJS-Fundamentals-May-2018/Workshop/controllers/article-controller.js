const Article = require('mongoose').model('Article');
const User = require('mongoose').model('User');
const role = 'Admin';

module.exports = {
    createGet: (req, res) => {
        res.render('article/create');
    },
    createPost: async (req, res) => {
        let body = req.body;

        if (!body.title || !body.content) {
            res.render('article/create', { message: 'Fill inputs!', body});
            return;
        }

        try {
            let article = await Article.create({
                title: body.title,
                content: body.content,
                creator: req.user.id
            });

            req.user.articles.push(article);
            await req.user.save();

            req.session.message = 'Created successful!';
            res.redirect('/');
        } catch(e) {
            res.render('article/create', { message: e.message, body});
        }
    },
    details: async (req, res) => {
        let id = req.params.id;

        try {
            let article = await Article.findById(id);
            let isUserAuthorized = article.creator.equals(req.user.id) 
                || req.user.roles.indexOf(role) > -1;
            res.render('article/details', { article, isUserAuthorized });
        } catch(e) {
            req.session.message = e.message;
            res.redirect('/');
        }
    },
    editGet: async (req, res) => {
        let id = req.params.id;

        try {
            let article = await Article.findById(id);

            if (!article.creator.equals(req.user.id) 
                && req.user.roles.indexOf(role) === -1) {
                req.session.message = 'You are not creator!';
                res.redirect('/');
                return;
            }

            res.render('article/edit', { 
                title: article.title,
                content: article.content,
                id: article._id
            });
        } catch (e) {
            req.session.message = e.message;
            res.redirect('/');
        }
    },
    editPost: async (req, res) => {
        let id = req.params.id;
        let body = req.body;
        let title = body.title;
        let content = body.content;

        if (!title || !content) {
            res.render('article/edit', { 
                title, content, id, message: 'Fill all inputs!' 
            });
            return;
        }

        try {
            let article = await Article.findById(id);

            if (!article) {
                req.session.message = 'Article not exist!';
                res.redirect('/');
                return;
            }

            if (!article.creator.equals(req.user.id)
                && req.user.roles.indexOf(role) === -1) {
                req.session.message = 'You are not creator!';
                res.redirect('/');
                return;
            }

            article.title = title;
            article.content = content;
            await article.save();

            req.session.message = 'Edited successful!';
            res.redirect('/');
        } catch(e) {
            console.log(e);
        }
    },
    deleteGet: async (req, res) => {
        let id = req.params.id;

        try {
            let article = await Article.findById(id);

            if (!article.creator.equals(req.user.id)
                && req.user.roles.indexOf(role) === -1) {
                req.session.message = 'You are not creator!';
                res.redirect('/');
                return;
            }

            res.render('article/delete', { 
                title: article.title,
                content: article.content,
                id: article._id
            });
        } catch (e) {
            req.session.message = e.message;
            res.redirect('/');
        }
    },
    deletePost: async (req, res) => {
        let id = req.params.id;

        try {
            let article = await Article.findById(id);

            if (!article.creator.equals(req.user.id) 
                && req.user.roles.indexOf(role) === -1) {
                req.session.message = 'You are not creator!';
                res.redirect('/');
                return;
            }

            let currentUser = await User.findById(article.creator).populate('articles');
            let index = -1;
            for(let i = 0; i < currentUser.articles.length; i++) {
                let userArticle = currentUser.articles[i];
                if (article._id.equals(userArticle._id)) {
                    index = i;
                    break;
                }
            }
            currentUser.articles.splice(index, 1);
            await currentUser.save();
            await article.remove();

            req.session.message = 'Deleted successful!';
            res.redirect('/');
        } catch(e) {
            console.log(e);
        }
    }
};