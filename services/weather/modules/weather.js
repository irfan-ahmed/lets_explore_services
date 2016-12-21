/**
 * Created by irahmed on 12/14/16.
 */

var when = require("when");
var request = require("request");

function WeatherService(API_KEY, options) {
  this.settings = {};
  if (options.proxy) {
    this.settings.proxy = options.proxy;
  }
  this.URL = "http://api.openweathermap.org/data/2.5/weather?appid=" + API_KEY + "&units=imperial";
}

WeatherService.prototype.getWeather = function (place) {
  if (!place || !place.place) {
    return when.reject("Missing place name. Cannot get weather. Provide name or zip");
  }
  var url = this.URL;
  if (place.zip) {
    if (!place.country_code) {
      place.country_code = "us"
    }
    url += "&zip=" + place.zip + "," + place.country_code;
  } else if (place.place) {
    url += "&q=" + encodeURIComponent(place.place);
  }
  var settings = Object.assign({}, this.settings, {
    url: url
  });
  console.log("Getting Weather: ", place, settings);
  return when.promise(function (resolve, reject) {
    request(settings, function (err, response, body) {
      if (err) {
        console.log("Error in getting weather", settings, err);
        return reject(err);
      }
      if (response.statusCode === 200) {
        var data = JSON.parse(body);
        resolve(data);
      }
    })
  })
};

module.exports = function (API_KEY, config) {
  return new WeatherService(API_KEY, config);
};