const express = require('express');
const controllers = require('../controllers');
const restrictedPages = require('../config/auth');
const answer = express.Router();

answer.post('/create/:id', restrictedPages.isAuthed, controllers.answer.createPost);
answer.get('/delete/:answerId', restrictedPages.hasRole('Admin'), controllers.answer.remove);

module.exports = answer;