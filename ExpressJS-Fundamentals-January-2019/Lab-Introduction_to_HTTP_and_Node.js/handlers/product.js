const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const database = require('../config/database');

module.exports = (req, res) => {
    req.pathname = req.pathname || url.parse(req.url).pathname;

    if (req.pathname === '/product/add' && req.method === 'GET') {
        let filePath = path.normalize(
            path.join(__dirname, '../views/products/add.html')
        );
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                req.writeHead(404, {
                    'content-type': 'text/plain'
                });

                res.write('404 not found!');
                res.end();
                return;
            }

            res.writeHead(200, {
                'content-type': 'text/html'
            });
            res.write(data);
            res.end();
        });
    } else if (req.pathname === '/product/add' && req.method === 'POST') {
        let dataString = '';

        req.on('data', (data) => {
            dataString += data;
        });

        req.on('end', () => {
            let product = qs.parse(dataString);
            database.products.add(product);

            res.writeHead(302, {
                Location: '/'
            });
            res.end();
        });
    } else {
        return true;
    }
};