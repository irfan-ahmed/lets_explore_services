/**
 * Created by irahmed on 12/12/16.
 */

var express = require('express');
var bodyParser = require("body-parser");
var utils = require("service-utils");
var options = require("minimist")(process.argv.slice(2));
var config = require("./config");
var places = require("./modules/places")(utils.getAPIKey("places"), config);

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

app.get('/places/sights', function (req, res) {
  var key = utils.normalizeKey(req.url);
  console.log("redis key", key);
  utils.fromRedis(key).then(function (sights) {
    console.log("data from redis", sights);
    res.json(sights);
  }).catch(function (e) {
    places.sightsToSee(req.query, options.proxy).then(function (results) {
      if (results && results.length) {
        utils.toRedis(key, results);
      }
      res.json(results);
    }).catch(function (e) {
      res.status(500).json({error: e});
    });
  })
});

app.get("/places/details", function (req, res) {
  var key = utils.normalizeKey(req.url);
  utils.fromRedis(key).then(function (details) {
    res.json(details);
  }).catch(function () {
    places.placeDetails(req.query, options.proxy).then(function (details) {
      if (details) {
        utils.toRedis(key, details, config.key_expiry);
      }
      res.json(details);
    }).catch(function (e) {
      res.status(500).json({error: e});
    })
  })

});

app.get("/places/photos", function (req, res) {
  places.photos(req.query, options.proxy).then(function (url) {
    res.json({src: url});
  }).catch(function (e) {
    console.log("error in photos", e);
    res.status(500).json({error: e});
  })
});

app.listen(config.port, function () {
  console.log('Places service app listening on port %d!', config.port)
});

