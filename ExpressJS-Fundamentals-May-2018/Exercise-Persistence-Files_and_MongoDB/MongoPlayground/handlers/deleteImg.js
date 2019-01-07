let Image = require('../models/ImageSchema');
let Tag = require('../models/TagSchema');
let url = require('url');
let qs = require('querystring');

module.exports = (req, res) => {
    let idImage = qs.parse(url.parse(req.url).query).id;

    Image.findByIdAndRemove(idImage, () => {
        Tag.find({})
            .where('images').in(idImage)
            .then((tags) => {
                for(let tag of tags){
                    let index = tag.images.indexOf(idImage);
                    tag.images.splice(index, 1);
                }

                Tag.create(tags)
                    .then(() => {
                        res.writeHead(302, {
                            Location: '/'
                        });

                        res.end();
                    });
            });
    });
}