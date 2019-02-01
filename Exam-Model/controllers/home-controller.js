module.exports = {
    index: async (req, res) => {
        try {
            res.render('home/index');
        }
        catch (e) {
            console.log(e);
        }
    }
};