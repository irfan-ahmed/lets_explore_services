/**
 * Created by irahmed on 12/12/16.
 */

define([
  "jquery", "app/places", "app/Tile", "app/EventTile"
], function ($, Places, Tile, EventTile) {
  var $place = $("#place");
  var $loader = $("#loader");
  var $eventsLoader = $("#eventsLoader");
  var $weatherLoader = $("#weatherLoader");
  var placesContainer = $("#placesContainer");
  var eventsContainer = $("#eventsContainer");
  var weatherContainer = $("#weatherContainer");
  var placeInfoContainer = $("#placeInfoContainer");

  $("#search").keypress(function (e) {
    if (e.which === 13) {
      var place = $(this).val();
      renderPlaces(place);
      renderEvents(place);
    }
  });

  function renderPlaces(place) {
    placesContainer.find(".tile").remove();
    $loader.show();

    // fetch weather for the places shown
    // handles the case where duplicate cities are found
    weatherContainer.find(".temp").remove();
    weatherContainer.find(".desc").remove();
    $weatherLoader.show();
    weatherContainer.css("visibility", "visible");

    Places.listSights(place).then(function (results) {
      $loader.hide();
      console.debug("Got Places: ", results);
      if (results.list && results.list.length) {
        renderWeather(results.list[0].formatted_address);
        var tiles = [];
        results.list.forEach(function (placeData, index) {
          var tile = new Tile(placeData, $("#placesContainer"), place);
          tile.render();
          tiles.push(tile);
        });
        renderPlaceDetails(tiles);
      }
    })
  }

  function renderPlaceDetails(tiles) {
    var index = 0;

    function getDetails(tile) {
      return new Promise(function (resolve, reject) {
        tile.getDetails().then(function (details) {
          placeDetails = (details.city && details.state && details.country);
          if (placeDetails) {
            tile.renderPlaceInfo(details, placeInfoContainer).then(function () {
              resolve();
            }).catch(function (e) {
              reject(e);
            });
          } else {
            reject();
          }
        })
      })
    }

    function check() {
      getDetails(tiles[index]).then(function () {
        console.debug("Closing at index : ", index);
      }).catch(function () {
        index++;
        if (index <= tiles.length) {
          check();
        }
      })
    }

    check();
  }

  function renderEvents(place) {
    eventsContainer.find(".event").remove();
    eventsContainer.find(".error").remove();
    $eventsLoader.show();
    eventsContainer.css("visibility", "visible");
    Places.listEvents(place).then(function (data) {
      console.debug("Got Events for", place, data);
      data.events.forEach(function (event) {
        var eventRow = new EventTile(event, eventsContainer);
        eventRow.render();
      });
      if (!data.events.length) {
        var noevents = $("<div/>").addClass("error").text("Oops.. There are no events available for this" +
          " location.");
        eventsContainer.append(noevents);
      }
      $eventsLoader.hide();
    })
  }

  function renderWeather(place) {
    Places.getWeather(place).then(function (data) {
      var temp = $("<div/>").addClass("temp").text(parseInt(data.weather.main.temp));
      temp.append($("<span/>").addClass("degrees").html("&deg;F"));
      weatherContainer.append(temp);

      var description = data.weather.weather.map(function (desc) {
        var text = desc.main;
        if (desc.description && (desc.main.toLowerCase().trim() != desc.description.toLowerCase().trim())) {
          text += ", " + desc.description;
        }
        return text;
      });
      weatherContainer.append($("<div/>").addClass("desc").text(description.join(", ")));
      $weatherLoader.hide();
    })
  }
});