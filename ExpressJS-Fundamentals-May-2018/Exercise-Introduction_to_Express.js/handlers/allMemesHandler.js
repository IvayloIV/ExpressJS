const fs = require('fs');
const Meme = require('../models/Meme');

module.exports = (req, res) => {
    Meme.find({})
        .sort({ date: -1 })
        .where('status').equals('on')
        .then((memes) => {
            let responseString = '';

            for (let meme of memes) {
                responseString += `<div class="meme">
                <a href="/getDetails/${meme._id}">
                <img class="memePoster" src="${meme.url}"/>          
                </div>`;
            }

            fs.readFile('./views/viewAll.html', (err, html) => {
                if (err) {
                    console.log(err);
                    return;
                }
                html = html
                    .toString()
                    .replace('<div id="replaceMe">{{replaceMe}}</div>', responseString);
        
                res.writeHead(200, {
                    'content-type': 'text/html'
                });

                res.write(html);
                res.end();
            });
        });
};