const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    res.writeHead(200, {
        'content-type': 'image/jpg'
    });

    let imagePath = req.pathname.split('/').slice(2).join('/');
    let fullPath = path.resolve(__dirname, '../' + imagePath);
    fs.createReadStream(fullPath).pipe(res);
};