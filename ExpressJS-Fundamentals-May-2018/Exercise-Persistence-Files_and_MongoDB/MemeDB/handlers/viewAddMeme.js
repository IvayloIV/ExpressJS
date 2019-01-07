const fs = require('fs');

module.exports = (req, res) => {
    fs.readFile('./views/addMeme.html', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(404, {
                'content-type': 'text/plain'
            });
            res.white('404 not found!');
            res.end();
        }

        res.writeHead(200, {
            'content-type': 'text/html'
        });

        res.write(data);
        res.end();
    });
};