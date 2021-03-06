const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const Category = require('../models/Category');

module.exports = (req, res) => {
    req.pathname = req.pathname || url.parse(req.parse).pathname;

    if(req.pathname === '/category/add' && req.method === 'GET') {
        fs.readFile('./views/category/add.html', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }

            res.writeHead(200, {
                'content-type': 'text/html'
            });

            res.write(data);
            res.end();
        });
    } else if (req.pathname === '/category/add' && req.method === 'POST') {
        let queryData = '';

        req.on('data', data => {
            queryData += data;
        });

        req.on('end', () => {
            let category = qs.parse(queryData);
            Category.create(category)
                .then(() => {
                    res.writeHead(302, {
                        Location: '/'
                    });

                    res.end();
                });
        });
    } else {
        return true;
    }
}