const mongoose = require('mongoose');

module.exports = (settings) => {
    mongoose.connect(settings.dbPath, (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Database start successful!');
        require('../models/Book');
    });
};