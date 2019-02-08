const express = require('express');
const controllers = require('../controllers');
const restrictedPages = require('../config/auth');
const thread = express.Router();

thread.get('/create', restrictedPages.isAuthed, controllers.thread.createGet);
thread.post('/create', restrictedPages.isAuthed, controllers.thread.createPost);

thread.get('/details/:id', controllers.thread.details);
thread.get('/list', controllers.thread.list);

thread.get('/edit/:id', restrictedPages.hasRole('Admin'), controllers.thread.editGet);
thread.post('/edit/:id', restrictedPages.hasRole('Admin'), controllers.thread.editPost);

thread.get('/delete/:id', restrictedPages.hasRole('Admin'), controllers.thread.delete);

thread.get('/like/:id', restrictedPages.isAuthed, controllers.thread.like);
thread.get('/unlike/:id', restrictedPages.isAuthed, controllers.thread.unlike);

thread.get('/category/:id', controllers.thread.getByCategory);

module.exports = thread;