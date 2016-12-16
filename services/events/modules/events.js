/**
 * Created by irahmed on 12/14/16.
 */
var when = require("when");
var request = require("request");

var API_KEY = require("../config").keys.EVENTS;

module.exports.listEvents = function (place, proxy) {
  if (!place || !place.city) {
    return when.reject("Missing place information");
  }
  console.log("Getting Events: ", place);
  var location = encodeURIComponent(place.city);
  var url = "http://api.eventful.com/json/events/search?location=" + location + "&date=Future&app_key=" + API_KEY +
    "&page_size=15";
  if (place.type) {
    url += "&q=" + place.type;
  }
  var settings = {
    url: url
  };
  if (proxy) {
    settings.proxy = proxy;
  }
  console.log("Settings: ", settings);
  return when.promise(function (resolve, reject) {
    request(settings, function (err, response, body) {
      if (err) {
        return reject(err);
      }
      if (response.statusCode === 200) {
        var data = JSON.parse(body);
        var list = (data && data.events && data.events.event) || [];
        var events = list.map(function (event) {
          return {
            url: event.url,
            city: event.city_name,
            title: event.title,
            venue: {
              name: event.venue_name,
              address: event.venue_address,
              url: event.venue_url
            }
          }
        });
        resolve(events);
      }
    })
  })
};
