const url = require('url');
const qs = require('querystring');
const fs = require('fs');
const Image = require('../models/ImageSchema');
const Tag = require('../models/TagSchema');

module.exports = (req, res) => {
    if (req.pathname === '/search') {
        let query = qs.parse(url.parse(req.url).query);
        fs.readFile('./views/results.html', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, {
                    'content-type': 'text/plain'
                });

                res.write('404 not found!');
                res.end();
            }
            let findObj = {};

            if (query.afterDate !== "") {
                let afterDate = Date.parse(query.afterDate);
                findObj['date'] = { $gt: afterDate }
            }

            if (query.beforeDate !== "") {
                let beforeDate = Date.parse(query.beforeDate);
                findObj['date'] = { $lt: beforeDate }
            }
            let count = isNaN(query.Limit) ? 10 : Number(query.Limit);

            if (query.tagName !== 'Write tags separted by ,') {
                let tags = query.tagName.split(',').filter(a => a !== '');

                Tag.find({ name: tags })
                    .then((tags) => {
                        let imagesId = [];
                        for (let tag of tags) {
                            for (let id of tag['images']) {
                                imagesId.push(id);
                            }
                        }

                        findObj['_id'] = imagesId;
                        Image.find(findObj)
                            .sort({ 'date': -1 })
                            .limit(count)
                            .then((images) => {
                                showImages(images, data, res);
                            });
                    });
            } else {
                Image.find(findObj)
                    .limit(count)
                    .then((images) => {
                        showImages(images, data, res);
                    });
            }
        });
    } else {
        return true
    }
}

function showImages(images, data, res) {
    let content = ``;
    for (let image of images) {
        content +=
            `<fieldset id => <legend>${image.title}:</legend> 
      <img src="${image.URL}">
      </img><p>${image.description}<p/>
      <button onclick='location.href="/delete?id=${image._id}"'class='deleteBtn'>Delete
      </button> 
    </fieldset>`
    }

    let html = data.toString().replace("<div class='replaceMe'></div>", content);
    res.writeHead(200, {
        'content-type': 'text/html'
    });
    res.write(html);
    res.end();
}