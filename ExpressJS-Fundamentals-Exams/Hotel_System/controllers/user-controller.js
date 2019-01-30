const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const apiHotel = require('../api/hotel');
const apiComment = require('../api/comment');
const apiUser = require('../api/user');

module.exports = {
    loginRegister: (req, res) => {
        res.render('users/loginRegister');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;
        const salt = encryption.generateSalt();
        const hashedPass =
            encryption.generateHashedPassword(salt, reqUser.password);

        try {
            const user = await User.create({
                username: reqUser.username,
                hashedPass,
                salt,
                firstName: reqUser.firstName,
                lastName: reqUser.lastName
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.render('users/loginRegister', { user: reqUser, message: err });
                } else {
                    req.session.message = 'Successful register!';
                    res.redirect('/');
                }
            });
        } catch (e) {
            res.render('users/loginRegister', { user: reqUser, message: e.message });
        }
    },
    logout: (req, res) => {
        req.logout();
        req.session.message = 'Successful logout!';
        res.redirect('/');
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;
        try {
            const user = await User.findOne({ username: reqUser.username });
            if (!user) {
                errorHandler('Invalid user data');
                return;
            }
            if (!user.authenticate(reqUser.password)) {
                errorHandler('Invalid user data');
                return;
            }
            req.logIn(user, (err, user) => {
                if (err) {
                    errorHandler(err);
                } else {
                    req.session.message = 'Successful login!';
                    res.redirect('/');
                }
            });
        } catch (e) {
            errorHandler(e);
        }

        function errorHandler(error) {
            res.render('users/loginRegister', { user: reqUser, message: error });
        }
    },
    profile: async (req, res) => {
        try {
            let hotels = await apiHotel.getByUserId(req.user.id);
            let comments = await apiComment.getByUserId(req.user.id);
            for (let comment of comments) {
                comment.date = comment.creationDate.toLocaleString();
            }
            res.render('users/profile', { hotels, comments });
        } catch (err) {
            console.log(err);
        }
    },
    all: async (req, res) => {
        try {
            let users = await apiUser.allNotAdmin();
            res.render('users/all', { users });
        } catch (err) {
            console.log(err);
        }
    },
    createAdmin: async (req, res) => {
        let id = req.params.id;

        try {
            await apiUser.createAdminById(id);
            req.session.message = 'Successful created new Admin!';
            res.redirect('/user/all');
        } catch (err) {
            req.session.message = err.message;
            res.redirect('/');
        }
    },
    block: async (req, res) => {
        let id = req.params.id;

        try {
            await apiUser.block(id);
            req.session.message = 'Blocked successful';
            res.redirect('/user/all');
        } catch (err) {
            console.log(err);
        }
    },
    unblock: async (req, res) => {
        let id = req.params.id;

        try {
            await apiUser.unblock(id);
            req.session.message = 'Unblocked successful';
            res.redirect('/user/all');
        } catch (err) {
            console.log(err);
        }
    }
};