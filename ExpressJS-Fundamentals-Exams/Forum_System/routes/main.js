const express = require('express');
const controllers = require('../controllers');
const restrictedPages = require('../config/auth');
const main = express.Router();

main.get('/', controllers.home.index);
main.get('/index.html', controllers.home.index);
main.get('/myPosts', restrictedPages.isAuthed, controllers.user.myPosts);

module.exports = main;