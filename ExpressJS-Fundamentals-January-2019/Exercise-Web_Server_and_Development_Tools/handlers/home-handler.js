const fs = require('fs');

module.exports = (req, res) => {
    if (req.pathname === '/' && req.method === 'GET') {
        fs.readFile('./views/home.html', 'utf8', (err, data) => {
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
            res.write(data);
            res.end();
        });
    } else {
        return true;
    }
};