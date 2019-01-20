const fs = require('fs');
const qs = require('querystring');
const database = require('../config/dataBase');

module.exports = (req, res) => {
    if (req.pathname === '/viewAllMovies' && req.method === 'GET') {
        fs.readFile('./views/viewAll.html', 'utf8', (err, data) => {
            if (err) {
                showError(res);
                return;
            }

            let content = '';
            let index = 1;
            for(let movie of database.sort((a, b) => Number(a.movieYear) - Number(b.movieYear))) {
                content += 
                `<a href="/movies/details/${index++}">
                    <div class="movie">
                        <img class="moviePoster" src="${movie.moviePoster}" />
                    </div>
                </a>`;
            }

            let html = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', content);
            res.writeHead(200, {
                'content-type': 'text/html'
            });
            res.write(html);
            res.end();
        });
    } else if (req.pathname === '/addMovie' && req.method === 'GET') {
        fs.readFile('./views/addMovie.html', 'utf8', (err, data) => {
            if (err) {
                showError(res);
                return;
            }

            res.writeHead(200, {
                'content-type': 'text/html'
            });
            res.write(data);
            res.end();
        });
    } else if (req.pathname === '/addMovie' && req.method === 'POST') {
        let body = '';

        req.on('data', data => body += data);

        req.on('end', () => {
            let data = qs.parse(body);
            let movieTitle = data.movieTitle;
            let movieYear = data.movieYear;
            let moviePoster = data.moviePoster;
            let movieDescription = data.movieDescription;

            if (moviePoster === '' || movieTitle === '') {
                showMessage('<div id="errBox"><h2 id="errMsg">Please fill all fields</h2></div>');
            } else {
                database.push({ 
                    id: database.length + 1,
                    movieTitle, 
                    movieYear, 
                    moviePoster, 
                    movieDescription}
                );
                
                showMessage('<div id="succssesBox"><h2 id="succssesMsg">Movie Added</h2> </div>');
            }
        });

        function showMessage(divMessage) {
            fs.readFile('views/addMovie.html', 'utf8', (err, data) => {
                if (err) {
                    showError(res);
                    return;
                }
    
                res.writeHead(200, {
                    'content-type': 'text/html'
                });

                let html = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', divMessage);
                res.write(html);
                res.end();
            });
        }
    } else if (req.pathname.startsWith('/movies/details/') && req.method === 'GET') {
        let movieNumber = Number(req.pathname.split('/').splice(-1));

        if (movieNumber > database.length) {
            showError(res);
            return;
        }

        let movie = database[movieNumber - 1];
        fs.readFile('views/details.html', 'utf8', (err, data) => {
            if (err) {
                showError(res);
                return;
            }

            let content = 
            `<div class="content">
                <img src="${movie.moviePoster}" alt="" />
                <h3>Title ${movie.movieTitle}</h3>
                <h3>Year ${movie.movieYear}</h3>
                <p> ${movie.movieDescription}</p>
            </div>`;
            let html = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', content);
            res.writeHead(200, {
                'content-type': 'text/html'
            });
            res.write(html);
            res.end();
        });
    } else {
        return true;
    }
};

function showError(res) {
    res.writeHead(404, {
        'content-type': 'text/plain'
    });

    res.write('404 not found!');
    res.end();
}