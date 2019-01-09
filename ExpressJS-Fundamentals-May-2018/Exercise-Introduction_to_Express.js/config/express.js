const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');

module.exports = (app) => {
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        if (req.url.startsWith('/public')) {
            req.url = req.url.replace('/public', '');
        } else if (req.url === '/favicon.ico') {
            req.url = '/images/favicon.ico';
        }

        next();
    }, express.static('public'));

    app.use('/api', api);
};