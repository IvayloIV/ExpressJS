const fs = require('fs');
const Meme = require('../models/Meme');
const Genre = require('../models/Genre');

module.exports.getForm = (req, res) => {
    showForm(req, res);
};

module.exports.postForm = (req, res) => {
    let memeObj = req.body;
    memeObj.url = '\\' + req.file.path;

    Meme.create({
        title: memeObj.memeTitle,
        status: memeObj.status,
        description: memeObj.memeDescription,
        url: memeObj.url,
        genre: memeObj.genreSelect
    }).then((addedMeme) => {
        Genre.findOne({ '_id': addedMeme.genre})
            .then((genre) => {
                genre.memeList.push(addedMeme._id);
                Genre.create(genre)
                    .then(() => {
                        showForm(req, res, 'Successful created meme!');
                    });
            });
    });
};

module.exports.getDetails = (req, res) => {
    let id = req.params.id;

    Meme.findOne({ '_id': id})
        .then((meme) => {
            let replaceString = `<div class="content">
                    <img src="${meme.url}" alt=""/>
                    <h3>Title  ${meme.title}</h3>
                    <p> ${meme.description}</p>
                    <button><a href="${meme.url}" download="${meme.title}.jpg" >Download Meme</a></button>
                    </div>`;

            fs.readFile('./views/details.html', (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }

                let html = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', replaceString);

                res.writeHead(200, {
                    'content-type': 'text/html'
                });

                res.write(html);
                res.end();
            });
        });
};

function showForm(req, res, message) {
    fs.readFile('./views/addMeme.html', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        Genre.find({}).then((genres) => {
            let exitString = '';

            for (let genre of genres) {
                exitString += `<option value="${genre._id}">${genre.title}</option>`;
            }

            res.writeHead(200, {
                'content-type': 'text/html'
            });

            let html = data.toString().replace('<div id="replaceMe">{{replaceMe2}}</div>', exitString);

            if (message !== undefined) {
                html = html.replace('<div id="replaceMe">{{replaceMe}}</div>', message);
            }
            res.write(html);
            res.end();
        });
    });
}