/**
 * Created by irahmed on 12/20/16.
 */

define([
  "jquery", "app/config"
], function ($, config) {
  function EventsService() {
    this.url = config.url + ":8082/events";
    console.debug("Events URL :", this.url);
  }

  EventsService.prototype.events = function (name, type) {
    if (!name) {
      return Promise.reject("Missing Place Name");
    }
    return $.getJSON(this.url, {
      place: name,
      type: type
    });
  };

  return new EventsService();
});