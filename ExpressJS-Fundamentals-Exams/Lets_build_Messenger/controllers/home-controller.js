module.exports = {
    index: async (req, res) => {
        if (req.user) {
            res.redirect('/thread/all');
            return;
        }

        let message = req.session.message;
        req.session.message = '';
        
        try {
            res.render('home/index', { message });
        }
        catch (e) {
            console.log(e);
        }
    }
};