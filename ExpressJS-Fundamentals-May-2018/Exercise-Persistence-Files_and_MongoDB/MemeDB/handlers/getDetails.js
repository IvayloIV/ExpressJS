const fs = require('fs');
const url = require('url');
const database = require('../config/dataBase');

module.exports = (req, res) => {
    let query = url.parse(req.url).query;

    fs.readFile('./views/details.html', 'utf8', (err, data) => {
        let id = query.split('=').pop();
        
        database.load().then(memes => {
            memes = memes.filter(a => a.id === id);

            if (err || memes.length === 0) {
                res.writeHead(404, {
                    'content-type': 'text/plain'
                });
                res.white('404 not found!');
                res.end();
            }
    
            res.writeHead(200, {
                'content-type': 'text/html'
            });
    
            let meme = memes[0];
    
            let html = data.replace('<div id="replaceMe">{{replaceMe}}</div>', 
                `<div class="content">
                <img src="${meme.memeSrc}" alt=""/>
                <h3>Title  ${meme.title}</h3>
                <p> ${meme.description}</p>
                <button><a href="/sendFile/${meme.memeSrc}">Download Meme</a></button>
            </div>`);
    
            res.write(html);
            res.end();
        });
    });
};