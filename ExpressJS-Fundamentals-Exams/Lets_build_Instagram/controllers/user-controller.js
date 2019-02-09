const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const apiImage = require('../api/image');
const apiUser = require('../api/user');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;
        if (!reqUser.password) {
            res.render('user/register', { user: reqUser, message: 'Please fill all fields' });
            return;
        }

        const salt = encryption.generateSalt();
        const hashedPass =
            encryption.generateHashedPassword(salt, reqUser.password);

        try {
            const user = await User.create({
                username: reqUser.username,
                hashedPass,
                salt,
                roles: ['User']
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.render('user/register', { user: reqUser, message: err });
                } else {
                    req.session.message = 'Successful register!';
                    res.redirect('/');
                }
            });
        } catch (e) {
            res.render('user/register', { user: reqUser, message: e.message });
        }
    },
    logout: (req, res) => {
        req.logout();
        req.session.message = 'Successful logout!';
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('user/login');
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
            res.render('user/login', { user: reqUser, message: error });
        }
    },
    profile: async (req, res) => {
        const username = req.params.username;

        try {
            const images = await apiImage.getByUsername(username);
            res.render('user/profile', { images, username });
        } catch (err) {
            console.log(err);
        }
    },
    admins: async (req, res) => {
        try {
            const admins = await User.find({})
                .where('roles').in(['Admin']);

            res.render('user/admin', { admins });
        } catch (err) {
            console.log(err);
        }
    },
    users: async (req, res) => {
        try {
            const users = await User.find({})
                .where('roles').nin(['Admin']);

            res.render('user/users', { users });
        } catch (err) {
            console.log(err);
        }
    },
    createAdmin: async (req, res) => {
        const id = req.params.id;

        try {
            await apiUser.createAdmin(id);
            req.session.message = 'New admin created.';
            res.redirect('/user/admins');
        } catch (err) {
            console.log(err);
        }
    }
};