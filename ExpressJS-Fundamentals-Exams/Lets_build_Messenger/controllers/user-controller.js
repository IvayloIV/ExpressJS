const encryption = require('../util/encryption');
const User = require('mongoose').model('User');

module.exports = {
    registerGet: (req, res) => {
        let message = req.session.message;
        req.session.message = '';
        res.render('user/register', {message});
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
                salt
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.message = err;
                    res.render('user/register', { user: reqUser });
                } else {
                    req.session.message = 'Successful register!';
                    res.redirect('/');
                }
            });
        } catch (e) {
            console.log(e);
            res.locals.message = e.message;
            res.render('user/register', { user: reqUser});
        }
    },
    logout: (req, res) => {
        req.logout();
        req.session.message = 'Successful logout!';
        res.redirect('/');
    },
    loginGet: (req, res) => {
        let message = req.session.message;
        req.session.message = '';
        res.render('user/login', { message });
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
            console.log(error);
            res.render('user/login', { user: reqUser, message: error });
        }
    }
};