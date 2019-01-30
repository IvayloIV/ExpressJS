const apiHotel = require('../api/hotel');
const apiComment = require('../api/comment');
const apiCategory = require('../api/category');
const hotelsPerPage = 2;

module.exports = {
    createGet: async (req, res) => {
        if (req.user.isBlocked && req.user.roles.indexOf('Admin') === -1) {
            req.session.message = 'You are blocked';
            res.redirect('/');
            return;
        }
        try {
            const categories = await apiCategory.getAll();
            res.render('hotels/generateHotel', { categories });
        } catch (err) {
            console.log(err);
        }
    },
    createPost: async (req, res) => {
        if (req.user.isBlocked && req.user.roles.indexOf('Admin') === -1) {
            req.session.message = 'You are blocked';
            res.redirect('/');
            return;
        }

        let body = req.body;
        body.userId = req.user.id;

        try {
            await apiHotel.create(body);
            req.session.message = 'Created successful';
            res.redirect('/');
        } catch (err) {
            const categories = await apiCategory.getAll();
            res.render('hotels/generateHotel', {
                hotel: body, 
                message: 
                err,
                categories
            });
        }
    },
    all: async (req, res) => {
        let pageNumber = Number(req.params.page);

        try {
            let pages = {};
            let totalCountHotels = await apiHotel.count();
            if (pageNumber < 1 || pageNumber > Math.ceil(totalCountHotels / hotelsPerPage)) {
                req.session.message = 'Page not exist!';
                res.redirect('/');
                return;
            }

            let skippedHotels = (pageNumber - 1) * hotelsPerPage;
            if (pageNumber !== 1) {
                pages['prevPage'] = pageNumber - 1;
            }

            if (totalCountHotels > skippedHotels + hotelsPerPage) {
                pages['nextPage'] = pageNumber + 1;
            }

            let hotels = await apiHotel.get(skippedHotels, hotelsPerPage);
            if (req.user) {
                for (let hotel of hotels) {
                    if (hotel.likes.indexOf(req.user.id) > -1) {
                        hotel.isLiked = true;
                    }
                }
            }
            res.render('hotels/hotelList', { hotels, pages });
        } catch (err) {
            console.log(err);
        }
    },
    details: async (req, res) => {
        let id = req.params.id;

        try {
            let hotel = await apiHotel.increaseViewCount(id);
            let comments = await apiComment.getByHotelId(id);
            for (let comment of comments) {
                comment.date = comment.creationDate.toLocaleString();
            }
            if (req.user && hotel.likes.indexOf(req.user.id) > -1) {
                hotel.isLiked = true;
            }
            res.render('hotels/details', { selectedHotel: hotel, comments });
        } catch (err) {
            console.log(err);
        }
    },
    editGet: async (req, res) => {
        let id = req.params.id;

        try {
            let hotel = await apiHotel.getById(id);
            let categories = await apiCategory.getAll();
            for (let category of categories) {
                if (category.id === hotel.category) {
                    category.current = true;
                }
            }
            res.render('hotels/edit', { hotel, categories });
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
            await apiHotel.edit(body, id);
            req.session.message = 'Edited hotel successful!';
            res.redirect(`/hotel/details/${id}`);
        } catch (err) {
            let categories = await apiCategory.getAll();
            for (let category of categories) {
                if (category.id === body.category) {
                    category.current = true;
                }
            }
            res.render('hotels/edit', {
                hotel: body,
                message: err.message,
                categories
            });
        }
    },
    remove: async (req, res) => {
        let id = req.params.id;

        try {
            await apiHotel.removeById(id);
            req.session.message = 'Deleted hotel successful!';
            res.redirect('/');
        } catch (err) {
            req.session.message = err.message;
            res.redirect('/');
        }
    },
    like: async (req, res) => {
        let hotelId = req.params.id;

        try {
            await apiHotel.like(hotelId, req.user.id);
            req.session.message = 'Liked successful!';
            res.redirect(`/hotel/details/${hotelId}`);
        } catch (err) {
            console.log(err);
        }
    },
    dislike: async (req, res) => {
        let hotelId = req.params.id;

        try {
            await apiHotel.dislike(hotelId, req.user.id);
            req.session.message = 'Disliked successful!';
            res.redirect(`/hotel/details/${hotelId}`);
        } catch (err) {
            console.log(err);
        }
    }
};