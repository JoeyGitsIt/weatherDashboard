/* Things I have:
    API call function
    IDs for city

  Things I need:
    Save search data to local storage
    styling
    write function to display icons and put icons on page in the spots they need to go
    make sure that all stuff is hidden on page load (only show search and recent history)
    color code uvi
*/


// formulas for:
// Search for city, grabs api data for that city and 
// init function might be hiding everything to the right initially??
// need a searchHistory function that adds a new button each time a city is searched for up to 8
var requestWeather = "some link";
var searchButton = $('.searchBtn');
var historyButton = $('.historyBtn');
var openWeatherKey = "db932346e7591a074277a543296e18b3";
// var textInput = $("#citySearch")[0].value;

function init() {
  displayHistory();
}


function searchCity() {
  //  OpenWeather Onecall API does not allow a query based on city, have to make a current weather call first to return lat/lon for the city then rerun an API request for that lat/lon
  var textInput = $("#citySearch")[0].value;
  var buttonValue = $(".historyBtn")[0].innerText;

  console.log(buttonValue);

  if (textInput) {
    requestWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + textInput + "&appid=" + openWeatherKey + "&units=imperial";
  }
  else {
    requestWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + buttonValue + "&appid=" + openWeatherKey + "&units=imperial";
  }


  $.ajax({
    url: requestWeather,
    method: 'GET',
  }).then(function (response) {
    var displayCityDate = $('#cityDate');
    var latitude = response.coord.lat;
    var longitude = response.coord.lon;
    var displayTime = new Date(parseInt(response.dt)*1000);
    var [month, day, year] = [displayTime.getMonth()+1, displayTime.getDate(), displayTime.getFullYear()];

    // still need to display dumb cloud/weather icon
    displayCityDate.text(`${response.name} (${month}/${day}/${year})`);
    fetchFiveDay(latitude, longitude, openWeatherKey);
    saveHistory(response.name);
    console.log('Ajax Reponse \n-------------');
    console.log(response);
  });
}

function fetchFiveDay(lat, lon, key) {
  requestFiveDay = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=imperial";

  $.ajax({
    url: requestFiveDay,
    method: 'GET',
  }).then(function (response) {
    displayCurrentWeather(response);
    displayFiveDay(response);
    console.log('Ajax Reponse \n-------------');
    console.log(response);
  });
}

function displayCurrentWeather(weatherData) {
  var temp = $('#cityTemp');
  var wind = $('#cityWind');
  var humidity = $('#cityHumidity');
  var uvIndex = $('#cityUV');

  temp.text("Temp: " + weatherData.current.temp + "°F");
  wind.text("Wind: " + weatherData.current.wind_speed + " MPH");
  humidity.text("Humidity: " + weatherData.current.humidity + " %");
  // if statement to add attribute green/yellow/red depending on uvi value
  uvIndex.text("UV Index: " + weatherData.current.uvi + " %");
}

function displayFiveDay(fiveDayData) {
  console.log(fiveDayData);
  var date = $('.card-title');
  var forecastImg = $('.forecastImg');
  var forecastTemp = $('.forecastTemp');
  var forecastWind = $('.forecastWind');
  var forecastHumidity = $('.forecastHumidity');

  for (var i = 0; i < 5; i++) {
    var displayForecastTime = new Date(parseInt(fiveDayData.daily[i+1].dt)*1000);
    var [month, day, year] = [displayForecastTime.getMonth()+1, displayForecastTime.getDate(), displayForecastTime.getFullYear()];
    // still need to display dumb cloud/weather icon
    date[i].textContent = `${month}/${day}/${year}`;
    // forecastImg.text("UV Index: " + fiveDayData.daily.uvi + " %"); this is image
    forecastTemp[i].textContent = "Temp: " + fiveDayData.daily[i+1].temp.day + "°F";
    forecastWind[i].textContent = "Wind: " + fiveDayData.daily[i+1].wind_speed + " MPH";
    forecastHumidity[i].textContent = "Humidity: " + fiveDayData.daily[i+1].humidity + " %";
  }
}

function saveHistory(responseName) {
  if (responseName) {
    var history = JSON.parse(window.localStorage.getItem("history")) || [];
    console.log(history);

    if (history.includes(responseName) == false) {
      history.unshift(responseName);
    }

    if (history.length > 8) {
        history.pop();
    }
    
    window.localStorage.setItem("history", JSON.stringify(history));
  // puts the saveWeather functions information into an array that also stores history of previously searched city's weather data
  // or just save city search and make a new call for that city again...
  // console.log(saveTextInput);
  }
}

function displayHistory() {
  var searchHistory = JSON.parse(window.localStorage.getItem('history'));
  var searchButton = $('.searchBtn');

  if (searchHistory) {
    for (var i = 0; i<searchHistory.length; i++) {
      var city = searchHistory[i];
      var cityButton = document.createElement('button');
  
      searchButton.after(cityButton);
      $(cityButton).addClass("historyBtn btn btn-success btn-block");
      cityButton.textContent = city;
      console.log(cityButton);
    }
  }
}

function displayWeatherIcon() {
  // displays weather icon based on current weather reading for the city

}


searchButton.click(searchCity);
historyButton.click(searchCity);

init();