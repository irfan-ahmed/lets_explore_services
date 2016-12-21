/**
 * Created by irahmed on 12/21/16.
 */

define([
  "jquery", "app/config"
], function ($, config) {
  function PlacesService() {
    this.url = config.url + ":8083/places";
    console.debug("PlacesService URL: ", this.url);
  }

  PlacesService.prototype.sights = function (place) {
    var url = this.url + "/sights";
    return $.getJSON(url, {place: place});
  };

  PlacesService.prototype.details = function (reference) {
    var url = this.url + "/details";
    return $.getJSON(url, {ref: reference});
  };

  PlacesService.prototype.timeDetails = function (location) {
    var url = this.url + "/tzdetails";
    return $.getJSON(url, {location: location});
  };

  PlacesService.prototype.photos = function (data) {
    data.height = 250;
    var url = this.url + "/photos";
    return $.getJSON(url, data);
  };

  return new PlacesService();
});