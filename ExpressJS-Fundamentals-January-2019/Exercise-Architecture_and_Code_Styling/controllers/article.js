const Article = require('../models/Article');

module.exports = {
    createGet: (req, res) => {
        res.render('article/create');
    },
    createPost: async (req, res) => {
        const body = req.body;

        try {
            const article = await Article.create({
                title: body.title,
                content: body.content,
                author: req.user.id
            });

            req.user.articles.push(article._id);
            await req.user.save();

            res.redirect('/');
        } catch (error) {
            body.error = error.message;
            res.render('article/create', body);
        }
    },
    details: async (req, res) => {
        const id = req.params.id;

        try {
            const article = await Article.findById(id)
                .populate('author');
            if (req.user) {
                if (req.user.roles.indexOf('Admin') > -1 ||
                    req.user.id === article.author.id) {
                    article.rules = true;
                }
            }
            article.creationDate = article.date.toLocaleString();
            res.render('article/details', article);
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    },
    editGet: async (req, res) => {
        const id = req.params.id;

        if (req.user.roles.indexOf('Admin') === -1 &&
            req.user.articles.indexOf(id) === -1) {
            res.redirect('/');
            return;
        }

        try {
            const article = await Article.findById(id);
            res.render('article/edit', article);
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    },
    editPost: async (req, res) => {
        const id = req.params.id;
        const body = req.body;

        if (req.user.roles.indexOf('Admin') === -1 &&
            req.user.articles.indexOf(id) === -1) {
            res.redirect('/');
            return;
        }

        try {
            const article = await Article.findById(id);
            article.title = body.title;
            article.content = body.content;
            await article.save();
            res.redirect(`/article/details/${id}`);
        } catch (err) {
            body.error = err.message;
            body._id = id;
            res.render('article/edit', body);
        }
    },
    deleteGet: async (req, res) => {
        const id = req.params.id;

        if (req.user.roles.indexOf('Admin') === -1 &&
            req.user.articles.indexOf(id) === -1) {
            res.redirect('/');
            return;
        }

        try {
            const article = await Article.findById(id);
            res.render('article/delete', article);
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    },
    deletePost: async (req, res) => {
        const id = req.params.id;

        if (req.user.roles.indexOf('Admin') === -1 &&
            req.user.articles.indexOf(id) === -1) {
            res.redirect('/');
            return;
        }

        try {
            let article = await Article.findById(id)
                .populate('author');

            let author = article.author;
            const index = author.articles.indexOf(id);
            if (index === -1) {
                throw new Error('Article not exist!');
            }

            author.articles.splice(index, 1);
            await author.save();
            await Article.findByIdAndRemove(id);
            res.redirect('/');
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    }
};