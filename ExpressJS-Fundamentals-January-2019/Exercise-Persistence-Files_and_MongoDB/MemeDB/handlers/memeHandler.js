const fs = require('fs');
const db = require('../config/dataBase');
const url = require('url');
const qs = require('querystring');
const formidable = require('formidable');
const shortid = require('shortid');

module.exports = (req, res) => {
    if (req.pathname === '/viewAllMemes' && req.method === 'GET') {
        viewAll(req, res);
    } else if (req.pathname === '/addMeme' && req.method === 'GET') {
        viewAddMeme(req, res);
    } else if (req.pathname === '/addMeme' && req.method === 'POST') {
        addMeme(req, res);
    } else if (req.pathname.startsWith('/getDetails') && req.method === 'GET') {
        getDetails(req, res);
    } else if (req.pathname.startsWith('public/memeStorage') && req.method === 'GET') {
        console.log('HERE');
    }
    else {
        return true;
    }
};

function viewAll(req, res) {
    fs.readFile('./views/viewAll.html', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        db.load().then((memes) => {
            let replacement = '';

            for (let meme of memes
                .filter(a => a['privacy'] === 'on')
                .sort((a, b) => b['dateStamp'] - a['dateStamp'])) {
                replacement +=
                `<div class="meme">
                    <a href="/getDetails?id=${meme.id}">
                    <img class="memePoster" src="${meme.memeSrc}"/>          
                </div>`;
            }

            let html = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', replacement);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(html);
            res.end();
        });
    });
}

function getDetails(req, res) {
    fs.readFile('./views/details.html', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        let query = qs.parse(url.parse(req.url).query);
        let id = query.id;

        db.getById(id).then((meme) => {
            let html = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', 
                `<div class="content">
                    <img src="${meme.memeSrc}" alt=""/>
                    <h3>Title ${meme.title}</h3>
                    <p> ${meme.description}</p>
                </div>`);
            
            res.writeHead(200, {
                'content-type': 'text.html'
            });
            res.write(html);
            res.end();
        }).catch((e) => {
            console.log(e);
        });
    });
}

function viewAddMeme(req, res) {
    fs.readFile('./views/addMeme.html', (err, data) => {
        if(err) {
            console.log(err);
            return;
        }
        res.writeHead(200,{
            'Content-Type':'text/html'
        });
        res.end(data);
    });
}

function addMeme(req, res) {
    const form = new formidable.IncomingForm();
    let imageName = shortid.generate();
    let pathImage = `./public/memeStorage/${imageName}.jpg`;

    form.on('fileBegin', (name, file) => {
        file.path = pathImage;
    });
    
    form.parse(req, function(err, fields, files) {
        const idMeme = shortid.generate();

        const newMeme = {
            id: idMeme,
            title: fields.memeTitle,
            memeSrc: pathImage,
            description: fields.memeDescription,
            privacy: fields.status,
            dateStamp: Date.now()
        };

        db.add(newMeme);
        db.save().then(() => {
            res.writeHead(302, {
                'Location': '/viewAllMemes'
            });

            res.end();
        });
    });
}