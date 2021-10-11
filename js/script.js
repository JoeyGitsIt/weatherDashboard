var requestWeather = "";
var searchButton = $('.searchBtn');
var openWeatherKey = "db932346e7591a074277a543296e18b3";
var buttons = $('.btn');

function init() {
  displayHistory();
}

function weatherURL(queryValue) {
  return "https://api.openweathermap.org/data/2.5/weather?q=" + queryValue + "&appid=" + openWeatherKey + "&units=imperial"
}

function searchCity(event) {
  //  OpenWeather Onecall API does not allow a query based on city, have to make a current weather call first to return lat/lon for the city then rerun an API request for that lat/lon
  var textInput = $("#citySearch")[0].value;
  var buttonValue = event.target.innerText;

  if (textInput) {
    requestWeather = weatherURL(textInput);
  }
  else {
    requestWeather = weatherURL(buttonValue);
  }
  $("section").css("display", "initial");

  $.ajax({
    url: requestWeather,
    method: 'GET',
  }).then(function (response) {
    var displayCityDate = $('#cityDate');
    var latitude = response.coord.lat;
    var longitude = response.coord.lon;
    var displayTime = new Date(parseInt(response.dt)*1000);
    var [month, day, year] = [displayTime.getMonth()+1, displayTime.getDate(), displayTime.getFullYear()];

    displayCityDate.text(`${response.name} (${month}/${day}/${year})`);
    fetchFiveDay(latitude, longitude, openWeatherKey);
    if (textInput) {
      saveHistory(response.name);
    }
    $("#citySearch")[0].value = '';
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
  uvIndex.text("UV Index: " + weatherData.current.uvi + " %");
}

function displayFiveDay(fiveDayData) {
  var date = $('.card-title');
  var forecastTemp = $('.forecastTemp');
  var forecastWind = $('.forecastWind');
  var forecastHumidity = $('.forecastHumidity');

  for (var i = 0; i < 5; i++) {
    var displayForecastTime = new Date(parseInt(fiveDayData.daily[i+1].dt)*1000);
    var [month, day, year] = [displayForecastTime.getMonth()+1, displayForecastTime.getDate(), displayForecastTime.getFullYear()];
    date[i].textContent = `${month}/${day}/${year}`;
    forecastTemp[i].textContent = "Temp: " + fiveDayData.daily[i+1].temp.day + "°F";
    forecastWind[i].textContent = "Wind: " + fiveDayData.daily[i+1].wind_speed + " MPH";
    forecastHumidity[i].textContent = "Humidity: " + fiveDayData.daily[i+1].humidity + " %";
  }
}

function saveHistory(responseName) {
  if (responseName) {
    var history = JSON.parse(window.localStorage.getItem("history")) || [];
    if (history.includes(responseName) == false) {
      history.unshift(responseName);
      displayOneHistory(responseName);
    }
    if (history.length > 8) {
        history.pop();
    }
    window.localStorage.setItem("history", JSON.stringify(history));
  }
}

function displayHistory() {
  var searchHistory = JSON.parse(window.localStorage.getItem('history'));
  if (searchHistory) {
    for (var i = 0; i<searchHistory.length; i++) {
      var city = searchHistory[i];
      displayOneHistory(city);
    }
  }
}

function displayOneHistory(city) {
  var cityButton = document.createElement('button');
  searchButton.after(cityButton);
  $(cityButton).addClass("historyBtn btn btn-success btn-block");
  cityButton.textContent = city;
  $(cityButton).click(searchCity);
}

init();
buttons.click(searchCity);
