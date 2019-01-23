const articleApi = require('../api/article');
const editApi = require('../api/edit');

module.exports = {
    createGet: (req, res) => {
        let message = req.session.message;
        req.session.message = '';
        res.render('article/create', { message });
    },
    createPost: async (req, res) => {
        let body = req.body;
        body.authorId = req.user.id;
        try {
            await articleApi.create(body);
            req.session.message = 'Successful created!';
            res.redirect('/');
        } catch (err) {
            res.render('article/create', { message: err, article: body });
        }
    },
    viewAll: async (req, res) => {
        try {
            const articles = await articleApi.all();
            res.render('article/viewAll', { articles });
        } catch (err) {
            console.log(err);
        }
    },
    details: async (req, res) => {
        try {
            let idArticle = req.params.id;
            const article = await articleApi.getById(idArticle);
            let lastEdit = article.edits.sort((a, b) => b['dateCreation'] - a['dateCreation'])[0];
            let paragraphs = lastEdit.content.split('\n');
            let isLock = article.isLock;
            if (req.user && req.user.roles.indexOf('Admin') > -1) {
                isLock = false;
            }

            res.render('article/details', {
                title: article['title'],
                paragraphs,
                isLock: isLock,
                _id: article._id
            });
        } catch (err) {
            console.log(err);
        }
    },
    editGet: async (req, res) => {
        try {
            let message = req.session.message;
            req.session.message = '';
            let id = req.params.id;
            const article = await articleApi.getById(id);
            if (article.isLock && req.user.roles.indexOf('Admin') === -1) {
                req.session.message = 'Article is locked!';
                res.redirect('/');
                return;
            }

            let lastEdit = article.edits.sort((a, b) => b['dateCreation'] - a['dateCreation'])[0];
            res.render('article/edit', {
                '_id': article._id,
                'title': article.title,
                'content': lastEdit.content,
                'isLock': article.isLock,
                message
            });
        } catch (err) {
            req.session.message = err;
            res.redirect('/');
        }
    },
    editPost: async (req, res) => {
        let idArticle = req.params.id;
        let body = req.body;

        try {
            let article = await articleApi.getById(idArticle);
            if (article.isLock && req.user.roles.indexOf('Admin') === -1) {
                req.session.message = 'Article is locked!';
                res.redirect('/');
                return;
            }
            let edit = await editApi.create(body.content, idArticle, req.user.id);
            await articleApi.addEdit(edit._id, article);
            req.session.message = 'Successful edited.';
            res.redirect('/');
        } catch (err) {
            res.render('views/edit', body);
        }
    },
    history: async (req, res) => {
        let articleId = req.params.id;
        try {
            let edits = await editApi.getByArticleId(articleId);
            res.render('article/history', { edits });
        } catch (err) {
            console.log(err);
        }
    },
    lock: async (req, res) => {
        try {
            let idArticle = req.params.id;
            let article = await articleApi.getById(idArticle);
            await articleApi.lock(article);
            req.session.message = 'Article locked successful.';
            res.redirect(`/article/edit/${idArticle}`);
        } catch (err) {
            console.log(err);
        }
    },
    unlock: async (req, res) => {
        try {
            let idArticle = req.params.id;
            let article = await articleApi.getById(idArticle);
            await articleApi.unlock(article);
            req.session.message = 'Article unlocked successful.';
            res.redirect(`/article/edit/${idArticle}`);
        } catch (err) {
            console.log(err);
        }
    },
    getLast: async (req, res) => {
        try {
            let articles = await articleApi.all();
            articles = articles.sort((a, b) => a['dateCreation'] - b['dateCreation']);
            if (articles.length === 0) {
                req.session.message = 'Articles missing.';
                res.redirect('/');
                return;
            }
            let lastArticle = articles[0];
            res.redirect(`/article/details/${lastArticle._id}`);
        } catch (err) {
            console.log(err);
        }
    },
    search: async (req, res) => {
        try {
            const input = req.body.title;
            let articles = await articleApi.all();
            articles = articles.filter(a => a.title.indexOf(input) !== -1);
            res.render('article/search', {articles, input});
        } catch (err) {
            console.log(err);
        }
    }
};