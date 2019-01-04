const fs = require('fs');
const path = require('path');
const db = require('../config/dataBase');

module.exports = (req, res) => {
    if (req.headers.statusheader === 'Full' && req.method === 'GET') {
        let pathname = path.normalize(
            path.join(__dirname, '../views/dist/status.html'));

        fs.readFile(pathname, (err, data) => {
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
            
            data = data.toString().replace('{{replaceMe}}', `Total number of movies: ${db.getMovies().length}`);
            res.write(data);
            res.end();
        });
    } else {
        return true;
    }
};