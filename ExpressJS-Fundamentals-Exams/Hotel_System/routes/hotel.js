const express = require('express');
const controllers = require('../controllers');
const restrictedPages = require('../config/auth');
const hotel = express.Router();

hotel.get('/details/:id', controllers.hotel.details);

hotel.get('/edit/:id', restrictedPages.hasRole('Admin'), controllers.hotel.editGet);
hotel.post('/edit/:id', restrictedPages.hasRole('Admin'), controllers.hotel.editPost);

hotel.get('/remove/:id', restrictedPages.hasRole('Admin'), controllers.hotel.remove);

hotel.get('/like/:id', restrictedPages.isAuthed, controllers.hotel.like);
hotel.get('/dislike/:id', restrictedPages.isAuthed, controllers.hotel.dislike);

module.exports = hotel;