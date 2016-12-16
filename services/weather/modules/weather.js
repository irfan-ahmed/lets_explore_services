/**
 * Created by irahmed on 12/14/16.
 */

var when = require("when");
var request = require("request");
var API_KEY = require("../config").keys.WEATHER;
var URL = "http://api.openweathermap.org/data/2.5/weather?appid=" + API_KEY + "&units=imperial";

module.exports.getWeather = function (place, proxy) {
  console.log("weather : ", place, proxy);
  if (!place || !place.city) {
    return when.reject("Missing place. Cannot get weather. Provide city or zip");
  }
  var url = URL;
  if (place.zip) {
    if (!place.country_code) {
      place.country_code = "us"
    }
    url += "&zip=" + place.zip + "," + place.country_code;
  } else if (place.city) {
    url += "&q=" + encodeURIComponent(place.city);
  }
  var settings = {
    url: url
  };
  if (proxy) {
    settings.proxy = proxy;
  }
  console.log("Getting Weather: ", settings);
  return when.promise(function (resolve, reject) {
    request(settings, function (err, response, body) {
      if (err) {
        return when.reject(err);
      }
      if (response.statusCode === 200) {
        var data = JSON.parse(body);
        resolve(data);
      }
    })
  })
};
