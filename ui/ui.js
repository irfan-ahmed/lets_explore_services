/**
 * Created by irahmed on 12/12/16.
 */

var express = require('express');
var bodyParser = require("body-parser");
var config = require("./config");

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
// static content
app.use("/explorer/", express.static("public"));

app.listen(config.port, function () {
  console.log('Explorer UI listening on port %d!', config.port);
});

