const Car = require('../models/Car');
const CarsPerPage = 4;

module.exports.createGet = (req, res) => {
    res.render('cars/create');
};

module.exports.createPost = (req, res) => {
    let car = req.body;
    let make = car.make;
    let model = car.model;
    let imageUrl = car.imageUrl;
    let color = car.color;

    if (!make || !model || !imageUrl) {
        car.message = 'Fill all inputs!';
        res.render('cars/create', car);
        return;
    }

    Car.create({ make, model, imageUrl, color }).then((car) => {
        req.session.message = 'Car created successful!';
        res.redirect('/');
    });
};

module.exports.viewAllGet = (req, res) => {
    let queryData = req.query;
    let currentPage = req.params.page;
    Car.find({ renter: undefined })
        .then((cars) => {
            let query = '';
            if (queryData.model) {
                cars = cars
                    .filter(a => a.model.toLowerCase().indexOf(queryData.model.toLowerCase()) !== -1);
                query = `?model=${queryData.model}`;
            }
            
            let pages = Math.ceil(cars.length / CarsPerPage);
            let skippedCars = (currentPage - 1) * CarsPerPage;
            cars = cars.slice(skippedCars, skippedCars + CarsPerPage);
            let totalPages = [];
            for(let i = 1; i <= pages; i++) {
                totalPages.push({ number: i, query});
            }
            res.render('cars/all', { cars, totalPages, model: queryData.model });
        });
};

module.exports.viewAllPost = (req, res) => {
    res.redirect(`/cars/1/all/?model=${req.body.model}`);
};

module.exports.editCarGet = (req, res) => {
    let id = req.params.id;

    Car.findById(id).then(car => {
        res.render('cars/edit', car);
    });
};

module.exports.editCarPost = (req, res) => {
    let car = req.body;
    let make = car.make;
    let model = car.model;
    let imageUrl = car.imageUrl;
    let color = car.color;
    let id = req.params.id;
    car._id = id;

    if (!make || !model || !imageUrl) {
        car.message = 'Fill all inputs!';
        res.render('cars/edit', car);
        return;
    }

    Car.findById(id).then(car => {
        car.make = make;
        car.model = model;
        car.imageUrl = imageUrl;
        car.color = color;

        car.save().then(() => {
            req.session.message = 'Edited successful';
            res.redirect('/');
        });
    });
};

module.exports.rentGet = (req, res) => {
    let id = req.params.id;

    Car.findById(id).then((car) => {
        res.render('cars/rent', car);
    });
};

module.exports.rentPost = (req, res) => {
    let idCar = req.params.id;

    Car.findById(idCar).then((car) => {
        car.renter = req.user._id;
        car.save().then(() => {
            req.user.rentedCars.push(car._id);
            req.user.save().then(() => {
                req.session.message = 'Car rented successful';
                res.redirect('/');
            });
        });
    });
};