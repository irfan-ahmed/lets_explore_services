/**
 * Created by irahmed on 12/20/16.
 */

define([
  "jquery", "app/config"
], function ($, config) {
  function WeatherService() {
    this.url = config.url + ":8081/weather";
    console.debug("WeatherService URL: ", this.url);
  }

  WeatherService.prototype.weather = function (place) {
    return $.getJSON(this.url, {place: place});
  };

  return new WeatherService();
});