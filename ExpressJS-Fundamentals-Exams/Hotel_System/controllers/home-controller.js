const apiHotel = require('../api/hotel');

module.exports = {
    index: async (req, res) => {
        try {
            let hotels = await apiHotel.getAll();
            if (req.user) {
                for (let hotel of hotels) {
                    if (hotel.likes.indexOf(req.user.id) > -1) {
                        hotel.isLiked = true;
                    }
                }
            }
            res.render('home/index', { hotels: hotels.slice(0, 20) });
        }
        catch (e) {
            console.log(e);
        }
    },
    about: (req, res) => {
        res.render('home/about');
    }
};