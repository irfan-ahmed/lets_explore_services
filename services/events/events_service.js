/**
 * Created by irahmed on 12/12/16.
 */

var express = require('express');
var bodyParser = require("body-parser");
var utils = require("service-utils");

var options = require("minimist")(process.argv.slice(2));
var config = require("./config");
var events = require("./modules/events")(utils.getAPIKey("events"), options);

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

app.get("/events", function (req, res) {
  var key = req.url;
  utils.fromRedis(key).then(function (events) {
    res.json(events);
  }).catch(function () {
    events.listEvents(req.query).then(function (events) {
      if (events && events.length) {
        utils.toRedis(key, events, config.key_expiry);
      }
      res.json(events);
    }).catch(function (e) {
      res.status(500, {error: e});
    })
  })
});

app.listen(config.port, function () {
  console.log('Events service app listening on port %d!', config.port);
});

