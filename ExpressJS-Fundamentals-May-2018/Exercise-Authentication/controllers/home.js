module.exports = (req, res) => {
    let message = req.session.message;
    req.session.message = '';
    res.render('home', { message });
};