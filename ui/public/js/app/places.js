/**
 * Created by irahmed on 12/12/16.
 */

define([
  "jquery", "app/http"
], function ($, http) {
  function Places() {
  }

  Places.prototype.getWeather = function (place) {
    return http.get("/weather", {city: place});
  };

  Places.prototype.listSights = function (place) {
    return http.get("/place/thingstodo", {place: place});
  };

  Places.prototype.getDetails = function (place) {
    console.debug("/api/place/details", place);
    return http.get("/place/details", place);
  };

  Places.prototype.getTimeDetails = function (location) {
    console.debug("/api/place/time", location);
    return http.get("/place/time", location);
  };

  Places.prototype.getPhotos = function (data) {
    data.height = 250;
    return http.get("/photos", data)
  };

  Places.prototype.listEvents = function (place, type) {
    return http.get("/events", {
      city: place,
      type: type
    })
  };

  return new Places();
});