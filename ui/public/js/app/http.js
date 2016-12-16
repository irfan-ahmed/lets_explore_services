/**
 * Created by irahmed on 12/12/16.
 */

define([
  "jquery"
], function ($) {
  function Service() {
    this.url = "/api/";
  }

  Service.prototype.get = function (command, data) {
    if (!command) {
      return Promise.reject("Command is missing");
    }

    if (command.charAt(0) === "/") {
      command = command.substring(1);
    }

    var url = this.url + command;

    return new Promise(function (resolve, reject) {
      $.get(url, data).done(function (response) {
        resolve(response)
      }).fail(function (e) {
        console.error(url, data, e);
        reject(e);
      });
    })
  };

  return new Service();
});