// formulas for:
// Search for city, grabs api data for that city and 
// init function might be hiding everything to the right initially??
// need a searchHistory function that adds a new button each time a city is searched for up to 8
var requestWeather = "some link";
var searchButton = $('.searchBtn');
var openWeatherKey = "";

function searchCity(event) {
  //  OpenWeather Onecall API does not allow a query based on city, have to make a current weather call first to return lat/lon for the city then rerun an API request for that lat/lon
  var textInput = $("#citySearch")[0].value;

  console.log(event);
  console.log(textInput);

  requestWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + textInput + "&appid=" + openWeatherKey;

  console.log(requestWeather);
  $.ajax({
    url: requestWeather,
    method: 'GET',
  }).then(function (response) {
    console.log('Ajax Reponse \n-------------');
    console.log(response);
  });
}

function displayWeather () {
  // displays all relevant information on the right
  // css tag will display none and then this function will take take that css styling away
}

function saveWeather() {
  // saves weather data to local storage
}

function saveHistory() {
  // puts the saveWeather functions information into an array that also stores history of previously searched city's weather data
  // or just save city search and make a new call for that city again...
}

function displayWeatherIcon() {
  // displays weather icon based on current weather reading for the city
}

function displayUVIndex () {
  // sets background color based on numbers for UV Index
}

searchButton.click(searchCity);