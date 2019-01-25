const Cube = require('../models/Cube');

function handleError(currentError, res, body) {
    let errors = [];

    for(let key in currentError.errors) {
        errors.push(currentError.errors[key].message);
    }

    res.locals.errors = errors;
    res.render('cube/create', body);
}

module.exports = {
    createGet: (req, res) => {
        res.render('cube/create');
    },
    createPost: (req, res) => {
        let body = req.body;
        
        Cube.create({
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
            difficulty: Number(body.difficulty)
        }).then((cube) => {
            res.redirect('/');
        }).catch((e) => handleError(e, res, body));
    },
    details: (req, res) => {
        let id = req.params.id;

        Cube.findById(id).then((cube) => {
            res.render('cube/details', cube);
        }).catch(e => {
            console.log(e);
        });
    }
};