const fs = require('fs');
const path = require('path');
const db = require('../config/dataBase');

module.exports = (req, res) => {
    if (req.path.startsWith('/movies/details/') && req.method === 'GET') {
        let pathname = path.normalize(
            path.join(__dirname, '../views/dist/details.html'));

        fs.readFile(pathname, (err, data) => {
            let idMovie = Number(req.path.split('/').pop());

            let movie = db.getMovieById(idMovie);
            if (err || movie.length === 0) {
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

            movie = movie[0];
            data = data.toString().replace('{{replaceMe}}', `<div class="content">
                <img src="${movie['moviePoster']}" alt=""/>
                <h3>Title  ${movie['movieTitle']}</h3>
                <h3>Year ${movie['movieYear']}</h3>
                <p> ${movie['movieDescription']}</p>
                </div>`);

            res.write(data);
            res.end();
        });
    } else {
        return true;
    }
};
