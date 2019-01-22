const http = require('http');
const url = require('url');
const qs = require('querystring');
const handlers = require('./handlers/handlerBlender');

const environment = process.env.NODE_ENV || 'development';
const config = require('./config/config');
const database = require('./config/database.config');

database(config[environment]);

http.createServer((req, res) => {
    req.pathname = url.parse(req.url).pathname;
    req.pathquery = qs.parse(url.parse(req.url).query);
    for (let handler of handlers) {
        if (!handler(req, res)) {
            break;
        }
    }
}).listen(config[environment].port);