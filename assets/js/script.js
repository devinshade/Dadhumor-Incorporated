var form = document.getElementById('search-form');
var cityInput = document.getElementById('city-input');
var weatherInfo = document.getElementById('weather-info');
var weatherEl = document.getElementById('weather');
var temperatureEl = document.getElementById('temperature');
var humidityEl = document.getElementById('humidity');
var windSpeedEl = document.getElementById('wind-speed');
var forecastElement = document.getElementById('forecast');
var city = document.getElementById('city');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  var cityName = cityInput.value;

  searchCity(cityName);
  localStorage.setItem("City", cityName);

  var cityLoc = localStorage.getItem("City");
  var button = document.createElement("button");
  var textNode = document.createTextNode(cityLoc);

  city.appendChild(textNode);

  button.addEventListener("click", function() {
    searchCity(cityLoc);
  });

});

function searchCity (cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=3fffc9c73357ea67188499b2d5865e2b`)
    .then(response => response.json())
    .then(data => { 

        // Logs the data pulled from the API
        console.log("Current Weather: ", data);

      // Retrieves specific data from the API and puts it into variables
      var icon = data.weather[0].icon
      var weather = `https://openweathermap.org/img/wn/${icon}@2x.png`; // links to the openweathermap icons
      var temperature = data.main.temp;
      var humidity = data.main.humidity;
      var windSpeed = data.wind.speed;
      
      // Adds the retrieved data to the HTML element 
      weatherEl.src = `${weather}`;
      temperatureEl.textContent = `Temperature: ${temperature}°F`;
      humidityEl.textContent = `Humidity: ${humidity}%`;
      windSpeedEl.textContent = `Wind Speed: ${windSpeed} m/s`;

      // Displays weather info in a block
      weatherInfo.style.display = 'block';
    })

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=3fffc9c73357ea67188499b2d5865e2b`)
    .then(response => response.json())
    .then(data => {

        // Logs the data pulled from the API
        console.log("Forecast: ", data);

      // Sets the data list as a variable
      var forecastData = data.list;
      
      // Erases the weather cards for the currently displayed city when a new city is searched
      forecastElement.innerHTML = '';

        // For loop that skips duplicate data(days)
        for (var i = 0; i < forecastData.length; i = i + 8){

        // Creates a new Date object using the value of forecastData[i].dt_txt, then stringifies it into MM/DD/YYYY
        var forecastDate = new Date(forecastData[i].dt_txt).toLocaleDateString();
 
        // Creates an array for each var
        var highTemp = forecastData[i].main.temp_max;
        var lowTemp = forecastData[i].main.temp_min;
        var windSpeed = forecastData[i].wind.speed;
        var humidity = forecastData[i].main.humidity;
        var weatherIcon = forecastData[i].weather[0].icon
        var iconURL = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  
        // Creates the cards for the 5 day forecast based on each array
        var forecastCard = document.createElement('div');
        forecastCard.className = 'col s12 m6 l5';
        forecastCard.innerHTML = `
          <div class="card deep-purple darken-4">
            <div class="card-content white-text">
              <span class="card-title">${forecastDate}</span>
              <img src="${iconURL}"></img>
              <p>High Temp: ${highTemp}°F</p>
              <p>Low Temp: ${lowTemp}°F</p>
              <p>Wind Speed: ${windSpeed} m/s</p>
              <p>Humidity: ${humidity}%</p>
            </div>
          </div>
        `;
  
        // Appends the data to the HTML
        forecastElement.appendChild(forecastCard);
      };
    })
    .catch(error => {
      console.error('Error:', error);
    });
    };