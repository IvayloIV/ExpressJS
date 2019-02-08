const apiThread = require('../api/thread');

module.exports = {
    index: async (req, res) => {
        try {
            const threads = await apiThread.last20();
            res.render('home/index', { threads });
        }
        catch (e) {
            console.log(e);
        }
    }
};