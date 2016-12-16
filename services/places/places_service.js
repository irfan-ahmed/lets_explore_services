/**
 * Created by irahmed on 12/12/16.
 */

var express = require('express');
var bodyParser = require("body-parser");
var places = require("./modules/places");
var options = require("minimist")(process.argv.slice(2));
var config = require("./config");

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

app.get('/places/sights', function (req, res) {
  places.sightsToSee(req.query, options.proxy).then(function (results) {
    res.json({place: req.query.place, list: results});
  }).catch(function (e) {
    res.status(500, {place: req.query.place, error: e});
  });
});

app.get("/places/details", function (req, res) {
  places.placeDetails(req.query, options.proxy).then(function (details) {
    res.json(details);
  }).catch(function (e) {
    res.status(500, {error: e});
  })
});

app.get("/places/time", function (req, res) {
  places.timeDetails(req.query, options.proxy).then(function (details) {
    res.json(details);
  }).catch(function (e) {
    res.status(500, {error: e});
  })
});

app.get("/places/photos", function (req, res) {
  places.photos(req.query, options.proxy).then(function (url) {
    res.json({src: url});
  }).catch(function (e) {
    res.status(500, {error: e});
  })
});

app.listen(config.port, function () {
  console.log('Places service app listening on port %d!', config.port)
});

