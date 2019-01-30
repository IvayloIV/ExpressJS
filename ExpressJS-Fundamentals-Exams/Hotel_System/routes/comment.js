const express = require('express');
const controllers = require('../controllers');
const restrictedPages = require('../config/auth');
const comment = express.Router();

comment.post('/create/:id', restrictedPages.isAuthed, controllers.comment.commentsPost);

comment.get('/edit/:id', restrictedPages.hasRole('Admin'), controllers.comment.editGet);
comment.post('/edit/:id', restrictedPages.hasRole('Admin'), controllers.comment.editPost);

comment.get('/remove/:id', restrictedPages.hasRole('Admin'), controllers.comment.remove);

module.exports = comment;