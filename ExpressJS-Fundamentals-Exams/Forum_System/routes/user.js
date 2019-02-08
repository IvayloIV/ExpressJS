const express = require('express');
const controllers = require('../controllers');
const restrictedPages = require('../config/auth');
const user = express.Router();

user.get('/register', restrictedPages.isAnonymous, controllers.user.registerGet);
user.post('/register', restrictedPages.isAnonymous, controllers.user.registerPost);

user.get('/login', restrictedPages.isAnonymous, controllers.user.loginGet);
user.post('/login', restrictedPages.isAnonymous, controllers.user.loginPost);

user.get('/logout', restrictedPages.isAuthed, controllers.user.logout);

user.get('/admins', restrictedPages.hasRole('Admin'), controllers.user.admins);
user.get('/normals', restrictedPages.hasRole('Admin'), controllers.user.normalUsers);

user.get('/create/admin/:id', restrictedPages.hasRole('Admin'), controllers.user.createAdmin);
user.get('/posts/:username', restrictedPages.isAuthed, controllers.user.postsByUser);

user.get('/unblock/:id', restrictedPages.hasRole('Admin'), controllers.user.unblock);
user.get('/block/:id', restrictedPages.hasRole('Admin'), controllers.user.block);

module.exports = user;