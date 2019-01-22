const qs = require('querystring');
const fs = require('fs');
const Image = require('../models/Image');
const Tag = require('../models/Tag');

module.exports = (req, res) => {
	if (req.pathname === '/search' && req.method === 'POST') {
		let queryString = '';

		req.on('data', (data) => {
			queryString += data;
		});

		req.on('end', () => {
			let body = qs.parse(queryString);
			let obj = {};

			if (body.afterDate !== '') {
				obj['dateCreation'] = { $gt: Date.parse(body.afterDate) };
			}

			if (body.beforeDate !== '') {
				obj['dateCreation'] = { $lt: Date.parse(body.beforeDate) };
			}

			let maxLimit = 10;
			if (body.Limit !== '') {
				maxLimit = Number(body.Limit);
			}
			let tagsName = {};

			if (body.tagName !== 'Write tags separted by ,') {
				let tags = body.tagName
					.split(',')
					.map(a => a.trim())
					.filter(a => a !== '');

				tagsName['name'] = tags;
			}

			Tag.find(tagsName).then((tags) => {
				Image.find(obj)
					.sort({ 'dateCreation': -1 })
					.where('tags').in(tags)
					.limit(maxLimit)
					.then((images) => {
						fs.readFile('./views/results.html', (err, data) => {
							let replacement = '';
							for (let image of images) {
								replacement +=
									`<fieldset id => <legend>${image.imageTitle}:</legend> 
								<img src="${image.imageUrl}">
								</img><p>${image.description}<p/>
								<button onclick='location.href="/delete?id=${image._id}"'class='deleteBtn'>Delete
								</button> 
							</fieldset>`;
							}

							let html = data.toString().replace("<div class='replaceMe'></div>", replacement);
							res.writeHead(200, {
								'content-type': 'text/html'
							});
							res.write(html);
							res.end();
						});
					});
			});
		});
	} else {
		return true;
	}
};
