const express = require('express');
const controllers = require('../controllers');
const restrictedPages = require('../config/auth');
const user = express.Router();

user.post('/register', restrictedPages.isAnonymous, controllers.user.registerPost);
user.post('/login', restrictedPages.isAnonymous, controllers.user.loginPost);

user.post('/logout', restrictedPages.isAuthed, controllers.user.logout);

user.get('/profile', restrictedPages.isAuthed, controllers.user.profile);

user.get('/all', restrictedPages.hasRole('Admin'), controllers.user.all);
user.get('/add/:id', restrictedPages.hasRole('Admin'), controllers.user.createAdmin);

user.get('/block/:id', restrictedPages.hasRole('Admin'), controllers.user.block);
user.get('/unblock/:id', restrictedPages.hasRole('Admin'), controllers.user.unblock);

module.exports = user;