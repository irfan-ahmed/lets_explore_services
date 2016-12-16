## Things To Do
A simple service that takes a place name as the input and shows things to do at that place.

The UI lists the following:
* Local Sights to visit
* Events
* Weather

### Design of the Application
The application is a simple nodejs application with an HTML5 front-end. The application is hosted on [Google Cloud
Platform](https://cloud.google.com).

#### Backend Services
The backend is a nodejs application using express to serve the APIs and request to actually make calls to the various
 thridparty services hosted on the net. The following APIs are available for use

 1. __/api/place/thingstodo__
    * The API takes the name of a place as input and outputs a JSON that has a list of places that you can visit.
    This uses the [Google Places API - Text Search](https://developers.google
    .com/places/web-service/search#TextSearchRequests) to get the details for the city.
 2. __/api/place/details__
    * The API takes the reference of a place as input. The reference is one of the parameters returned from the
    thingstodo API. The output is details such as address, location, city, state, country and so on for that place.
    The services uses the [Google Places API - Place Details](https://developers.google
    .com/places/web-service/details) to get the details about a place.
 3. __/api/place/photos__
    * The API takes the reference of a photo as input. The photo reference is part of the output from the thingstodo
    API. The API returns a URL to the photo that can be used in the UI to show a referenced picture for the place.
    The service uses the [Google Places API - Place Photos](https://developers.google.com/places/web-service/photos)
    to get the photos for a place.
 4. __/api/place/weather__
    * The API takes the name of the city or the zip code as the input and tries to show the weather for that place.
    The return is a JSON object containing information about the weather. The service uses the [OpenWeatherMap API -
    Current Weather](http://openweathermap.org/current) to get information about the weather for a place.
 5. __/api/place/events__
    * The API takes the city name as the input. The output is a JSON list of events happening in that place. The
    services uses the [Eventful API](http://api.eventful.com/docs) to get information about the events for a place.

#### Front-end UI
The front-end UI is a simple HTML/CSS/jQuery application. The UI has the following sections
  * __Input Search__: The input field is the place where you will set the name of the place that you plan to visit.
  You can be more specific by adding the state or country to get more specific place results.
  * __Places Section__: The section will list the places that were found to visit in that city. The places are sorted
   using the rating for the place. Clicking on the place name shows the point on google maps.
  * __Events Section__: The events section lists the events with thier addresses happening in and around the city set
   in the input search. Clicking on the event name takes you to the event site.
  * __Weather Section__: The section shows the weather for the city in the input search.

