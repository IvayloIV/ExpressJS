const express = require('express');
const controllers = require('../controllers');
const restrictedPages = require('../config/auth');
const main = express.Router();

main.get('/', controllers.home.index);
main.get('/index.html', controllers.home.index);
main.get('/about', controllers.home.about);

main.get('/loginRegister', restrictedPages.isAnonymous, controllers.user.loginRegister);

main.get('/addHotel', restrictedPages.isAuthed, controllers.hotel.createGet);
main.post('/addHotel', restrictedPages.isAuthed, controllers.hotel.createPost);

main.get('/list/:page', controllers.hotel.all);

module.exports = main;