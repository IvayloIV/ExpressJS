const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

module.exports = app => {
    app.engine('.hbs', handlebars({
        defaultLayout: 'main',
        extname: '.hbs'
    }));

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({
        secret: '123456',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        if (req.user) {
            res.locals.currentUser = req.user;

            if (req.user.roles.indexOf('Admin') > -1) {
                res.locals.isAdmin = true;
            }
        }

        next();
    });

    app.use((req, res, next) => {
        if (req.session.message !== '') {
            res.locals.message = req.session.message;
            req.session.message = '';
        }

        next();
    });

    app.set('view engine', '.hbs');

    app.use(express.static('./static'));
};