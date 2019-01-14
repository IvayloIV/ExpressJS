const settings = require('./config/settings');
const environment = 'development';
require('./config/dbConfig')(settings[environment]);
const express = require('express');
let app = express();

require('./config/express')(app);
require('./config/router')(app);
require('./config/passport')();

app.listen(settings[environment].port);