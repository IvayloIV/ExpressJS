const homeHandler = require('./home');
const filesHandler = require('./static-files');
const product = require('./product');

module.exports = [ homeHandler, filesHandler, product ];