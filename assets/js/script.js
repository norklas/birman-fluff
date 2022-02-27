var apiKey = "704210508ac4b5ba6d3818353b3a15d4";
var savedSearches = [];
var searchInputEl = $("#city-input");
var searchFormEl = $("#user-form");
var searchHistoryEl = $("#history");
var currentWeatherDiv = $("#current-weather");
var currentTitleCont = $("#current-title-container");

// List of previously searched cities

function searchHistoryList(cityName) {
  $('#history:contains("' + cityName + '")').remove();

  // Create entry with city name
  var searchHistoryEntry = $("<button>");
  searchHistoryEntry.addClass(
    "bg-gray-400 rounded-md text-white h-8 w-80 mt-2"
  );
  searchHistoryEntry.text(cityName);

  // Append entry to container
  searchHistoryEl.append(searchHistoryEntry);

  if (savedSearches.length > 0) {
    // update savedSearches array with previously saved searches
    var previousSavedSearches = localStorage.getItem("savedSearches");
    savedSearches = JSON.parse(previousSavedSearches);
  }

  // add city name to array of saved searches
  savedSearches.push(cityName);
  localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

  // Reset search
  searchInputEl.val("");
}

function loadSearchHistory() {
  // Get saved search history
  var savedSearchHistory = localStorage.getItem("savedSearches");

  // return false if there is no previous searches
  if (!savedSearchHistory) {
    return false;
  }

  // turn saved search history string into array
  savedSearchHistory = JSON.parse(savedSearchHistory);

  // Loop savedSearchHistory array and make entry for each item in the list
  for (var i = 0; i < savedSearchHistory.length; i++) {
    searchHistoryList(savedSearchHistory[i]);
  }
}

function currentWeather(cityName) {
  // Get and use data from API
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  )
    // get response and turn it into objects
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      // get city's longitude and latitude
      var cityLon = response.coord.lon;
      var cityLat = response.coord.lat;

      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
      )
        // get response from one call api and turn it into objects
        .then(function (response) {
          return response.json();
        })
        // get data from response and apply them to the current weather section
        .then(function (response) {
          searchHistoryList(cityName);

          // Add classes to current weather div
          currentWeatherDiv.addClass("border border-black border-solid");

          // Add city name, date, and weather icon to current weather div
          var currentTitle = $("<h1>");
          var currentDay = moment().format("M/D/YYYY");
          currentTitle.text(`${cityName} (${currentDay})`);
          var currentIcon = $("<img>");
          var currentIconCode = response.current.weather[0].icon;
          currentIcon.attr(
            "src",
            `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`
          );
          currentTitleCont.append(currentTitle);
          currentTitleCont.append(currentIcon);

          // Add current temp
          var currentTemp = $("<p>");
          currentTemp.text(
            "Temperature: " + response.current.temp + " \u00B0F"
          );

          // Add current humidity
          var currentHumidity = $("<p>");
          currentHumidity.text("Humidity: " + response.current.humidity + "%");

          // Add current wind speed
          var currentWind = $("<p>");
          currentWind.text(
            "Wind Speed: " + response.current.wind_speed + " MPH"
          );

          // Add UV index
          var currentUV = $("<p>");
          currentUV.text("UV Index: ");
          var currentNumber = $("<p>");
          currentNumber.text(response.current.uvi);

          // UV background color
          if (response.current.uvi <= 2) {
            currentNumber.addClass("bg-green-400");
          } else if (response.current.uvi >= 3 && response.current.uvi <= 7) {
            currentNumber.addClass("bg-yellow-400");
          } else {
            currentNumber.addClass("bg-red-400");
          }

          // Append all p elements
          currentWeatherDiv.append(currentTemp);
          currentWeatherDiv.append(currentHumidity);
          currentWeatherDiv.append(currentWind);
          currentWeatherDiv.append(currentUV);
          currentWeatherDiv.append(currentNumber);
        })
        .catch(function (err) {
          // Reset search input
          searchInputEl.val("");

          // Alert user that there was an error
          alert("We could not find the city that you searched for.");
        });
    });
}
