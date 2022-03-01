var apiKey = "704210508ac4b5ba6d3818353b3a15d4";
var savedSearches = [];
var currentWeatherDiv = $("#current-weather");
var currentWeatherCont = $("#current-weather-container");
var currentTitleCont = $("#current-title-container");
var forecastCardContainer = $("#forecast-container");
var currentForecastTitle = $("#current-forecast-title");

// List of previously searched cities
function searchHistoryList(cityName) {
  // Create entry with city name
  var searchHistoryEntry = $("<button>");
  searchHistoryEntry.addClass(
    "bg-gray-400 rounded-md text-black text-center font-medium h-8 w-96 mt-5"
  );
  searchHistoryEntry.text(cityName);

  // Append entry to container
  $("#history").append(searchHistoryEntry);
  $("#history").addClass("border-gray-400 border-t-2 border-solid");

  if (savedSearches.length > 0) {
    // Update savedSearches array with previously saved searches
    var previousSavedSearches = localStorage.getItem("savedSearches");
    savedSearches = JSON.parse(previousSavedSearches);
  }

  // Add city name to array of saved searches
  savedSearches.push(cityName);
  localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

  // Reset search
  $("#city-input").val("");
}

function loadSearchHistory() {
  // Get saved search history
  var savedSearchHistory = localStorage.getItem("savedSearches");

  // Return false if there is no previous searches
  if (!savedSearchHistory) {
    return false;
  }

  // Turn saved search history string into array
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
    // Get response and turn it into objects
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (response) {
          var cityLon = response.coord.lon;
          var cityLat = response.coord.lat;

          fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
          )
            // Get response from one call api and turn it into objects
            .then(function (response) {
              return response.json();
            })
            // Get data from response and apply them to the current weather section
            .then(function (response) {
              searchHistoryList(cityName);

              // Remove class to display border
              currentWeatherDiv.removeClass("hidden");

              // Add classes to current weather div
              currentWeatherDiv.addClass(
                "border border-black border-solid mt-4 mr-10 h-50"
              );

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
              currentTitle.addClass("text-3xl font-bold mb-2 ml-1 mt-1");
              currentIcon.addClass("inline h-11 w-11 pb-1");
              currentTitleCont.append(currentTitle);
              currentTitle.append(currentIcon);

              // Add current temp
              var currentTemp = $("<p>");
              currentTemp.attr("id", "removal");
              currentTemp.text(
                "Temperature: " + response.current.temp + " \u00B0F"
              );
              currentTemp.addClass("mb-2 ml-1");

              // Add current humidity
              var currentHumidity = $("<p>");
              currentHumidity.attr("id", "removal");
              currentHumidity.text(
                "Humidity: " + response.current.humidity + "%"
              );
              currentHumidity.addClass("mb-2 ml-1");

              // Add current wind speed
              var currentWind = $("<p>");
              currentWind.attr("id", "removal");
              currentWind.text(
                "Wind Speed: " + response.current.wind_speed + " MPH"
              );
              currentWind.addClass("mb-2 ml-1");

              // Add UV index
              var currentUV = $("<p>");
              currentUV.text("UV Index: ");
              currentUV.attr("id", "removal");
              var currentNumber = $("<p>");
              currentNumber.attr("id", "removal");
              currentNumber.text(response.current.uvi);
              currentNumber.addClass(
                "inline w-12 text-white px-3 rounded-md mb-2 ml-1"
              );
              currentUV.addClass("mb-2 ml-1");

              // UV background color
              if (response.current.uvi <= 2) {
                currentNumber.addClass("bg-green-400");
              } else if (
                response.current.uvi >= 3 &&
                response.current.uvi <= 7
              ) {
                currentNumber.addClass("bg-yellow-400");
              } else {
                currentNumber.addClass("bg-red-400");
              }

              // Append all p elements
              currentWeatherCont.append(currentTemp);
              currentWeatherCont.append(currentHumidity);
              currentWeatherCont.append(currentWind);
              currentWeatherCont.append(currentUV);
              currentUV.append(currentNumber);
            });
        });
      } else {
        // I did this in sort of a hacky way, I couldn't for the life of me figure out how to paint the DOM before the alert, even with googling (not really sure it's possible). So I set a timeout on the alert, so the DOM would hide before the alert and not leave false information in the back when the city name is wrong.
        $("#current-weather").addClass("hidden");
        setTimeout(function () {
          alert("Please enter name of city.");
        }, 20);
      }
    });
}

function fiveDay(cityName) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  )
    // Get response and turn it into objects
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (response) {
          var cityLon = response.coord.lon;
          var cityLat = response.coord.lat;

          fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
          )
            // Get response from one call api and turn it into objects
            .then(function (response) {
              return response.json();
            })
            .then(function (response) {
              // 5 Day Forecast title, prepended to appear at the top
              var futureForecast = $("<h2>");
              futureForecast.attr("id", "title-h2");
              futureForecast.text("5-Day Forecast:");
              futureForecast.addClass("text-2xl font-bold my-2");
              currentForecastTitle.prepend(futureForecast);

              // Loop to create all the cards for each day
              for (var i = 1; i <= 5; i++) {
                // All DOM elements for each card, styled with Tailwind CSS classes
                var futureForecastCard = $("<div>");
                forecastCardContainer.append(futureForecastCard);
                futureForecastCard.addClass(
                  "flex flex-col w-40 mr-32 pr-4 pl-2 pt-1 pb-2 mt-2 bg-blue-500 text-left text-white rounded-md"
                );

                var futureForecastDate = $("<p>");
                futureForecastDate.addClass("text-lg font-bold");
                var date = moment().add(i, "d").format("M/D/YYYY");
                futureForecastDate.text(date);
                futureForecastCard.append(futureForecastDate);

                var futureIcon = $("<img>");
                futureIcon.addClass("w-14 h-14");
                var futureIconCode = response.daily[i].weather[0].icon;
                futureIcon.attr(
                  "src",
                  `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`
                );
                futureForecastCard.append(futureIcon);

                var futureTemp = $("<p>");
                futureTemp.addClass("mb-2");
                futureTemp.text(
                  "Temp: " + response.daily[i].temp.day + " \u00B0F"
                );
                futureForecastCard.append(futureTemp);

                var futureWind = $("<p>");
                futureWind.addClass("mb-2");
                futureWind.text(
                  "Wind: " + response.daily[i].wind_speed + " MPH"
                );
                futureForecastCard.append(futureWind);

                var futureHumidity = $("<p>");
                futureHumidity.addClass("mb-2");
                futureHumidity.text(
                  "Humidity: " + response.daily[i].humidity + "%"
                );
                futureForecastCard.append(futureHumidity);
              }
            });
        });
      }
    });
}

// Function to reset weather divs, so you're not constantly appending over another
function resetDivs() {
  $("#current-title-container").empty();
  $("#current-weather-container").empty();
  $("#forecast-container").empty();
  $("#title-h2").remove();
}

// Called when the search form is submitted
$("#user-form").on("submit", function () {
  event.preventDefault();

  // Get name of city searched
  var cityName = $("#city-input").val();

  if (cityName === "" || cityName == null) {
    // Send alert if search input is empty when submitted
    alert("Please enter name of city.");
    event.preventDefault();
  } else {
    // If cityName is valid, clear DOM divs, add city to search history list and display it's weather conditions
    resetDivs();
    currentWeather(cityName);
    fiveDay(cityName);
  }
});

$("#history").on("click", "button", function () {
  // get text (city name) of entry and pass it as a parameter to display weather conditions
  var previousCityName = $(this).text();
  currentWeather(previousCityName);
  fiveDay(previousCityName);

  resetDivs();
});
