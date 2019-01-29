const path = require('path');
const shortid = require('shortid');
const fs = require('fs');
const Car = require('../models/Car');
const Rent = require('../models/Rent');

module.exports = {
    addGet: (req, res) => {
        res.render('car/add');
    },
    addPost: async (req, res) => {
        let body = req.body;

        if (body.pricePerDay === '') {
            body.error = 'Fill all fields';
            res.render('car/add', body);
            return;
        }

        let file = req.files.image;
        const name = shortid.generate();
        const filePath = `/images/${name}.jpg`;
        const fullPath = path.join(__dirname, `../static${filePath}`);
        file.mv(fullPath, async (err) => {
            try {
                await Car.create({
                    model: body.model,
                    imageUrl: filePath,
                    pricePerDay: Number(body.pricePerDay)
                });

                req.session.success = 'Successful created!';
                res.redirect('/car/all');
            } catch (err) {
                body.error = err.message;
                res.render('car/add', body);
            }
        });
    },
    all: async (req, res) => {
        try {
            const cars = await Car.find({ isRented: false });
            res.render('car/all', { cars });
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    },
    search: async (req, res) => {
        const model = req.body.model;
        let obj = { isRented: false };
        if (model !== '') {
            obj['model'] = { $regex: model };
            obj['model']['$options'] = 'i';
        }

        try {
            const cars = await Car.find(obj);
            res.render('car/all', { cars, model });
        } catch (err) {
            console.log(err);
        }
    },
    rentGet: async (req, res) => {
        let id = req.params.id;

        try {
            let car = await Car.findById(id);
            res.render('car/rent', car);
        } catch (err) {
            console.log(err);
        }
    },
    rentPost: async (req, res) => {
        let idCar = req.params.id;
        let body = req.body;

        try {
            await Rent.create({
                days: Number(body.days),
                car: idCar,
                owner: req.user.id
            });
            let car = await Car.findById(idCar);
            car.isRented = true;
            await car.save();
            req.session.success = 'Car rented successful!';
            res.redirect('/car/all');
        } catch (err) {
            body.error = err.message;
            body._id = idCar;
            res.render('car/rent', body);
        }
    },
    editGet: async (req, res) => {
        let id = req.params.id;

        try {
            let car = await Car.findById(id);
            res.render('car/edit', car);
        } catch (err) {
            console.log(err);
        }
    },
    editPost: async (req, res) => {
        let id = req.params.id;
        let body = req.body;

        try {
            let car = await Car.findById(id);

            if (req.files.image) {
                let oldImagePath = path.join(__dirname, `../static/${car.imageUrl}`);
                fs.unlink(oldImagePath, () => {
                    let file = req.files.image;
                    const name = shortid.generate();
                    const filePath = `/images/${name}.jpg`;
                    const fullPath = path.join(__dirname, `../static${filePath}`);

                    file.mv(fullPath, async (err) => {
                        car.model = body.model;
                        car.imageUrl = filePath;
                        car.pricePerDay = Number(body.pricePerDay);
                        await car.save();
                        req.session.success = 'Edited successful!';
                        res.redirect('/car/all');
                    });
                });
            } else {
                car.model = body.model;
                car.pricePerDay = Number(body.pricePerDay);
                await car.save();
                req.session.success = 'Edited successful!';
                res.redirect('/car/all');
            }

        } catch (err) {
            body._id = id;
            body.error = err.message;
            res.render('car/edit', body);
        }
    }
};