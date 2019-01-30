const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const apiTweet = require('../api/tweet');
const apiUser = require('../api/user');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;
        if (!reqUser.password || !reqUser.repeatedPassword) {
            res.render('user/register', { user: reqUser, message: 'Please fill all fields' });
            return;
        }

        if (reqUser.password !== reqUser.repeatedPassword) {
            res.render('user/register', { user: reqUser, message: 'Passwords must match!' });
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
    my: async (req, res) => {
        try {
            let username = req.user.username;
            const tweets = await apiTweet.getByUsername(username);
            for (let tweet of tweets) {
                tweet.date = tweet.creationDate.toLocaleString();
                tweet.likesCount = tweet.likes.length;
                if (tweet.likes.indexOf(req.user.id) > -1) {
                    tweet.isLiked = true;
                }
            }
            res.render('tweet/my', { tweets, username });
        } catch (err) {
            console.log(err);
        }
    },
    allUsers: async (req, res) => {
        try {
            const users = await apiUser.allNormalUsers();
            res.render('user/users', { users });
        } catch (err) {
            console.log(err);
        }
    },
    createAdmin: async (req, res) => {
        let id = req.params.id;

        try {
            await apiUser.createAdmin(id);    
            req.session.message = 'Admin created.';
            res.redirect('/user/all');
        } catch (err) {
            console.log(err);
        }
    },
    allAdmins: async (req, res) => {
        try {
            const admins = await apiUser.allAdmins();
            res.render('user/admins', { admins });
        } catch (err) {
            console.log(err);
        }
    }
};