const express = require('express');
const controllers = require('../controllers');
const restrictedPages = require('../config/auth');
const category = express.Router();

category.get('/create', restrictedPages.hasRole('Admin'), controllers.category.createGet);
category.post('/create', restrictedPages.hasRole('Admin'), controllers.category.createPost);

category.get('/all', restrictedPages.hasRole('Admin'), controllers.category.all);
category.get('/delete/:id', restrictedPages.hasRole('Admin'), controllers.category.remove);

module.exports = category;