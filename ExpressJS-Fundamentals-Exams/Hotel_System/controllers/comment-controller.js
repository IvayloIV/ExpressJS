const apiComment = require('../api/comment');

module.exports = {
    commentsPost: async (req, res) => {
        let hotelId = req.params.id;
        if (req.user.isBlocked && req.user.roles.indexOf('Admin') === -1) {
            req.session.message = 'You are blocked';
            res.redirect(`/hotel/details/${hotelId}`);
            return;
        }
        
        let body = req.body;
        body.hotelId = hotelId;
        body.userId = req.user.id;

        try {
            await apiComment.create(body);
            req.session.message = 'Comment created successful!';
            res.redirect(`/hotel/details/${hotelId}`);
        } catch (err) {
            console.log(err);
            req.render('/', { message: err });
        }
    },
    editGet: async (req, res) => {
        let id = req.params.id;

        try {
            let comment = await apiComment.getById(id);
            res.render('comments/edit', { comment });
        } catch (err) {
            req.session.message = err.message;
            res.redirect('/');
        }
    },
    editPost: async (req, res) => {
        let id = req.params.id;
        let body = req.body;
        body._id = id;

        try {
            let comment = await apiComment.edit(body, id);
            req.session.message = 'Edited successful!';
            res.redirect(`/hotel/details/${comment.hotel}`);
        } catch (err) {
            res.render('comments/edit', { comment: body, message: err.message });
        }
    },
    remove: async (req, res) => {
        let id = req.params.id;

        try {
            let comment = await apiComment.getById(id);
            await apiComment.removeById(id);
            req.session.message = 'Deleted successful!';
            res.redirect(`/hotel/details/${comment.hotel}`);
        } catch (err) {
            req.session.message = err.message;
            res.redirect('/');
        }
    }
};