const apiImage = require('../api/image');

module.exports = {
    index: async (req, res) => {
        try {
            const images = await apiImage.get100();
            res.render('home/index', { images });
        }
        catch (e) {
            console.log(e);
        }
    }
};