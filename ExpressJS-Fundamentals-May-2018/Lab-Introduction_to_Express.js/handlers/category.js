const fs = require('fs');
const Category = require('../models/Category');

module.exports.addGet = (req, res) => {
    fs.readFile('./views/category/add.html', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        res.writeHead(200, {
            'content-type': 'text/html'
        });

        res.write(data);
        res.end();
    });
};

module.exports.addPost = (req, res) => {
    let category = req.body;
    Category.create(category)
        .then(() => {
            res.redirect('/');
        });
};