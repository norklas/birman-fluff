var apiKey = "704210508ac4b5ba6d3818353b3a15d4";
var savedSearches = [];
var searchInputEl = $("#city-input");
var searchFormEl = $("#user-form");
var searchHistoryEl = $("#history");

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
