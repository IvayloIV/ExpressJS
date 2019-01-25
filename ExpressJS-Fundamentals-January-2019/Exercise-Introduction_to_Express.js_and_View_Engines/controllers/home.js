const Cube = require('../models/Cube');

module.exports = {
    index: (req, res) => {
        Cube.find({})
            .sort({ difficulty: 1 })
            .then(cubes => {
                res.render('index', { cubes });
            }).catch(e => console.log(e));
    },
    about: (req, res) => {
        res.render('about');
    },
    search: async (req, res) => {
        let body = req.body;
        let name = body.name;
        let from = Number(body.from);
        let to = Number(body.to);

        let errors = [];

        if (body.from !== '' && (from < 1 || from > 6)) {
            errors.push('From must be between 1 and 6.');
        }

        if (body.to !== '' && (to < 1 || to > 6)) {
            errors.push('To must be between 1 and 6.');
        }

        if (body.from !== '' && body.to !== '' && from > to) {
            errors.push('From must be lower then to.');
        }

        if (errors.length >= 1) {
            let cubes = await Cube.find({}).sort({ difficulty: 1 });
            res.render('index', { cubes, errors });
            return;
        }

        let allCubes = Cube.find({});

        if (body.from !== '') {
            allCubes.where('difficulty').gte(from);
        }

        if (body.to !== '') {
            allCubes.where('difficulty').lte(to);
        }

        allCubes
            .sort({ difficulty: 1 })
            .then((cubes) => {
                if (name !== '') {
                    cubes = cubes.filter(a => a.name.toLowerCase().indexOf(name.toLowerCase()) !== -1);
                }

                res.render('index', { cubes });
            }).catch(e => {
                console.log(e);
            });
    }
};