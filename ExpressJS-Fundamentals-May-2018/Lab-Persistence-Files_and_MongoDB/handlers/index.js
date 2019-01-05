const homeHandler = require('./home');
const filesHandler = require('./static-files');
const product = require('./product');
const category = require('./category');

module.exports = [ homeHandler, filesHandler, product, category ];