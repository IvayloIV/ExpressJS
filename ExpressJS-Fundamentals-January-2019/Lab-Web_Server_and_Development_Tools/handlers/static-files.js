const fs = require('fs');
const path = require('path');
const url = require('url');

let contentTypes = {
    html: 'text/html',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpeg',
    javascript: 'text/javascript',
    ico: 'image/x-icon'
};

module.exports = (req, res) => {
    req.pathname = req.pathname || url.path(req.url).pathname;

    if (req.pathname.startsWith('/content/') && req.method === 'GET') {
        let filePath = path.normalize(
            path.join(__dirname, `..${req.pathname}`)
        );

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, {
                    'content-type': 'text/plain'
                });

                res.write('404 not found!');
                res.end();
                return;
            }

            let type = req.pathname.split('.').splice(-1);
            res.writeHead(200, {
                'content-type': contentTypes[type]
            });
            res.write(data);
            res.end();
        });
    } else {
        return true;
    }
};