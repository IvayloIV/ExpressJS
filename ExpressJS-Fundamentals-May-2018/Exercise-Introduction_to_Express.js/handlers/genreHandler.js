const fs = require('fs');
const Genre = require('../models/Genre');

module.exports.getForm = (req, res) => {
    showForm(req, res);
};

module.exports.postForm = (req, res) => {
    let title = req.body.memeTitle;

    if (title === '') {
        showForm(req, res, 'Empty title!');
        return;
    }

    Genre.create({
        title,
        memeList: []
    }).then(() => {
        showForm(req, res, 'Successful created!');
    });
};

function showForm(req, res, message) {
    fs.readFile('./views/addGenre.html', (err, data) => {
        if (err) {
            console.log(err);
        }
        
        res.writeHead(200, {
            'content-type': 'text/html'
        });

        if (message !== undefined) {
            data = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', message);
        }
        res.end(data);
    });
}