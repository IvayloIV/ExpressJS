const port = 2323;
require('./config/dbConfig');

const express = require('express');
const handlebars = require('express-handlebars');
let app = express();
app.engine('.hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials'
}));
app.set('view engine', '.hbs');

require('./config/express')(app);
require('./config/router')(app);

app.listen(port);