const qs = require('querystring');
const Tag = require('../models/Tag');

module.exports = (req, res) => {
    if (req.pathname === '/generateTag' && req.method === 'POST') {
        let queryString = '';
        
        req.on('data', (data) => {
            queryString += data;
        });

        req.on('end', () => {
            let body = qs.parse(queryString);
            
            Tag.create({ 'name': body.tagName }).then(() => {
                res.writeHead(302, {
                    'Location': '/'
                });
                
                res.end();
            });
        });
    } else {
        return true;
    }
};