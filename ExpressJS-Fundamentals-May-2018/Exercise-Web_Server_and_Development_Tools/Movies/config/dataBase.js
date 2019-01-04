let fs = require('fs');
let dbPath = './config/dataBase.json';

function load() {
    if (fs.existsSync(dbPath)) {
        return JSON.parse(fs.readFileSync(dbPath));
    }
    return [];
}

function save(movies) {
    let json = JSON.stringify(movies);
    fs.writeFileSync(dbPath, json);
}


function getMovies() {
    return load();   
}

function saveMovie(movie) {
    let movies = load();
    movie.id = movies.length + 1;
    movies.push(movie);
    save(movies);
}

function getMovieById(id) {
    return load().filter(a => a.id === id);
}

module.exports = { getMovies, saveMovie, getMovieById };