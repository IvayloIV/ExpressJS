const apiThread = require('../api/thread');
const apiCategory = require('../api/category');
const apiAnswer = require('../api/answer');
const threadPerPage = 3;

module.exports = {
    createGet: async (req, res) => {
        if (req.user.isBlocked && req.user.roles.indexOf('Admin') === -1) {
            req.session.message = 'You are blocked!';
            res.redirect('/');
            return;
        }

        try {
            const categories = await apiCategory.all();
            res.render('thread/create', { categories });
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    },
    createPost: async (req, res) => {
        const thread = req.body;

        if (req.user.isBlocked && req.user.roles.indexOf('Admin') === -1) {
            req.session.message = 'You are blocked!';
            res.redirect('/');
            return;
        }

        try {
            await apiThread.create({
                title: thread.title,
                description: thread.description,
                description: thread.description,
                category: thread.category,
                creator: req.user._id
            });
            req.session.message = 'Created successful';
            res.redirect('/');
        } catch (err) {
            console.log(err);
            const categories = await apiCategory.all();
            res.render('thread/create', { thread, message: err.message, categories });
        }
    },
    details: async (req, res) => {
        const id = req.params.id;

        try {
            const thread = await apiThread.getById(id);
            await apiThread.increaseViews(thread);
            const answers = await apiAnswer.getByThreadId(id);
            const isBlocked = req.user && req.user.isBlocked && req.user.roles.indexOf('Admin') === -1;
            const isLiked = req.user && thread.likes.indexOf(req.user.id) > -1;
            thread.likesCount = thread.likes.length;
            res.render('thread/details', { thread, answers, isBlocked, isLiked });
        } catch (err) {
            console.log(err);
        }
    },
    list: async (req, res) => {
        const query = req.query;

        try {
            const threadCount = await apiThread.getCount();
            const totalsPage = Math.ceil(threadCount / threadPerPage);
            let page = 1;
            if (query.page) {
                page = Number(query.page);
            }

            let skipped = (page - 1) * threadPerPage;

            let next = page + 1;
            let prev = page - 1;

            if (page === 1) {
                prev = undefined;
            }

            if (page >= totalsPage) {
                next = undefined;
            }

            const threads = await apiThread.get(threadPerPage, skipped);

            res.render('thread/list', { threads, next, prev });
        } catch (err) {
            console.log(err);
        }
    },
    editGet: async (req, res) => {
        const id = req.params.id;

        try {
            const thread = await apiThread.getById(id);
            const categories = await apiCategory.all();
            res.render('thread/edit', { thread, categories });
        } catch (err) {
            console.log(err);
        }
    },
    editPost: async (req, res) => {
        const id = req.params.id;
        const body = req.body;

        try {
            await apiThread.edit(id, body);
            req.session.message = 'Edited successful.';
            res.redirect(`/thread/details/${id}`);
        } catch (err) {
            req.session.message = err.message;
            res.redirect(`/thread/edit/${id}`);
        }
    },
    delete: async (req, res) => {
        const id = req.params.id;

        try {
            await apiThread.remove(id);
            req.session.message = 'Deleted successful.';
            res.redirect('/');
        } catch (err) {
            console.log(err);
        }
    },
    like: async (req, res) => {
        const id = req.params.id;

        try {
            await apiThread.like(id, req.user.id);
            req.session.message = 'You like this thread.';
            res.redirect(`/thread/details/${id}`);
        } catch (err) {
            req.session.message = err;
            res.redirect('/');
        }
    },
    unlike: async (req, res) => {
        const id = req.params.id;

        try {
            await apiThread.unlike(id, req.user.id);
            req.session.message = 'You dislike this thread.';
            res.redirect(`/thread/details/${id}`);
        } catch (err) {
            req.session.message = err;
            res.redirect('/');
        }
    },
    getByCategory: async (req, res) => {
        const id = req.params.id;

        try {
            const category = await apiCategory.getById(id);
            const threads = await apiThread.getByCategoryId(id);
            res.render('thread/category', { threads, name: category.name });
        } catch (err) {
            req.session.message = err;
            res.redirect('/');
        }
    }
};