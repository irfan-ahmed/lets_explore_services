/**
 * Created by irahmed on 12/13/16.
 */

var when = require("when");
var request = require("request");

var API_KEY = require("../config").key;

module.exports.photos = function (params, proxy) {
  var ref = params.photo_reference;
  if (!ref) {
    return when.reject("Missing photo reference");
  }
  var width = params.width;
  var height = params.height;
  if (!width && !height) {
    height = 250;
  }

  var url = "https://maps.googleapis.com/maps/api/place/photo?photoreference=" + ref + "&key=" + API_KEY;
  if (width) {
    url += "&maxwidth=" + width;
  }
  if (height) {
    url += "&maxheight=" + height;
  }
  return when.resolve(url);
};

module.exports.sightsToSee = function (placeInfo, proxy) {
  if (!placeInfo || !placeInfo.city) {
    return when.reject("Please specify the name of city to visit");
  }
  var query = encodeURIComponent(placeInfo.city + " point of interest");
  var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query +
    "&language=en&key=" + API_KEY;
  console.log("Getting places to see for :", url, proxy);
  return when.promise(function (resolve, reject) {
    var settings = {
      url: url
    };
    if (proxy) {
      settings.proxy = proxy;
    }
    request(settings, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var data = JSON.parse(body);
        var list = data.results.filter(function (sight) {
          return (sight.photos !== undefined && (sight.rating !== undefined));
        });
        list.sort(function (p1, p2) {
          return p2.rating - p1.rating;
        });
        resolve(list);
      }
      if (error) {
        reject(error);
      }
    });
  })
};

module.exports.placeDetails = function (place, proxy) {
  var ref = place.ref;
  var settings = {
    url: "https://maps.googleapis.com/maps/api/place/details/json?reference=" + ref + "&key=" + API_KEY
  };
  if (proxy) {
    settings.proxy = proxy;
  }
  console.log("Getting Place Details: ", settings);
  return when.promise(function (resolve, reject) {
    request(settings, function (err, response, body) {
      if (err) {
        return reject(err);
      }
      if (response.statusCode === 200) {
        var data = JSON.parse(body);
        //console.log(data);
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

module.exports.timeDetails = function (location, proxy) {
  var cord = location.lat + "," + location.lng;
  var settings = {
    url: "https://maps.googleapis.com/maps/api/timezone/json?location=" + cord +
    "&timestamp=" + location.timestamp + "&key=" + API_KEY
  };
  if (proxy) {
    settings.proxy = proxy;
  }
  console.log("Getting Time: ", location, proxy, cord, settings);
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



