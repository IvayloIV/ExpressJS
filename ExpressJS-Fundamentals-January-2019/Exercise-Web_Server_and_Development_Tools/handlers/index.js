const filesHandler = require('./static-files-handler');
const homeHandler = require('./home-handler');
const movieHandler = require('./movie-handler');
const headerHandler = require('./header-handler');

module.exports = [ filesHandler, headerHandler, homeHandler, movieHandler ];