var userFormEl = document.getElementById("user-form");
var userInputEl = document.getElementById("city-input");

var formSubmitHandler = function (event) {
  event.preventDefault();

  // get value from input element
  var cityName = userInputEl.value.trim();

  if (cityName) {
    alert("Nice!");
  } else {
    alert("Not Nice!");
  }
};

userFormEl.addEventListener("submit", formSubmitHandler);
