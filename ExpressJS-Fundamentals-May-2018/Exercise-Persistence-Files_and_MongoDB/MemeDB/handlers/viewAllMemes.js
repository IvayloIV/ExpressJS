const fs = require('fs');
const database = require('../config/dataBase');

module.exports = (req, res) => {
    fs.readFile('./views/viewAll.html', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(404, {
                'content-type': 'text/plain'
            });
            res.white('404 not found!');
            res.end();
        }

        database.load()
            .then((memes) => {
                let content = '';
                memes = memes.filter(a => a.privacy === 'on');
                for(let meme of memes.sort((a, b) => a['dateStamp'] - b['dateStamp'])) {
                    content += 
                    `<div class="meme">
                        <a href="/getDetails?id=${meme.id}">
                        <img class="memePoster" src="${meme.memeSrc}"/>          
                    </div>`;
                }

                res.writeHead(200, {
                    'content-type': 'text/html'
                });

                let html = data.toString()
                    .replace('<div id="replaceMe">{{replaceMe}}</div>', content);
                    
                res.write(html);
                res.end();
            });
    });
};