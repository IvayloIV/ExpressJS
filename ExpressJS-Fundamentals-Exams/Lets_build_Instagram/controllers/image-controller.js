const apiImage = require('../api/image');
const apiUser = require('../api/user');

module.exports = {
    createGet: (req, res) => {
        res.render('image/create');
    },
    createPost: async (req, res) => {
        const body = req.body;

        try {
            const image = await apiImage.create({
                imageUrl: body.imageUrl,
                description: body.description,
                creator: req.user._id,
                username: req.user.username
            });
            await apiUser.addNewImageInfo(req.user, image._id);
            req.session.message = 'Successful created!';
            res.redirect('/');
        } catch (err) {
            body.message = err;
            res.render('image/create', body);
        }
    },
    viewByTag: async (req, res) => {
        const tagName = req.params.name;

        try {
            const images = await apiImage.getByTagName(tagName);
            res.render('image/byTag', { images, name: tagName });
        } catch (err) {
            console.log(err);
        }
    },
    details: async (req, res) => {
        const id = req.params.id;

        try {
            const image = await apiImage.increaseViewCount(id);
            image.likesCount = image.likes.length,
                image.isLiked = req.user && image.likes.indexOf(req.user._id) > -1;
            res.render('image/details', { image });
        } catch (err) {
            console.log(err);
        }
    },
    like: async (req, res) => {
        const imageId = req.params.id;
        const userId = req.user.id;

        try {
            await apiImage.like(imageId, userId);
            req.session.message = 'Like successful.';
            res.redirect(`/image/details/${imageId}`);
        } catch (err) {
            req.session.message = err.message;
            res.redirect(`/image/details/${imageId}`);
        }
    },
    dislike: async (req, res) => {
        const imageId = req.params.id;
        const userId = req.user.id;

        try {
            await apiImage.dislike(imageId, userId);
            req.session.message = 'Dislike successful.';
            res.redirect(`/image/details/${imageId}`);
        } catch (err) {
            req.session.message = err.message;
            res.redirect(`/image/details/${imageId}`);
        }
    },
    editGet: async (req, res) => {
        const id = req.params.id;

        try {
            const image = await apiImage.getById(id);
            res.render('image/edit', { image });
        } catch (err) {
            console.log(err);
        }
    },
    editPost: async (req, res) => {
        const id = req.params.id;
        const body = req.body;

        try {
            await apiImage.edit(id, body);
            req.session.message = 'Updated successful.';
            res.redirect(`/image/details/${id}`);
        } catch (err) {
            req.session.message = err.message;
            body._id = id;
            res.render('image/edit', { image: body });
        }
    },
    remove: async (req, res) => {
        const id = req.params.id;

        try {
            await apiImage.removeById(id);
            req.session.message = 'Image removed successful.';
            res.redirect('/');
        } catch (err) {
            console.log(err);
        }
    },
    search: async (req, res) => {
        const { description } = req.query;

        try {
            const images = await apiImage.search(description);
            res.render('home/index', { images, description });
        } catch (err) {
            console.log(err);
        }
    }
};