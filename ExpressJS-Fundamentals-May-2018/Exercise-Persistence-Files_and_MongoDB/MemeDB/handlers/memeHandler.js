const viewAll = require('./viewAllMemes');
const viewAddMeme = require('./viewAddMeme');
const getDetails = require('./getDetails');
const addMeme = require('./addMeme');
const sendFile = require('./sendFile');

module.exports = (req, res) => {
    if (req.pathname === '/viewAllMemes' && req.method === 'GET') {
        viewAll(req, res);
    } else if (req.pathname === '/addMeme' && req.method === 'GET') {
        viewAddMeme(req, res);
    } else if (req.pathname === '/addMeme' && req.method === 'POST') {
        addMeme(req, res);
    } else if (req.pathname.startsWith('/getDetails') && req.method === 'GET') {
        getDetails(req, res);
    } else if (req.pathname.startsWith('/sendFile') && req.method === 'GET') {
        sendFile(req, res);
    } else {
        return true;
    }
};