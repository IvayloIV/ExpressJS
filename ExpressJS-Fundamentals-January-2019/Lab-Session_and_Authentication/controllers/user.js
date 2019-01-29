const User = require('../models/User');
const encryption = require('../utilities/encryption');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },
    registerPost: (req, res) => {
        let user = req.body;

        if (user.password && user.password !== user.confirmedPassword) {
            let error = 'Password do not match.';
            res.render('user/register', { error, user: req.body });
            return;
        }

        let salt = encryption.generateSalt();
        user.salt = salt;

        if (user.password) {
            let hashedPassword = encryption.generateHashedPassword(salt, user.password);
            user.password = hashedPassword;
        }

        User.create(user).then(user => {
            req.logIn(user, (err, user) => {
                if (err) {
                    res.render('user/register', {
                        err: 'Authentication not working!',
                        user: req.body
                    });
                    return;
                }

                res.redirect('/');
            });
        }).catch((err) => {
            res.render('user/register', { error: err.message, user: req.body });
        });
    },
    loginGet: (req, res) => {
        res.render('user/login');
    },
    loginPost: (req, res) => {
        let userToLogin = req.body;

        User.findOne({ username: userToLogin.username }).then((user) => {
            if (!user || !user.authenticate(userToLogin.password)) {
                res.render('user/login', { error: 'Invalid credentials.', user: userToLogin });
            } else {
                req.logIn(user, (err, user) => {
                    if (err) {
                        res.render('user/login', { 
                            error: 'Authentication not working!',
                            user: userToLogin
                        });
                        return;
                    }

                    res.redirect('/');
                });
            }
        });
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    }
};