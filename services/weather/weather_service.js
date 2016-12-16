/**
 * Created by irahmed on 12/12/16.
 */

var express = require('express');
var bodyParser = require("body-parser");
var weather = require("./modules/weather");
var options = require("minimist")(process.argv.slice(2));
var config = require("./config");

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.get("/weather", function (req, res) {
  weather.getWeather(req.query, options.proxy).then(function (weatherData) {
    res.json({weather: weatherData});
  }).catch(function (e) {
    res.status(500, {error: e});
  })
});

app.listen(config.port, function () {
  console.log('Weather service app listening on port %d', config.port);
});

