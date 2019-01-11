const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

module.exports = (app) => {
    app.use('/static', express.static('static'));
    app.use(bodyParser.urlencoded({ extended: true }));

    app.engine('hbs', handlebars({
        extname: '.hbs',
        defaultLayout: 'main',
    }));
    
    app.set('view engine', '.hbs');
};