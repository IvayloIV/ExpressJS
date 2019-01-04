const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const db = require('../config/dataBase');

module.exports = (req, res) => {
    if (req.path === '/addMovie' && req.method === 'GET') {
        let pathname = path.normalize(
            path.join(__dirname, `../views/dist${req.path}.html`));

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
    } else if (req.path === '/addMovie' && req.method === 'POST') {
        let body = '';

        req.on('data', (data) => body += data);

        req.on('end', () => {
            let post = qs.parse(body);
            let movieTitle = post.movieTitle;
            let moviePoster = post.moviePoster;

            let pathname = path.normalize(
                path.join(__dirname, `../views/dist${req.path}.html`));
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
                
                if (movieTitle === '' || moviePoster === '') {
                    data = data.toString().replace(
                        '{{replaceMe}}', '<div id="errBox"><h2 id="errMsg">Please fill all fields</h2></div>');
                } else {
                    db.saveMovie(post);
                    data = data.toString().replace(
                        '{{replaceMe}}', '<div id="succssesBox"><h2 id="succssesMsg">Movie Added</h2></div>');
                }

                res.write(data);
                res.end();
            });
        });
    } else {
        return true;
    }
}