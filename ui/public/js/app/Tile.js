/**
 * Created by irahmed on 12/13/16.
 */

define([
  "jquery", "app/places"
], function ($, Places) {
  function Tile(params, container, place) {
    if (!container) {
      throw new Error("Missing container for tile");
    }
    $.extend(true, this, params);
    this.container = container;
    this._place = place;
    this.tile = $("<div/>").addClass("tile");

    console.debug("Tile: ", this.name, this.container, params);
    if (this.photos && this.photos.length) {
      var photoData = this.photos[0];
      var self = this;
      Places.getPhotos(photoData).then(function (data) {
        self.tile.css("background-image", "url(" + data.src + ")");
      })
    }
  }

  Tile.prototype.render = function ($container) {
    var caption = $("<div/>").addClass("caption");

    // place name
    caption.append($("<span/>").addClass("label").text(this.name));

    // place rating
    var rating = $("<span/>").addClass("rating");
    var starRating = Math.round(this.rating);
    for (var i = 0; i < 5; i++) {
      var star = $("<span/>").addClass("star").html("&#9734;");
      if (i <= starRating) {
        star.addClass("filled");
      }
      rating.append(star);
    }
    caption.append(rating);

    // icon
    if (this.icon) {
      var icon = $("<img/>").addClass("icon").attr("src", this.icon);
      if (this.types) {
        icon.attr("title", this.types.join(", "));
      }
      this.tile.append(icon);
    }

    this.tile.append(caption);
    this.container.append(this.tile);
    var self = this;
    this.tile.on("mouseover", function () {
      //console.debug("Mouse is over:", self.name);
    });

    this.tile.on("click", function (e) {
      e.preventDefault();
      var url = "https://www.google.com/maps/place/" + self.name + " " + self.formatted_address;
      //console.debug(self.name, url);
      window.open(url);
    })
  };

  Tile.prototype.getDetails = function () {
    // place details...
    if (!this.reference) {
      return Promise.reject("No Reference Availble");
    }
    var ref = this.reference;
    return new Promise(function (resolve, reject) {
      Places.getDetails({ref: ref}).then(function (details) {
        resolve(details);
      }).catch(function (e) {
        reject(e);
      })
    })
  };

  Tile.prototype.renderPlaceInfo = function (details, infoContainer) {
    infoContainer.empty();
    var place = [details.city, details.state, details.country];
    var placeInfo = $("<span/>").addClass("place-info").text(place.join(", "));
    infoContainer.append(placeInfo);

    var location = $.extend({}, this.geometry.location);
    location.timestamp = new Date().getTime();

    /*return new Promise(function (resolve, reject) {
      Places.getTimeDetails(location).then(function (details) {
        infoContainer.append($("<span/>").addClass("time").text(new Date(details.localTime).toString()));
        resolve();
      }).catch(function (e) {
        reject(e);
      })
    })*/
    return Promise.resolve();
  };

  return Tile;
});