const formidable = require('formidable');
const Image = require('../models/ImageSchema');
const Tag = require('../models/TagSchema');

module.exports = (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        let tags = fields.tagsID.split(',').filter(a => a !== '');
        let newImage = new Image({ 
            URL: fields.imageUrl,
            description: fields.description,
            title: fields.imageTitle,
            tags: tags
        });

        newImage.save()
            .then((image) => {
                Tag.find({'_id': tags})
                    .then((currentTags) => {
                        for(let tag of currentTags){
                            tag.images.push(image._id);
                        }
                        
                        Tag.create(currentTags).then(() => {
                            res.writeHead(302, {
                                Location: '/'
                            });

                            res.end();
                        })
                    })
            })
    });
}