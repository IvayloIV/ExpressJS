const qs = require('querystring');
const Tag = require('../models/Tag');
const Image = require('../models/Image');

module.exports = (req, res) => {
    if (req.pathname === '/addImage' && req.method === 'POST') {
        addImage(req, res);
    } else if (req.pathname === '/delete' && req.method === 'GET') {
        deleteImg(req, res);
    } else {
        return true;
    }
};

function addImage(req, res) {
    let queryString = '';

    req.on('data', (data) => {
        queryString += data;
    });

    req.on('end', () => {
        let body = qs.parse(queryString);
        let tagsId = body.tagsID.split(',').filter(a => a !== '');
        let newImage = {
            imageUrl: body.imageUrl,
            description: body.description,
            imageTitle: body.imageTitle,
            tags: tagsId,
        };

        Image.create(newImage).then((image) => {
            Tag.find({'_id': tagsId}).then((tags) => {
                for(let tag of tags) {
                    tag.images.push(image._id);
                }
                Tag.create(tags).then(() => {
                    res.writeHead(302, {
                        'Location': '/'
                    });

                    res.end();
                });
            });
        });
    });
}

function deleteImg(req, res) {
    let id = req.pathquery.id;

    Image.findById(id).then((image) => {
        Tag.find({ '_id': image.tags }).then((tags) => {
            for(let tag of tags) {
                let index = tag.images.indexOf(image._id);
                tag.images.splice(index, 1);
            }

            Tag.create(tags).then(() => {
                image.remove(() => {
                    res.writeHead(302, {
                        'Location': '/'
                    });
                    res.end();
                });
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}