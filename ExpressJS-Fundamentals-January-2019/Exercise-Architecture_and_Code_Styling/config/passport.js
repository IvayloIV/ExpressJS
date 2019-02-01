const passport = require('passport');
const LocalPassport = require('passport-local');
const User = require('./../models/User');

const authenticateUser = (email, password, done) => {
    User.findOne({email: email}).then(user => {
        if(!user) {
            return done(null, false);
        }

        if (!user.authenticate(password)) {
            return done(null, false);
        }

        return done(null, user);
    });
};

module.exports = () => {
    passport.use(new LocalPassport({
        usernameField: 'email',
        passwordField: 'password'
    }, authenticateUser));

    passport.serializeUser((user, done) => {
        if (!user) {
            return done(null, false);
        }

        return done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        });
    });
};


