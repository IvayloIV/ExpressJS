const fs = require('fs');
const shortid = require('shortid');
const formidable = require('formidable');
const database = require('../config/dataBase');

module.exports = (req, res) => {
    let form = new formidable.IncomingForm();
    let idImage = shortid.generate();

    database.load()
        .then((db) => {
            let folderNumber = Math.ceil(db.length / 5);
            let folderPath = `./public/memeStorage/${folderNumber}`;
            let imagePath = `${folderPath}/${idImage}.jpg`;

            form.on('error', (err) => {
                console.log(err);
            }).on('fileBegin', (name, file) => {
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
                file.path = imagePath;
            });

            form.parse(req, function (err, fields, files) {
                let newMemeId = shortid.generate();

                let newMeme = {
                    id: newMemeId,
                    title: fields.memeTitle,
                    memeSrc: imagePath,
                    description: fields.memeDescription,
                    privacy: fields.status,
                    dateStamp: Date.now()
                };

                database.add(newMeme);

                res.writeHead(302, {
                    Location: '/'
                });

                res.end();
            });
        });
};