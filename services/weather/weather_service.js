/**
 * Created by irahmed on 12/12/16.
 */

var express = require('express');
var bodyParser = require("body-parser");
var options = require("minimist")(process.argv.slice(2));
var utils = require("service-utils");
var config = require("./config");

var weather = require("./modules/weather")(utils.getAPIKey("weather"), options);

var app = express();
// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.get("/weather", function (req, res) {
  var key = utils.normalizeKey(req.url);
  utils.fromRedis(key).then(function (value) {
    console.log("Value from redis", key, value);
    res.json(value);
  }).catch(function () {
    console.log("could not get key from redis");
    weather.getWeather(req.query).then(function (weatherData) {
      res.json(weatherData);
      if (weatherData) {
        utils.toRedis(key, weatherData, config.key_expiry);
      }
    }).catch(function (e) {
      res.status(500).json({error: e});
    })
  })
});

app.listen(config.port, function () {
  console.log('Weather service app listening on port %d', config.port);
});

