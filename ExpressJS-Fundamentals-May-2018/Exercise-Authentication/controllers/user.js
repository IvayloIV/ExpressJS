const User = require('../models/User');
const encryption = require('../utilities/encryption');

module.exports.registerGet = (req, res) => {
    res.render('users/register');
};

module.exports.registerPost = (req, res) => {
    let user = req.body;

    let originalPass = user.password;
    let salt = encryption.generateSalt();
    user.salt = salt;

    if (!originalPass) {
        user.message = 'Empty password!';
        res.render('users/register', user);
        return;
    }

    let hashedPassword = encryption.generateHashedPassword(salt, user.password);
    user.password = hashedPassword;

    User.create(user).then((user) => {
        req.logIn(user, (error, user) => {
            if (error) {
                user.message = 'Authentication not working!';
                user.password = originalPass;
                res.render('users/register', user);
                return;
            }

            res.redirect('/');
        });
    }).catch((error) => {
        user.message = error;
        user.password = originalPass;
        res.render('users/register', user);
    });
};

module.exports.loginGet = (req, res) => {
    let message = req.session.message;
    req.session.message = '';
    res.render('users/login', { message });
};

module.exports.loginPost = (req, res) => {
    let userToLogin = req.body;

    User.findOne({ username: userToLogin.username}).then((user) => {
        if (!user || !user.authenticate(userToLogin.password)) {
            userToLogin.message = 'Invalid credentials!';
            res.render('users/login', userToLogin);
            return;
        }

        req.logIn(user, (error, user) => {
            if (error) {
                userToLogin.message = error;
                res.render('users/login', userToLogin);
                return;
            }

            res.redirect('/');
        });
    });
};

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

module.exports.myProfile = (req, res) => {
    User.findById(req.user._id).populate('rentedCars').then((user) => {
        res.render('users/profile', user);
    });
};