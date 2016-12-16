/**
 * Created by irahmed on 12/14/16.
 */

define([
  "jquery"
], function ($) {
  function EventTile(params, container) {
    $.extend(true, this, params);
    this.container = container;
  }

  EventTile.prototype.render = function () {
    var row = $("<div/>").addClass("event");
    row.append($("<h4/>").text(this.title));
    row.append($("<div/>").addClass("address").text(this.venue.name + ", " + this.venue.address));

    var self = this;
    row.on("click", function (e) {
      e.stopPropagation();
      window.open(self.url);
    });

    this.container.append(row);
  };

  return EventTile;
});
