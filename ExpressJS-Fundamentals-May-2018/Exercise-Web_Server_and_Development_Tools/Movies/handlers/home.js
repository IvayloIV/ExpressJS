const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    if (req.path === '/' && req.method === 'GET') {
        let pathname = path.normalize(
            path.join(__dirname, '../views/dist/home.html'));

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
            
            res.write(data);
            res.end();
        });
    } else {
        return true;
    }
};
