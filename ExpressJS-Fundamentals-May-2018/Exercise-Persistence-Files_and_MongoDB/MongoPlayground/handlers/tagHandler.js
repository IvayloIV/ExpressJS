const formidable = require('formidable');
const Tag = require('../models/TagSchema');

module.exports = (req, res) => {
  if (req.pathname === '/generateTag' && req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
      let newTag = new Tag({
        name: fields.tagName,
        images: []
      });

      newTag.save()
        .then(() => {
          res.writeHead(302, {
            Location: '/'
          });

          res.end();
        })
    });
  } else {
    return true
  }
}
