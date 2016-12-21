/**
 * Created by irahmed on 12/14/16.
 */
var when = require("when");
var request = require("request");

function EventsService(API_KEY, options) {
  this.API_KEY = API_KEY;
  this.url = "http://api.eventful.com/json/events/search?app_key=" + API_KEY;
  this.settings = {};
  if (options && options.proxy) {
    this.settings.proxy = options.proxy;
  }
}

EventsService.prototype.listEvents = function (params) {
  if (!params || !params.place) {
    return when.reject("Missing place name information");
  }
  var location = encodeURIComponent(params.place);
  var url = this.url + "&location=" + location + "&date=Future" + "&page_size=15";
  if (params.type) {
    url += "&q=" + params.type;
  }
  var settings = Object.assign({}, this.settings, {
    url: url
  });
  console.log("Getting Events: ", params, settings);
  return when.promise(function (resolve, reject) {
    request(settings, function (err, response, body) {
      if (err) {
        return reject(err);
      }
      if (response.statusCode === 200) {
        var data = JSON.parse(body);
        var list = (data && data.events && data.events.event) || [];
        if (!list.length) {
          return resolve(list);
        }
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

module.exports = function (API_KEY, config) {
  return new EventsService(API_KEY, config);
};
