/**
 * Created by irahmed on 12/13/16.
 */

var when = require("when");
var request = require("request");

function PlacesService(API_KEY, options) {
  this.API_KEY = API_KEY;
  this.options = options;
  this.placesURL = "https://maps.googleapis.com/maps/api/place/textsearch/json??language=en&key=" + API_KEY;
  this.photosURL = "https://maps.googleapis.com/maps/api/place/photo?key=" + API_KEY;
  this.detailsURL = "https://maps.googleapis.com/maps/api/place/details/json?key=" + API_KEY;
  this.tzURL = "https://maps.googleapis.com/maps/api/timezone/json?key=" + API_KEY;

  this.settings = {};
  if (options.proxy) {
    this.settings.proxy = options.proxy;
  }
}

PlacesService.prototype.sightsToSee = function (placeInfo) {
  if (!placeInfo || !placeInfo.place) {
    return when.reject("Please specify the name of place to visit");
  }
  var query = encodeURIComponent(placeInfo.place + " point of interest");
  var settings = Object.assign({}, this.settings, {
    url: this.placesURL + "&query=" + query
  });
  console.log("Getting places to see for :", placeInfo, settings);
  return when.promise(function (resolve, reject) {
    request(settings, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log("Data from google", body);
        var data = JSON.parse(body);
        var list = [];
        if (data.results && data.results.length) {
          list = data.results.filter(function (sight) {
            return (sight.photos !== undefined && (sight.rating !== undefined));
          });
          list.sort(function (p1, p2) {
            return p2.rating - p1.rating;
          });
        }
        resolve(list);
      }
      if (error) {
        reject(error);
      }
    });
  })
};

PlacesService.prototype.photos = function (params) {
  var ref = params.photo_reference;
  console.log("photos: ", ref);
  if (!ref) {
    return when.reject("Missing photo reference");
  }
  var width = params.width;
  var height = params.height;
  if (!width && !height) {
    height = 250;
  }

  var url = this.photosURL + "&photoreference=" + ref;
  if (width) {
    url += "&maxwidth=" + width;
  }
  if (height) {
    url += "&maxheight=" + height;
  }
  return when.resolve(url);
};

PlacesService.prototype.placeDetails = function (place) {
  var ref = place.ref;
  var settings = Object.assign({}, this.settings, {
    url: this.detailsURL + "&reference=" + ref
  });
  console.log("Getting Place Details: ", place, settings);
  return when.promise(function (resolve, reject) {
    request(settings, function (err, response, body) {
      if (err) {
        return reject(err);
      }
      if (response.statusCode === 200) {
        var data = JSON.parse(body);
        if (data && data.status !== "OK") {
          return reject(data);
        }
        var details = {
          url: data.result.url,
          offset: data.result.utc_offset,
          location: data.result.geometry.location
        };
        data.result.address_components.forEach(function (comp) {
          if (comp.types.indexOf("locality") !== -1) {
            details.city = comp.long_name;
          }
          if (comp.types.indexOf("country") !== -1) {
            details.country = comp.long_name;
            details.country_code = comp.short_name;
          }
          if (comp.types.indexOf("postal_code") !== -1) {
            details.zip = comp.short_name;
          }
          if (comp.types.indexOf("administrative_area_level_1") !== -1) {
            details.state = comp.long_name;
            details.state_code = comp.short_name;
          }
        });
        resolve(details);
      }
    })
  })
};

PlacesService.prototype.timeDetails = function (location) {
  var cord = location.lat + "," + location.lng;
  var settings = Object.assign({}, this.settings, {
    url: this.tzURL + "&location=" + cord + "&timestamp=" + location.timestamp
  });
  console.log("Getting Time: ", location, settings);
  return when.promise(function (resolve, reject) {
    request(settings, function (err, response, body) {
      console.log(err, response.statusCode, body);
      if (err) {
        return reject(err);
      }
      if (response.statusCode === 200) {
        var data = JSON.parse(body);
        var localTime = location.timestamp + data.dstOffset + data.rawOffset;
        resolve({
          localTime: localTime,
          id: data.timeZoneId,
          name: data.timeZoneName
        })
      }
    })
  })
};

module.exports = function (API_KEY, config) {
  return new PlacesService(API_KEY, config);
};


