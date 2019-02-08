const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const apiThread = require('../api/thread');
const apiAnswer = require('../api/answer');

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
    myPosts: async (req, res) => {
        try {
            const userId = req.user.id;
            const threads = await apiThread.getByCreator(userId);
            const answers = await apiAnswer.getByCreator(userId);

            res.render('user/my', { threads, answers });
        } catch (err) {
            console.log(err);
        }
    },
    admins: async (req, res) => {
        try {
            const admins = await User.find({})
                .where('roles').in(['Admin']);

            res.render('user/admins', { admins });
        } catch (err) {
            console.log(err);
        }
    },
    normalUsers: async (req, res) => {
        try {
            const normalUsers = await User.find({})
                .where('roles').nin(['Admin']);

            res.render('user/normalUsers', { normalUsers });
        } catch (err) {
            console.log(err);
        }
    },
    createAdmin: async (req, res) => {
        const id = req.params.id;

        try {
            const user = await User.findById(id);
            user.roles.push('Admin');
            await user.save();
            req.session.message = 'New admin created.';
            res.redirect('/user/admins');
        } catch (err) {
            console.log(err);
        }
    },
    block: async (req, res) => {
        const id = req.params.id;

        try {
            const user = await User.findById(id);

            if (user.isBlocked) {
                req.session.message = 'User is already blocked.';
                res.redirect('/user/normals');
                return;
            }
            user.isBlocked = true;
            await user.save();
            req.session.message = 'User was blocked.';
            res.redirect('/user/normals');
        } catch (err) {
            console.log(err);
        }
    },
    unblock: async (req, res) => {
        const id = req.params.id;

        try {
            const user = await User.findById(id);

            if (!user.isBlocked) {
                req.session.message = 'User is already unblocked.';
                res.redirect('/user/normals');
                return;
            }
            user.isBlocked = false;
            await user.save();
            req.session.message = 'User was unblocked.';
            res.redirect('/user/normals');
        } catch (err) {
            console.log(err);
        }
    },
    postsByUser: async (req, res) => {
        const username = req.params.username;

        try {
            const user = await User.findOne({ username });
            const threads = await apiThread.getByCreator(user._id);
            const answers = await apiAnswer.getByCreator(user._id);

            res.render('user/posts', { threads, answers, name: user.username });
        } catch (err) {
            console.log(err);
        }
    }
};