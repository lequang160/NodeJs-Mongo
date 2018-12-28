var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Vehicle = require('./app/models/vehicle');

//configure app for bodyParser()
//lets us grab data from the body of POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set up port for server to listen on
var port = process.env.PORT || 3000;

//Connect to DB
mongoose.connect('mongodb://localhost:27017/codealong');

//API Router
var router = express.Router();

//Router will all be prefixed with /api
app.use('/api', router);
//Middleware
// Middleware can be useful for doing validateons. we can log
// things from here or stop the request from continue in tge
router.use(function (req, res, next) {
    console.log('FLY... There is some processing currenly going down...');


    next();
});

// Test Route

router.get('/', function (req, res) {
    res.json({ message: 'Hello world' });
});

router.route('/vehicles')
    .post(function (req, res) {
        var vehicle = new Vehicle();
        vehicle.make = req.body.make;
        vehicle.model = req.body.model;
        vehicle.color = req.body.color;

        vehicle.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Vehicle was successfully manufactures' });

        });
    })
    .get(function (req, res) {
        Vehicle.find(function (err, vehicles) {
            if (err) {
                res.send(err);
            }
            res.json(vehicles);
        });
    });

router.route('/vehicles/:vehicle_id')
    .get(function (req, res) {
        Vehicle.findById(req.params.vehicle_id, function (err, vehicle) {
            if (err) {
                res.send(err);
            }
            res.json(vehicle);
        });
    });
router.route('/vehicles/make/:make')
    .get(function (req, res) {
        Vehicle.find({ make: req.params.make }, function (err, vehicles) {
            if (err) {
                res.send(err);
            }
            res.json(vehicles);
        });
    });

router.route('/vehicles/color/:color')
    .get(function (req, res) {
        Vehicle.find({ color: req.params.color }, function (err, vehicles) {
            if (err) {
                res.send(err);
            }
            res.json(vehicles);
        });
    });
//fire up server
app.listen(port);

//Print friendly message to console

console.log('Server listening on port ' + port);
