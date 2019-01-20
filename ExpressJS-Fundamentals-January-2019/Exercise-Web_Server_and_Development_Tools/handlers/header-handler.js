const fs = require('fs');
const database = require('../config/dataBase');

module.exports = (req, res) => {
    if (req.headers.statusheader === 'Full' && req.method === 'GET') {
        fs.readFile('./views/status.html', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, {
                    'content-type': 'text/plain'
                });

                res.write('404 not found!');
                res.end();
                return;
            }

            res.writeHead(200, {
                'content-type': 'text/html'
            });

            let html = data.toString()
                .replace('<h1>{{replaceMe}}</h1>', `Number of movies: ${database.length}`);

            res.write(html);
            res.end();
        });
    } else {
        return true;
    }
};