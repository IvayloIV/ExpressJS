let path = require('path');
let fs = require('fs');

const contentTypes = {
    'ico': 'image/x-icon',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'png': 'image/png',
    'jpg': 'image/jpeg',
};

module.exports = (req, res) => {
    console.log();
    if (req.path.startsWith('/public') && req.method === 'GET') {
        let pathname = path.normalize(
            path.join(__dirname, `../${req.path}`)
        );
        
        fs.readFile(pathname, (err, data) => {
            if (err) {
                res.writeHead(404, {
                    'content-type': 'text/plain'
                });

                res.write('404 not found!');
                res.end();
                return;
            }
            
            let type = pathname.split('.').pop();
            res.writeHead(200, {
                'content-type': contentTypes[type]
            });
            
            res.write(data);
            res.end();
        });
    } else {
        return true;
    }
}