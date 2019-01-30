const express = require('express');
const controllers = require('../controllers');
const restrictedPages = require('../config/auth');
const category = express.Router();

category.get('/add', restrictedPages.hasRole('Admin'), controllers.category.addGet);
category.post('/add', restrictedPages.hasRole('Admin'), controllers.category.addPost);

category.get('/all', restrictedPages.hasRole('Admin'), controllers.category.viewAll);
category.get('/list/:id', controllers.category.currentCategory);

category.get('/remove/:id', restrictedPages.hasRole('Admin'), controllers.category.remove);

module.exports = category;