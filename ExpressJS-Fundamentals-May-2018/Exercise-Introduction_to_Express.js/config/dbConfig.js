const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/MemeDB';
mongoose.Promise = global.Promise;

mongoose.connect(connectionString);

require('../models/Genre');
require('../models/Meme');