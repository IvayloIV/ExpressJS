const http = require('http');
const url = require('url');
const handlers = require('./handlers/handlerBlender');

const environment = process.env.NODE_ENV || 'development';
const config = require('./config/config');
const database = require('./config/database.config');

database(config[environment]);

http.createServer((req, res) => {
    for (let handler of handlers) {
        req.pathname = url.parse(req.url).pathname;
        let task = handler(req, res);
        if (task !== true) {
            break;
        }
    }
}).listen(config[environment].port);