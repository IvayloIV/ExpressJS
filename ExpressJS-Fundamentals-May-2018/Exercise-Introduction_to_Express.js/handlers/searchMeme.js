const fs = require('fs');
const Meme = require('../models/Meme');
const Genre = require('../models/Genre');

module.exports.getForm = (req, res) => {
    fs.readFile('./views/searchMeme.html', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        Genre.find({})
            .then((genres) => {
                let exitString = '<option value="all">all</option>';
        
                for (let genre of genres) {
                    exitString += `<option value="${genre._id}">${genre.title}</option>`;
                }
        
                let html = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', exitString);

                res.writeHead(200, {
                    'content-type': 'text/html'
                });

                res.write(html);
                res.end();
            });
    });
};

module.exports.postForm = (req, res) => {
    let params = req.body;
    let title = params.memeTitle;
    let genre = params.genreSelect;

    let findObj = genre === 'all' ? {} : { '_id': genre };

    console.log();
    Genre.find(findObj)
        .then((genres) => {
            let memesId = [];
            for(let genre of genres) {
                for(let memeId of genre.memeList) {
                    memesId.push(memeId);
                }
            }
            
            Meme.find({ '_id': memesId })
                .sort({ 'date': -1 })
                .where('status').equals('on')
                .then((memes) => {
                    let validMemes = [];

                    if (title === '') {
                        validMemes = memes;
                    } else {
                        validMemes = memes.filter(a => a.title.indexOf(title) !== -1);
                    }

                    let responseString = '';
                    for (let meme of validMemes) {
                        responseString += `<div class="meme">
                            <a href="/getDetails/${meme.id}">
                            <img class="memePoster" src="${meme.url}"/>          
                            </div>`;
                    }
                
                    fs.readFile('./views/viewAll.html', (err, html) => {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        html = html.toString()
                            .replace('<div id="replaceMe">{{replaceMe}}</div>', responseString);
                        
                        res.writeHead(200, {
                            'content-type': 'text.html'
                        });

                        res.write(html);
                        res.end();
                    });
                });
        });
};