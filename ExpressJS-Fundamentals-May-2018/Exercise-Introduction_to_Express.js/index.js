const port = 2323;
require('./config/dbConfig');

const express = require('express');
let app = express();
require('./config/express')(app);
require('./config/router')(app);

app.listen(port);