let fs = require('fs');
let path = require('path');
let db = require('../config/dataBase');

module.exports = (req, res) => {
    if (req.path === '/viewAllMovies' && req.method === 'GET') {
        let pathname = path.normalize(
            path.join(__dirname, `../views/dist/viewAll.html`)
        );

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
            
            let dataString = '';
            for(let movie of db.getMovies().sort((a, b) => Number(a['movieYear']) - Number(b['movieYear']))){
                dataString += `<a href="/movies/details/${movie['id']}">
                    <div class="movie">
                    <img class="moviePoster" src="${movie['moviePoster']}"/>
                    </div></a>`;
            }

            data = data.toString().replace('{{replaceMe}}', dataString);
            res.write(data);
            res.end();
        });
    } else {
        return true;
    }
};