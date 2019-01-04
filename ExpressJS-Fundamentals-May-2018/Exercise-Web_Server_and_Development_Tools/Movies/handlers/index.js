let status = require('./status');
let home = require('./home');
let viewAllMovies = require('./viewAllMovies');
let addMovie = require('./addMovie');
let details = require('./details');
let staticFiles = require('./static-files');

module.exports = [ status, home, staticFiles, viewAllMovies, addMovie, details ];