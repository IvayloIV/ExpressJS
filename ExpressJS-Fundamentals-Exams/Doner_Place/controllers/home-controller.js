const Product = require('../models/Product');

module.exports = {
    index: async (req, res) => {
        let message = req.session.message;
        req.session.message = '';
        let isAdmin = false;

        if (req.user) {
            isAdmin = req.user.roles.indexOf('Admin') > -1;
        }
        
        try {
            let products = await Product.find({});
            for(let product of products) {
                product.isAdmin = isAdmin;
            }
            let chickenDoner = products.filter(a => a.category === 'chicken');
            let beefDoner = products.filter(a => a.category === 'beef');
            let lambDoner = products.filter(a => a.category === 'lamb');
            res.render('home/index', { 
                message, 
                chickenDoner,
                beefDoner,
                lambDoner
            });
        }
        catch (e) {
            console.log(e);
        }
    }
};